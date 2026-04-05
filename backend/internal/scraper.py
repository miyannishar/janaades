"""
Parliament bill scraper — internal core logic.
Scrapes both chambers:
  HOR: https://hr.parliament.gov.np/en/bills?type=state&ref=BILL
  NA:  https://na.parliament.gov.np/en/bills?type=state&ref=BILL

PDF strategy:
  - Fetch PDF bytes in-memory → extract text with pdfplumber
  - Pass metadata + text to GPT (ONE call) for structured fields + analysis
  - Store only the pdf_url in DB (no local file)
"""

import asyncio
import logging
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Optional
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup

from internal.config import settings
from internal.ai import parse_and_analyze, extract_pdf_text
from internal.db import get_client

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# Source definitions
# ─────────────────────────────────────────────

@dataclass
class Source:
    chamber: str          # 'HOR' or 'NA'
    base_url: str
    bills_url: str
    label: str

SOURCES: list[Source] = [
    Source(
        chamber="HOR",
        base_url="https://hr.parliament.gov.np",
        bills_url="https://hr.parliament.gov.np/en/bills?type=state&ref=BILL",
        label="House of Representatives",
    ),
    Source(
        chamber="NA",
        base_url="https://na.parliament.gov.np",
        bills_url="https://na.parliament.gov.np/en/bills?type=state&ref=BILL",
        label="National Assembly",
    ),
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    )
}
REQUEST_DELAY = 1.5
MAX_RETRIES   = 3

# ─────────────────────────────────────────────
# Status normalisation
# ─────────────────────────────────────────────

STATUS_MAP: dict[str, str] = {
    # HOR statuses
    "distribution to member":              "introduced",
    "present in house of representatives": "introduced",
    "general discussion":                  "general_discussion",
    "discussion in house":                 "general_discussion",
    "discussion in committee":             "in_committee",
    "report submitted by committee":       "committee_reported",
    "passed by house":                     "passed",
    "passed/return by national assembly":  "passed_national_assembly",
    "repassed":                            "repassed",
    "authenticated":                       "authenticated",
    # NA statuses (some appear as i18n keys from their CMS)
    "homepage.assembly_passed":            "passed_national_assembly",
    "assembly passed":                     "passed_national_assembly",
    "passed by national assembly":         "passed_national_assembly",
    "distribution to members":             "introduced",
    "present in national assembly":        "introduced",
}

def _map_status(raw: str) -> str:
    return STATUS_MAP.get(raw.strip().lower(), "introduced")


# ─────────────────────────────────────────────
# Low-level helpers
# ─────────────────────────────────────────────

async def _fetch(client: httpx.AsyncClient, url: str, retries: int = MAX_RETRIES) -> Optional[str]:
    for attempt in range(retries):
        try:
            r = await client.get(url, timeout=30)
            r.raise_for_status()
            return r.text
        except Exception as exc:
            wait = 2 ** attempt
            logger.warning(f"  ✗ [{attempt+1}/{retries}] {url} → {exc}. Retry in {wait}s")
            await asyncio.sleep(wait)
    logger.error(f"  ✗ Gave up on {url}")
    return None


async def _fetch_bytes(client: httpx.AsyncClient, url: str) -> Optional[bytes]:
    try:
        r = await client.get(url, timeout=60, follow_redirects=True)
        r.raise_for_status()
        return r.content
    except Exception as exc:
        logger.warning(f"  PDF fetch failed ({url}): {exc}")
        return None


# ─────────────────────────────────────────────
# Listing page parser
# ─────────────────────────────────────────────

