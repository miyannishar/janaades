"""
Parliament bill scraper — internal core logic.
Scrapes https://hr.parliament.gov.np/en/bills?type=reg&ref=BILL
Writes results to Supabase (bills + scrape_logs tables).

PDF strategy:
  - Fetch PDF bytes in-memory → extract text with pdfplumber
  - Pass metadata + text to GPT (ONE call) for structured fields + analysis
  - Store only the pdf_url in DB (no local file)
"""

import asyncio
import logging
import time
from datetime import datetime, timezone
from typing import Any, Optional
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup

from internal.config import settings
from internal.ai import parse_and_analyze, extract_pdf_text
from internal.db import get_client

logger = logging.getLogger(__name__)

BASE_URL  = "https://hr.parliament.gov.np"
BILLS_URL = f"{BASE_URL}/en/bills?type=state&ref=BILL"

# Map parliament's display status → our DB status values
STATUS_MAP: dict[str, str] = {
    "distribution to member":            "introduced",
    "present in house of representatives": "introduced",
    "general discussion":                 "general_discussion",
    "discussion in house":                "general_discussion",
    "discussion in committee":            "in_committee",
    "report submitted by committee":      "committee_reported",
    "passed by house":                    "passed",
    "passed/return by national assembly": "passed_national_assembly",
    "repassed":                           "repassed",
    "authenticated":                      "authenticated",
}

def _map_status(raw: str) -> str:
    """Normalise the parliament's display status to a DB-safe value."""
    return STATUS_MAP.get(raw.strip().lower(), "introduced")

HEADERS   = {

    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    )
}
REQUEST_DELAY = 1.5
MAX_RETRIES   = 3


# ─────────────────────────────────────────────
# Low-level helpers
# ─────────────────────────────────────────────

async def _fetch(client: httpx.AsyncClient, url: str, retries: int = MAX_RETRIES) -> Optional[str]:
    for attempt in range(retries):
        try:
            logger.debug(f"  GET {url}  (attempt {attempt+1}/{retries})")
            r = await client.get(url, timeout=30)
            r.raise_for_status()
            logger.debug(f"  ✓ {url}  [{r.status_code}] {len(r.text):,} chars")
            return r.text
        except Exception as exc:
            wait = 2 ** attempt
            logger.warning(f"  ✗ [{attempt+1}/{retries}] {url} → {exc}. Retry in {wait}s")
            await asyncio.sleep(wait)
    logger.error(f"  ✗ Gave up on {url} after {retries} attempts")
    return None


async def _fetch_bytes(client: httpx.AsyncClient, url: str) -> Optional[bytes]:
    try:
        logger.debug(f"  GET (bytes) {url}")
        r = await client.get(url, timeout=60, follow_redirects=True)
        r.raise_for_status()
        logger.debug(f"  ✓ PDF bytes: {len(r.content):,} bytes")
        return r.content
    except Exception as exc:
        logger.warning(f"  PDF fetch failed ({url}): {exc}")
        return None


# ─────────────────────────────────────────────
# Listing page parser
# ─────────────────────────────────────────────

def _parse_bills_list(html: str) -> list[dict]:
    soup  = BeautifulSoup(html, "lxml")
    table = soup.find("table")
    if not table or not table.find("tbody"):
        logger.error("Bills list table not found — page structure may have changed")
        return []

    bills: list[dict] = []
    rows = table.find("tbody").find_all("tr")
    logger.info(f"  Parsing {len(rows)} table rows")

    for i, row in enumerate(rows):
        cols = row.find_all("td")
        if len(cols) < 6:
            continue
        try:
            # State page column layout:
            # col[0]=Session  col[1]=RegNo  col[2]=Year(BS date)
            # col[3]=Title    col[4]=Ministry  col[5]=Status  col[6]=View button
            session_txt = cols[0].get_text(strip=True)
            reg_no_txt  = cols[1].get_text(strip=True)
            year        = cols[2].get_text(strip=True)
            title_td    = cols[3]
            title       = title_td.get_text(strip=True)
            ministry    = cols[4].get_text(strip=True)
            raw_status  = cols[5].get_text(strip=True) if len(cols) > 5 else ""
            # View link is in col[6]; fallback to col[3] anchor
            link_a      = (cols[6].find("a") if len(cols) > 6 else None) or title_td.find("a")
            detail_url  = urljoin(BASE_URL, link_a["href"]) if link_a else None

            logger.debug(f"  Row {i}: reg={reg_no_txt!r} status={raw_status!r} title={title[:40]!r}")
            bills.append({
                "registration_no": int(reg_no_txt) if reg_no_txt.isdigit() else None,
                "session":  int(session_txt) if session_txt.isdigit() else None,
                "year_bs":  year,
                "title":    title,
                "ministry": ministry,
                "parliament_status": raw_status,          # raw display text
                "status":   _map_status(raw_status),      # normalised DB value
                "source_url": detail_url,
            })
        except Exception as exc:
            logger.warning(f"  Row {i} parse error: {exc}")

    logger.info(f"  Parsed {len(bills)} valid bills from table")
    return bills


