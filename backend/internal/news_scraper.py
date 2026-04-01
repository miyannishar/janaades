from __future__ import annotations
"""
News scraper — OnlineKhabar political section
  URL: https://english.onlinekhabar.com/category/political

Flow:
  1. Fetch listing page → collect article URLs + thumbnail
  2. For each new article: fetch detail page → extract h1 + first paragraphs
  3. Upsert into public.activities (type='news', source_url = unique key)
"""

import asyncio
import logging
import time
import uuid
from datetime import datetime, timezone
from typing import Optional

import httpx
from bs4 import BeautifulSoup

from internal.db import get_client

logger = logging.getLogger(__name__)

LISTING_URL = "https://english.onlinekhabar.com/category/political"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}
REQUEST_DELAY = 1.0
MAX_ARTICLES = 20       # per run — don't hammer the site
MAX_RETRIES  = 2


# ─────────────────────────────────────────────
# HTTP helpers
# ─────────────────────────────────────────────

async def _fetch(client: httpx.AsyncClient, url: str) -> Optional[str]:
    for attempt in range(MAX_RETRIES):
        try:
            r = await client.get(url, timeout=20)
            r.raise_for_status()
            return r.text
        except Exception as exc:
            wait = 2 ** attempt
            logger.warning(f"  ✗ [{attempt+1}/{MAX_RETRIES}] {url} → {exc}. Retry in {wait}s")
            await asyncio.sleep(wait)
    logger.error(f"  ✗ Gave up on {url}")
    return None


# ─────────────────────────────────────────────
# Listing page parser
# ─────────────────────────────────────────────

def _parse_listing(html: str) -> list[dict]:
    """
    Returns list of {url, title, image_url} from the category listing page.
    OnlineKhabar uses <article> or <div class="ok-news-post"> cards.
    """
    soup = BeautifulSoup(html, "lxml")
    articles = []

    # Primary selector: article cards
    cards = soup.select("article") or soup.select(".ok-news-post") or soup.select(".jeg_post")

    # Fallback: find all <a> hrefs that look like article URLs
    if not cards:
        logger.warning("  No article cards found — falling back to link scan")
        seen = set()
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if (
                "onlinekhabar.com" in href
                and "/category/" not in href
                and "/tag/" not in href
                and "/page/" not in href
                and href not in seen
                and len(href) > 40
            ):
                seen.add(href)
                img = a.find("img")
                articles.append({
                    "url": href,
                    "title": a.get_text(strip=True)[:200] or "",
                    "image_url": img["src"] if img and img.get("src") else None,
                })
        return articles[:MAX_ARTICLES]

    for card in cards[:MAX_ARTICLES]:
        link = card.find("a", href=True)
        if not link:
            continue
        href = link["href"]
        if not href.startswith("http"):
            href = "https://english.onlinekhabar.com" + href

        # Title from heading inside card, or link text
        heading = card.find(["h2", "h3", "h4"])
        title = heading.get_text(strip=True) if heading else link.get_text(strip=True)
        title = title[:300]

        # Thumbnail
        img_tag = card.find("img")
        image_url = None
        if img_tag:
            image_url = img_tag.get("data-src") or img_tag.get("src")

        if href and title:
            articles.append({"url": href, "title": title, "image_url": image_url})

    logger.info(f"  Listing: found {len(articles)} article links")
    return articles


# ─────────────────────────────────────────────
# Article detail page parser
# ─────────────────────────────────────────────

def _parse_article(html: str) -> dict:
    """
    Returns {title, description, image_url, published_at}.
    published_at is ISO string or None.
    """
    soup = BeautifulSoup(html, "lxml")

    # ── Title ─────────────────────────────────────────────────────
    # og:title is the cleanest source on OnlineKhabar
    og_title = soup.find("meta", property="og:title")
    title = og_title["content"].strip() if og_title and og_title.get("content") else ""
    if not title:
        h1 = soup.find("h1")
        title = h1.get_text(strip=True) if h1 else ""
    if not title:
        tt = soup.find("title")
        title = tt.get_text(strip=True).split("|")[0].strip() if tt else ""

    # ── Description ───────────────────────────────────────────────
    # Start with og:description — it's the editorial summary (~1–2 sentences)
    og_desc = soup.find("meta", property="og:description")
    og_summary = og_desc["content"].strip() if og_desc and og_desc.get("content") else ""

    # Then try to get the full body text from the article
    body = (
        soup.select_one(".ok-single-post-content")
        or soup.select_one(".ok-news-detail-content")
        or soup.select_one(".entry-content")
        or soup.select_one('[class*="post-content"]')
        or soup.select_one('[class*="article-content"]')
        or soup.select_one("article")
    )
    full_text = ""
    if body:
        paras = [
            p.get_text(strip=True)
            for p in body.find_all("p")
            if len(p.get_text(strip=True)) > 30
        ]
        full_text = " ".join(paras[:4])[:900]

    # Prefer full body if it has more substance, else use og:description
    description = full_text if len(full_text) > len(og_summary) else og_summary
    if not description:
        description = og_summary

    # ── Thumbnail ─────────────────────────────────────────────────
    og_img = soup.find("meta", property="og:image")
    image_url = og_img["content"] if og_img and og_img.get("content") else None

    # ── Published date ────────────────────────────────────────────
    published_at: Optional[str] = None
    import json as _json
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = _json.loads(script.string or "")
            if isinstance(data, list):
                data = data[0]
            dt = data.get("datePublished") or data.get("dateModified")
            if dt:
                published_at = dt
                break
        except Exception:
            pass

    if not published_at:
        time_tag = soup.find("time", datetime=True)
        if time_tag:
            published_at = time_tag["datetime"]

    if not published_at:
        meta_dt = soup.find("meta", property="article:published_time")
        if meta_dt and meta_dt.get("content"):
            published_at = meta_dt["content"]

    return {
        "title":        title[:400],
        "description":  description[:800],
        "image_url":    image_url,
        "published_at": published_at,
    }