def _parse_bills_list(html: str, source: Source) -> list[dict]:
    soup  = BeautifulSoup(html, "lxml")
    table = soup.find("table")
    if not table or not table.find("tbody"):
        logger.error(f"  [{source.chamber}] Bills list table not found")
        return []

    bills: list[dict] = []
    rows = table.find("tbody").find_all("tr")
    logger.info(f"  [{source.chamber}] Parsing {len(rows)} rows")

    for i, row in enumerate(rows):
        cols = row.find_all("td")
        if len(cols) < 6:
            continue
        try:
            # col[0]=Session  col[1]=RegNo  col[2]=Year(BS date)
            # col[3]=Title    col[4]=Ministry  col[5]=Status  col[6]=View button
            session_txt = cols[0].get_text(strip=True)
            reg_no_txt  = cols[1].get_text(strip=True)
            year        = cols[2].get_text(strip=True)
            title_td    = cols[3]
            title       = title_td.get_text(strip=True)
            ministry    = cols[4].get_text(strip=True)
            raw_status  = cols[5].get_text(strip=True) if len(cols) > 5 else ""
            link_a      = (cols[6].find("a") if len(cols) > 6 else None) or title_td.find("a")
            detail_url  = urljoin(source.base_url, link_a["href"]) if link_a else None

            bills.append({
                "registration_no":   int(reg_no_txt) if reg_no_txt.isdigit() else None,
                "session":           int(session_txt) if session_txt.isdigit() else None,
                "year_bs":           year,
                "title":             title,
                "ministry":          ministry,
                "parliament_status": raw_status,
                "status":            _map_status(raw_status),
                "source_url":        detail_url,
                "chamber":           source.chamber,
            })
        except Exception as exc:
            logger.warning(f"  Row {i} parse error: {exc}")

    logger.info(f"  [{source.chamber}] Parsed {len(bills)} bills")
    return bills


def _detect_max_page(html: str, base_bills_url: str) -> int:
    """Find the highest page= number in pagination links on the page."""
    soup     = BeautifulSoup(html, "lxml")
    max_page = 1
    base     = base_bills_url.split("?")[0]  # strip query string for matching
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "page=" in href and base in href:
            try:
                num = int(href.split("page=")[1].split("&")[0])
                max_page = max(max_page, num)
            except ValueError:
                pass
    return max_page


# ─────────────────────────────────────────────
# Detail page: extract PDF URL
# ─────────────────────────────────────────────

def _extract_pdf_url(html: str, base_url: str) -> Optional[str]:
    soup = BeautifulSoup(html, "lxml")
    pdf_a = soup.find("a", href=lambda h: h and "/uploads/" in h)
    if not pdf_a:
        pdf_a = soup.find("a", href=lambda h: h and h.endswith(".pdf") and "parliament.gov.np" in h)
    if not pdf_a:
        pdf_a = soup.find("a", href=lambda h: h and h.endswith(".pdf") and not h.startswith("http"))
    if pdf_a and pdf_a.get("href"):
        href = pdf_a["href"]
        if href.startswith("/") or "parliament.gov.np" in href:
            return urljoin(base_url, href)
    return None


# ─────────────────────────────────────────────
# Supabase helpers
# ─────────────────────────────────────────────