# ─────────────────────────────────────────────
# Detail page: extract PDF URL only
# ─────────────────────────────────────────────

def _extract_pdf_url(html: str) -> Optional[str]:
    """Find the Registered Bill PDF download URL from the detail page."""
    soup = BeautifulSoup(html, "lxml")
    # Priority 1: /uploads/ path (parliament's upload directory)
    pdf_a = soup.find("a", href=lambda h: h and "/uploads/" in h)
    # Priority 2: .pdf link on parliament domain
    if not pdf_a:
        pdf_a = soup.find(
            "a",
            href=lambda h: h and h.endswith(".pdf") and "parliament.gov.np" in h,
        )
    # Priority 3: relative .pdf link
    if not pdf_a:
        pdf_a = soup.find(
            "a",
            href=lambda h: h and h.endswith(".pdf") and not h.startswith("http"),
        )
    if pdf_a and pdf_a.get("href"):
        href = pdf_a["href"]
        if href.startswith("/") or "parliament.gov.np" in href:
            return urljoin(BASE_URL, href)
    return None


# ─────────────────────────────────────────────
# Supabase helpers
# ─────────────────────────────────────────────

def _bill_exists(reg_no: int) -> bool:
    db = get_client()
    res = (
        db.table("bills")
        .select("id")
        .eq("registration_no", reg_no)
        .limit(1)
        .execute()
    )
    return bool(res.data)


def _upsert_bill(data: dict) -> None:
    db  = get_client()
    row = {
        "title":              data.get("title"),
        "title_nepali":       data.get("title_nepali"),
        "ministry":           data.get("ministry"),
        # Always write the latest status from the parliament website
        "status":             data.get("status", "introduced"),
        "source_url":         data.get("source_url"),
        "category":           data.get("category"),
        "registration_no":    data.get("registration_no"),
        "session":            data.get("session"),
        "year_bs":            data.get("year_bs"),
        "presenter":          data.get("presenter"),
        "governmental_type":  data.get("governmental_type"),
        "original_amendment": data.get("original_amendment"),
        "pdf_url":            data.get("pdf_url"),
        # AI analysis fields
        "summary":            data.get("summary_en"),
        "summary_ne":         data.get("summary_ne"),
        "key_points":         data.get("key_points"),
        "affected_groups":    data.get("affected_groups"),
        "concerns":           data.get("concerns"),
        "ai_analysis_at":     data.get("ai_analysis_at"),
        # Timeline
        "timeline_distribution":   data.get("timeline_distribution"),
        "timeline_present":        data.get("timeline_present"),
        "timeline_general_disc":   data.get("timeline_general_disc"),
        "timeline_committee_disc": data.get("timeline_committee_disc"),
        "timeline_report":         data.get("timeline_report"),
        "timeline_passed":         data.get("timeline_passed"),
        "timeline_authenticated":  data.get("timeline_authenticated"),
        "scrape_status": "active",
    }
    row = {k: v for k, v in row.items() if v is not None}

    if data.get("_exists"):
        row["scrape_count"] = data.get("scrape_count", 0) + 1
        db.table("bills").update(row).eq("registration_no", data["registration_no"]).execute()
    else:
        row["scrape_count"] = 1
        db.table("bills").insert(row).execute()


def _log_scrape(bills_found: int, new_bills: int, updated: int, errors: int,
                status: str, message: str, duration: float) -> None:
    db = get_client()
    db.table("scrape_logs").insert({
        "bills_found":   bills_found,
        "new_bills":     new_bills,
        "updated_bills": updated,
        "errors":        errors,
        "status":        status,
        "message":       message,
        "duration_sec":  round(duration, 2),
    }).execute()


# ─────────────────────────────────────────────
# Main orchestrator
# ─────────────────────────────────────────────

_scrape_running = False