# ─────────────────────────────────────────────
# Supabase helpers
# ─────────────────────────────────────────────

def _article_exists(source_url: str) -> bool:
    db  = get_client()
    res = (
        db.table("activities")
        .select("id")
        .eq("source_url", source_url)
        .limit(1)
        .execute()
    )
    return bool(res.data)


def _upsert_article(data: dict) -> None:
    db  = get_client()
    # Parse published_at into a proper ISO timestamp
    date_str = data.get("published_at")
    if date_str:
        try:
            # Handles ISO 8601 with or without timezone
            from datetime import datetime as dt
            parsed = dt.fromisoformat(date_str.replace("Z", "+00:00"))
            date_iso = parsed.isoformat()
        except Exception:
            date_iso = datetime.now(timezone.utc).isoformat()
    else:
        date_iso = datetime.now(timezone.utc).isoformat()

    row = {
        "id":          str(uuid.uuid4()),   # required — no server default fires on upsert
        "type":        "news",
        "title":       data["title"],
        "description": data.get("description") or "",
        "source_url":  data["url"],
        "image_url":   data.get("image_url"),
        "date":        date_iso,
        "priority":    "medium",
    }
    row = {k: v for k, v in row.items() if v is not None}
    db.table("activities").upsert(row, on_conflict="source_url").execute()


# ─────────────────────────────────────────────
# Scrape lock (prevents concurrent runs)
# ─────────────────────────────────────────────

_news_scrape_running = False


async def run_news_scrape() -> dict:
    global _news_scrape_running
    if _news_scrape_running:
        return {"status": "already_running", "message": "News scrape already in progress"}

    _news_scrape_running = True
    t0          = time.monotonic()
    new_cnt     = 0
    skip_cnt    = 0
    error_cnt   = 0

    try:
        logger.info("▶ News scrape started — OnlineKhabar political")
        async with httpx.AsyncClient(headers=HEADERS, follow_redirects=True, verify=False) as client:

            # 1. Listing page
            listing_html = await _fetch(client, LISTING_URL)
            if not listing_html:
                return {"status": "error", "message": "Could not fetch listing page"}

            articles = _parse_listing(listing_html)
            logger.info(f"  {len(articles)} articles on listing page")

            # 2. Per-article detail fetch
            for i, article in enumerate(articles, 1):
                url = article["url"]
                logger.info(f"  [{i}/{len(articles)}] {url}")
                try:
                    if _article_exists(url):
                        logger.info(f"    ↷ already in DB — skip")
                        skip_cnt += 1
                        continue

                    detail_html = await _fetch(client, url)
                    if not detail_html:
                        error_cnt += 1
                        continue

                    detail = _parse_article(detail_html)

                    # Prefer richer title from detail page
                    if detail["title"] and len(detail["title"]) > len(article["title"]):
                        article["title"] = detail["title"]
                    if detail["description"]:
                        article["description"] = detail["description"]
                    if detail["image_url"] and not article.get("image_url"):
                        article["image_url"] = detail["image_url"]
                    article["published_at"] = detail.get("published_at")

                    _upsert_article(article)
                    logger.info(f"    ✓ Inserted: {article['title'][:60]}")
                    new_cnt += 1

                    await asyncio.sleep(REQUEST_DELAY)

                except Exception as exc:
                    logger.error(f"    ✗ Error on {url}: {exc}", exc_info=True)
                    error_cnt += 1

        duration = time.monotonic() - t0
        msg = f"Done in {duration:.1f}s — {new_cnt} new, {skip_cnt} skipped, {error_cnt} errors"
        logger.info(f"■ News scrape: {msg}")
        return {
            "status": "success" if error_cnt == 0 else "warning",
            "new": new_cnt,
            "skipped": skip_cnt,
            "errors": error_cnt,
            "duration_sec": round(duration, 2),
            "message": msg,
        }

    except Exception as exc:
        duration = time.monotonic() - t0
        logger.error(f"■ News scrape failed: {exc}", exc_info=True)
        return {"status": "error", "message": str(exc), "duration_sec": round(duration, 2)}
    finally:
        _news_scrape_running = False