def _bill_exists(source_url: str) -> Optional[dict]:
    """Return existing row dict (id, scrape_count, status, ai_analysis_at) or None.
    Uses source_url as the stable unique key — it's the parliament CMS's own bill slug.
    """
    if not source_url:
        return None
    db  = get_client()
    res = (
        db.table("bills")
        .select("id, scrape_count, status, ai_analysis_at")
        .eq("source_url", source_url)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def _upsert_bill(data: dict) -> Optional[int]:
    db  = get_client()
    row = {
        "title":              data.get("title"),
        "title_nepali":       data.get("title_nepali"),
        "ministry":           data.get("ministry"),
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
        "chamber":            data.get("chamber", "HOR"),
        # AI analysis fields
        "summary":            data.get("summary_en"),
        "summary_ne":         data.get("summary_ne"),
        "key_points":         data.get("key_points"),
        "affected_groups":    data.get("affected_groups"),
        "concerns":           data.get("concerns"),
        "opposition_analysis": data.get("opposition_analysis"),
        "embedding":          data.get("embedding"),
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

    existing = data.get("_existing")
    if existing:
        row["scrape_count"] = (existing.get("scrape_count") or 0) + 1
        res = (db.table("bills")
           .update(row)
           .eq("source_url", data["source_url"])
           .execute())
    else:
        row["scrape_count"] = 1
        res = db.table("bills").insert(row).execute()
    return res.data[0]["id"] if res.data else None


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
# Per-source scrape
# ─────────────────────────────────────────────

async def _scrape_source(client: httpx.AsyncClient, source: Source) -> dict:
    bills_found = new_cnt = updated_cnt = errors = 0

    # ── Detect total pages (pagination) ──
    first_html = await _fetch(client, source.bills_url)
    if not first_html:
        logger.error(f"  [{source.chamber}] Could not fetch bills list")
        return {"bills_found": 0, "new": 0, "updated": 0, "errors": 1}

    max_page = _detect_max_page(first_html, source.bills_url)
    logger.info(f"  [{source.chamber}] {max_page} page(s) detected")

    # ── Collect all bills across pages ──
    bills_list: list[dict] = []
    for page in range(1, max_page + 1):
        if page == 1:
            html = first_html
        else:
            paged_url = f"{source.bills_url}&page={page}"
            logger.info(f"  [{source.chamber}] Fetching page {page}/{max_page}: {paged_url}")
            html = await _fetch(client, paged_url)
            if not html:
                logger.warning(f"  [{source.chamber}] Page {page} fetch failed — skipping")
                continue
        page_bills = _parse_bills_list(html, source)
        logger.info(f"  [{source.chamber}] Page {page}: {len(page_bills)} bills")
        bills_list.extend(page_bills)

    bills_found = len(bills_list)
    logger.info(f"  [{source.chamber}] Total bills collected: {bills_found}")

    for i, bill in enumerate(bills_list, 1):
        reg_no = bill.get("registration_no")
        if not reg_no:
            errors += 1
            continue

        bill_t0 = time.monotonic()
        logger.info(f"  [{source.chamber}] [{i}/{bills_found}] Reg #{reg_no}: {bill.get('title','')[:60]}")
        try:
            existing = _bill_exists(bill.get("source_url", ""))
            bill["_existing"] = existing

            status_changed   = existing and existing.get("status") != bill.get("status")
            has_ai_analysis  = existing and existing.get("ai_analysis_at") is not None
            needs_ai         = not existing or not has_ai_analysis or status_changed

            if existing and not status_changed and has_ai_analysis:
                # ── Fast path: status unchanged + already analysed → status update only ──
                logger.info(f"    ↷ SKIP AI (status unchanged, analysis exists) | {bill.get('parliament_status','')}")
                _upsert_bill(bill)
                updated_cnt += 1
                await asyncio.sleep(0.2)  # minimal delay
                continue

            logger.info(f"    {'NEW' if not existing else 'STATUS CHANGED' if status_changed else 'RE-ANALYSE'} | {bill.get('parliament_status','')}")

            # ── Detail page → PDF URL ──
            pdf_url: Optional[str] = None
            detail_html: Optional[str] = None
            if bill.get("source_url"):
                detail_html = await _fetch(client, bill["source_url"])
                if detail_html:
                    pdf_url = _extract_pdf_url(detail_html, source.base_url)
                    if pdf_url:
                        bill["pdf_url"] = pdf_url
                        logger.info(f"    PDF: {pdf_url}")

            # ── PDF bytes → text ──
            ai_source_text  = ""
            ai_source_label = "page"

            if pdf_url and settings.openai_api_key:
                pdf_bytes = await _fetch_bytes(client, pdf_url)
                if pdf_bytes:
                    pdf_text = extract_pdf_text(pdf_bytes)
                    if pdf_text.strip():
                        ai_source_text  = pdf_text
                        ai_source_label = "pdf"
                        logger.info(f"    PDF text: {len(pdf_text):,} chars")

            if not ai_source_text and detail_html and settings.openai_api_key:
                ai_source_text  = BeautifulSoup(detail_html, "lxml").get_text(" ", strip=True)
                ai_source_label = "page"

            # ── AI: ONE call ──
            if ai_source_text and settings.openai_api_key:
                logger.info(f"    ↳ AI ({ai_source_label}, {len(ai_source_text):,} chars)")
                try:
                    meta_preamble = (
                        f"== Known metadata from parliament website ==\n"
                        f"Chamber      : {source.label}\n"
                        f"Title        : {bill.get('title', 'N/A')}\n"
                        f"Reg No       : {bill.get('registration_no', 'N/A')}\n"
                        f"Session      : {bill.get('session', 'N/A')}\n"
                        f"Year (BS)    : {bill.get('year_bs', 'N/A')}\n"
                        f"Ministry     : {bill.get('ministry', 'N/A')}\n"
                        f"Status       : {bill.get('parliament_status', 'N/A')}\n"
                        f"Source URL   : {bill.get('source_url', 'N/A')}\n"
                    )
                    ai_data = await parse_and_analyze(meta_preamble + ai_source_text, source=ai_source_label)
                    for k, v in ai_data.items():
                        if v is not None and not bill.get(k):
                            bill[k] = v
                    bill["ai_analysis_at"] = datetime.now(timezone.utc).isoformat()
                    
                    # Generate semantic embedding
                    from internal.ai import generate_embedding
                    emb_text = f"{bill.get('title', '')}\n{bill.get('summary_en', '')}\n{bill.get('opposition_analysis', '')}"
                    emb = await generate_embedding(emb_text)
                    if emb:
                        bill["embedding"] = emb
                        
                    logger.info(f"    ↳ AI filled: {[k for k in ai_data if ai_data[k] is not None]}")
                except Exception as ai_exc:
                    logger.warning(f"    ↳ AI failed: {ai_exc}")

            inserted_id = _upsert_bill(bill)
            elapsed = time.monotonic() - bill_t0
            logger.info(f"    ✓ {'Updated' if existing else 'Inserted'} in {elapsed:.1f}s")
            
            if needs_ai and inserted_id:
                from agent_system.jobs import run_bill_job
                asyncio.create_task(run_bill_job(inserted_id))


            if existing:
                updated_cnt += 1
            else:
                new_cnt += 1

            await asyncio.sleep(REQUEST_DELAY)

        except Exception as exc:
            logger.error(f"  Error on [{source.chamber}] reg #{reg_no}: {exc}", exc_info=True)
            errors += 1

    return {"bills_found": bills_found, "new": new_cnt, "updated": updated_cnt, "errors": errors}


# ─────────────────────────────────────────────
# Main orchestrator
# ─────────────────────────────────────────────

_scrape_running = False


async def run_scrape() -> dict:
    global _scrape_running
    if _scrape_running:
        return {"status": "already_running", "message": "A scrape is already in progress"}

    _scrape_running = True
    t0           = time.monotonic()
    totals       = {"bills_found": 0, "new": 0, "updated": 0, "errors": 0}
    status_str   = "success"
    msg          = ""
    duration     = 0.0

    try:
        logger.info("▶ Scrape started — both chambers")
        logger.info(f"  AI: {'enabled' if settings.openai_api_key else 'DISABLED (no OPENAI_API_KEY)'}")

        async with httpx.AsyncClient(headers=HEADERS, follow_redirects=True, verify=False) as client:
            for source in SOURCES:
                logger.info(f"\n── {source.label} ({source.chamber}) ──")
                result = await _scrape_source(client, source)
                for k in totals:
                    totals[k] += result.get(k, 0)

        duration   = time.monotonic() - t0
        status_str = "success" if totals["errors"] == 0 else "warning"
        msg        = (
            f"Done in {duration:.1f}s — "
            f"{totals['bills_found']} found, "
            f"{totals['new']} new, "
            f"{totals['updated']} updated, "
            f"{totals['errors']} errors"
        )
        logger.info(f"■ {msg}")

    except Exception as exc:
        duration   = time.monotonic() - t0
        status_str = "error"
        msg        = str(exc)
        logger.error(f"■ Scrape failed: {exc}", exc_info=True)
    finally:
        _scrape_running = False
        _log_scrape(
            totals["bills_found"], totals["new"], totals["updated"],
            totals["errors"], status_str, msg, duration,
        )

    return {
        "status":       status_str,
        "bills_found":  totals["bills_found"],
        "new_bills":    totals["new"],
        "updated":      totals["updated"],
        "errors":       totals["errors"],
        "duration_sec": round(duration, 2),
        "message":      msg,
    }