async def run_scrape() -> dict:
    global _scrape_running
    if _scrape_running:
        return {"status": "already_running", "message": "A scrape is already in progress"}

    _scrape_running = True
    t0 = time.monotonic()
    bills_found = new_bills = updated = errors = 0
    status = "success"
    msg    = ""
    duration = 0.0

    try:
        logger.info("▶ Scrape started")
        logger.info(f"  Target URL : {BILLS_URL}")
        logger.info(f"  AI         : {'enabled' if settings.openai_api_key else 'DISABLED (no OPENAI_API_KEY)'}")

        async with httpx.AsyncClient(headers=HEADERS, follow_redirects=True, verify=False) as client:
            html = await _fetch(client, BILLS_URL)
            if not html:
                raise RuntimeError("Could not fetch bills list page")

            bills_list  = _parse_bills_list(html)
            bills_found = len(bills_list)
            logger.info(f"  Found {bills_found} bills on listing page")

            for i, bill in enumerate(bills_list, 1):
                reg_no = bill.get("registration_no")
                if not reg_no:
                    logger.warning(f"  [{i}] No registration_no — skipping")
                    errors += 1
                    continue

                bill_t0 = time.monotonic()
                logger.info(f"  [{i}/{bills_found}] ── Reg #{reg_no}: {bill.get('title', '')[:70]}")
                try:
                    exists     = _bill_exists(reg_no)
                    bill["_exists"] = exists
                    logger.info(f"    Status: {'UPDATE' if exists else 'NEW'}")

                    # ── Step 1: Fetch detail page → get PDF URL ──
                    pdf_url: Optional[str] = None
                    detail_html: Optional[str] = None
                    if bill.get("source_url"):
                        detail_html = await _fetch(client, bill["source_url"])
                        if detail_html:
                            pdf_url = _extract_pdf_url(detail_html)
                            if pdf_url:
                                bill["pdf_url"] = pdf_url
                                logger.info(f"    PDF URL: {pdf_url}")
                            else:
                                logger.info(f"    No PDF found on detail page")

                    # ── Step 2: Fetch PDF bytes → extract text ──
                    ai_source_text  = ""
                    ai_source_label = "page"

                    if pdf_url and settings.openai_api_key:
                        pdf_bytes = await _fetch_bytes(client, pdf_url)
                        if pdf_bytes:
                            pdf_text = extract_pdf_text(pdf_bytes)
                            if pdf_text.strip():
                                ai_source_text  = pdf_text
                                ai_source_label = "pdf"
                                logger.info(f"    PDF text extracted: {len(pdf_text):,} chars")
                            else:
                                logger.warning(f"    PDF text empty — falling back to page HTML")

                    # Fallback: use detail page HTML text
                    if not ai_source_text and detail_html and settings.openai_api_key:
                        ai_source_text  = BeautifulSoup(detail_html, "lxml").get_text(" ", strip=True)
                        ai_source_label = "page"

                    # ── Step 3: AI — ONE call for fields + analysis ──
                    if ai_source_text and settings.openai_api_key:
                        logger.info(f"    ↳ Calling AI ({ai_source_label}, {len(ai_source_text):,} chars)")
                        try:
                            # Prepend confirmed metadata so AI uses them as authoritative anchors
                            meta_preamble = (
                                f"== Known metadata from parliament website ==\n"
                                f"Title        : {bill.get('title', 'N/A')}\n"
                                f"Reg No       : {bill.get('registration_no', 'N/A')}\n"
                                f"Session      : {bill.get('session', 'N/A')}\n"
                                f"Year (BS)    : {bill.get('year_bs', 'N/A')}\n"
                                f"Ministry     : {bill.get('ministry', 'N/A')}\n"
                                f"Source URL   : {bill.get('source_url', 'N/A')}\n"
                                f"PDF URL      : {bill.get('pdf_url', 'N/A')}\n"
                                f"== {ai_source_label.upper()} content below ==\n\n"
                            )
                            full_text = meta_preamble + ai_source_text
                            ai_data   = await parse_and_analyze(full_text, source=ai_source_label)

                            # Merge AI results; don't overwrite confirmed scraped values
                            for k, v in ai_data.items():
                                if v is not None and not bill.get(k):
                                    bill[k] = v

                            bill["ai_analysis_at"] = datetime.now(timezone.utc).isoformat()
                            filled = [k for k in ai_data if ai_data[k] is not None]
                            logger.info(f"    ↳ AI filled: {filled}")
                        except Exception as ai_exc:
                            logger.warning(f"    ↳ AI call failed: {ai_exc}")

                    _upsert_bill(bill)
                    elapsed = time.monotonic() - bill_t0
                    logger.info(f"    ✓ {'Updated' if exists else 'Inserted'} #{reg_no} in {elapsed:.1f}s")

                    if exists:
                        updated += 1
                    else:
                        new_bills += 1

                    await asyncio.sleep(REQUEST_DELAY)

                except Exception as exc:
                    logger.error(f"  Error on reg #{reg_no}: {exc}", exc_info=True)
                    errors += 1

        duration = time.monotonic() - t0
        status   = "success" if errors == 0 else "warning"
        msg      = f"Done in {duration:.1f}s — {new_bills} new, {updated} updated, {errors} errors"
        logger.info(f"■ Scrape complete: {msg}")

    except Exception as exc:
        duration = time.monotonic() - t0
        status   = "error"
        msg      = str(exc)
        logger.error(f"■ Scrape failed: {exc}", exc_info=True)
    finally:
        _scrape_running = False
        _log_scrape(bills_found, new_bills, updated, errors, status, msg, duration)

    return {
        "status":       status,
        "bills_found":  bills_found,
        "new_bills":    new_bills,
        "updated":      updated,
        "errors":       errors,
        "duration_sec": round(duration, 2),
        "message":      msg,
    }
