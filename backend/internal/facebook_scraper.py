"""
Facebook scraper — Playwright headless Chromium
  Source: https://www.facebook.com/officialroutineofnepalbanda (public page)

Why Playwright instead of Graph API:
  Facebook's "Page Public Content Access" feature requires business verification.
  A headless browser can read any public page without API permissions, just like
  a regular visitor.

Flow:
  1. Launch Chromium headless, navigate to the public page
  2. Dismiss any login pop-up
  3. Scroll to load more posts
  4. Extract post text + permalink from the rendered DOM
  5. Run each post through OpenAI (or keyword heuristic) to classify
  6. Upsert political posts into public.activities (type='social')
"""

import asyncio
import json
import logging
import re
import time
import uuid
from datetime import datetime, timezone
from typing import Optional

from openai import AsyncOpenAI
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

from internal.config import settings
from internal.db import get_client

logger = logging.getLogger(__name__)

FB_PAGE_URL = f"https://www.facebook.com/{settings.fb_page_slug}"
MAX_POSTS   = 20
SCROLL_PAUSE = 2.0   # seconds to wait after each scroll


# ─────────────────────────────────────────────
# Browser scrape
# ─────────────────────────────────────────────

async def _scrape_page_posts() -> list[dict]:
    """
    Open the public Facebook page in headless Chromium and return raw posts:
    [{"text": "...", "url": "https://www.facebook.com/..."}]
    """
    posts: list[dict] = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
                "--disable-gpu",
            ],
        )
        ctx = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
            locale="en-US",
        )
        page = await ctx.new_page()

        # Block heavy resources — we only need HTML+JS
        await page.route(
            "**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2,mp4,mp3}",
            lambda r: r.abort(),
        )

        logger.info(f"  → Navigating to {FB_PAGE_URL}")
        try:
            await page.goto(FB_PAGE_URL, wait_until="domcontentloaded", timeout=30_000)
        except PWTimeout:
            logger.warning("  Page load timed out — trying anyway")

        await page.wait_for_timeout(3000)

        # ── Dismiss login / cookie dialogs ──────────────────────
        for selector in [
            '[aria-label="Close"]',
            '[data-testid="cookie-policy-manage-dialog-accept-button"]',
            'button:has-text("Accept All")',
            'button:has-text("Allow")',
            'div[role="dialog"] svg',
        ]:
            try:
                el = page.locator(selector).first
                if await el.is_visible(timeout=1500):
                    await el.click()
                    await page.wait_for_timeout(800)
                    logger.info(f"  Dismissed dialog: {selector}")
                    break
            except Exception:
                pass

        # ── Scroll to reveal more posts ──────────────────────────
        for _ in range(3):
            await page.evaluate("window.scrollBy(0, 2500)")
            await page.wait_for_timeout(int(SCROLL_PAUSE * 1000))

        # ── Extract posts from the DOM ───────────────────────────
        # Facebook renders post text in [dir="auto"] spans inside [role="article"]
        raw = await page.evaluate(r"""
        () => {
            const results = [];
            const seen = new Set();

            // Primary: look for article elements (each post is an article)
            const articles = document.querySelectorAll('div[role="article"]');
            for (const art of articles) {
                // Get all [dir="auto"] text nodes inside (post body)
                const textEls = art.querySelectorAll('[dir="auto"]');
                let text = '';
                for (const el of textEls) {
                    const t = el.innerText.trim();
                    if (t.length > 40) { text = t; break; }
                }
                if (!text || seen.has(text.slice(0,80))) continue;
                seen.add(text.slice(0,80));

                // Permalink: look for a timestamp link
                let url = '';
                for (const a of art.querySelectorAll('a[href*="/posts/"],a[href*="story_fbid"],a[href*="permalink"]')) {
                    url = a.href.split('?')[0];
                    break;
                }

                results.push({ text: text.slice(0, 1500), url });
                if (results.length >= 20) break;
            }

            // Fallback: grab all standalone [dir="auto"] blocks (older page layout)
            if (results.length === 0) {
                for (const el of document.querySelectorAll('[dir="auto"]')) {
                    const text = el.innerText.trim();
                    if (text.length < 50 || seen.has(text.slice(0,80))) continue;
                    seen.add(text.slice(0,80));
                    results.push({ text: text.slice(0, 1500), url: '' });
                    if (results.length >= 20) break;
                }
            }

            return results;
        }
        """)

        logger.info(f"  Extracted {len(raw)} candidate posts from DOM")

        # Deduplicate and clean
        seen_keys: set[str] = set()
        for item in raw:
            key = item["text"][:80]
            if key not in seen_keys and len(item["text"]) > 40:
                seen_keys.add(key)
                posts.append(item)

        await browser.close()

    return posts[:MAX_POSTS]


# ─────────────────────────────────────────────
# AI Classifier
# ─────────────────────────────────────────────

_SYSTEM_PROMPT = """\
You are a political content classifier for a Nepal parliamentary monitoring dashboard.
Given a Facebook post, decide:
1. Is this about Nepal politics, government, elections, political parties, parliament,
   ministers, bandas (strikes), protests, public policy, law enforcement, or lawmaking?
2. If yes → produce a clean English title (≤ 12 words) and one-sentence description (≤ 40 words).
3. Priority: "high" for arrests, elections, parliament sessions, major protests; "medium" otherwise.

Respond ONLY with valid JSON:
{ "is_political": true|false, "title": "...", "description": "...", "priority": "high"|"medium" }
"""

async def _classify(text: str) -> Optional[dict]:
    if not text.strip():
        return None
    if not settings.openai_api_key:
        return _keyword_classify(text)
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    try:
        resp = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user",   "content": f"Post:\n{text[:900]}"},
            ],
            temperature=0.0,
            max_tokens=200,
            response_format={"type": "json_object"},
        )
        return json.loads(resp.choices[0].message.content)
    except Exception as exc:
        logger.warning(f"  OpenAI failed: {exc} — using heuristic")
        return _keyword_classify(text)


def _keyword_classify(text: str) -> dict:
    keywords = [
        "banda", "strike", "protest", "nepal", "parliament", "government",
        "minister", "party", "election", "vote", "arrested", "court",
        "kathmandu", "pm ", "prime minister", "police", "shutdown",
        "नेपाल", "बन्द", "सरकार", "आन्दोलन", "संसद",
    ]
    score = sum(1 for kw in keywords if kw in text.lower())
    first = re.split(r"[.!\n]", text)[0].strip()[:80]
    return {
        "is_political": score >= 2,
        "title":        first or text[:80],
        "description":  text[:200],
        "priority":     "high" if score >= 4 else "medium",
    }


# ─────────────────────────────────────────────
# Supabase
# ─────────────────────────────────────────────

def _exists(url: str) -> bool:
    if not url:
        return False
    db = get_client()
    return bool(
        db.table("activities").select("id").eq("source_url", url).limit(1).execute().data
    )


def _save(post: dict, cls: dict) -> None:
    db = get_client()
    source = post.get("url") or f"https://www.facebook.com/{settings.fb_page_slug}"
    row = {
        "id":          str(uuid.uuid4()),
        "type":        "social",
        "title":       cls["title"][:400],
        "description": cls.get("description", "")[:800],
        "source_url":  source,
        "date":        datetime.now(timezone.utc).isoformat(),
        "priority":    cls.get("priority", "medium"),
        "ministry":    "Social Media",
    }
    if post.get("url"):
        db.table("activities").upsert(row, on_conflict="source_url").execute()
    else:
        db.table("activities").insert(row).execute()


# ─────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────

_fb_scrape_running = False


async def run_facebook_scrape() -> dict:
    global _fb_scrape_running
    if _fb_scrape_running:
        return {"status": "already_running"}

    _fb_scrape_running = True
    t0 = time.monotonic()
    new_cnt = skip_cnt = skip_np = err_cnt = 0

    try:
        logger.info(f"▶ Facebook Playwright scrape — {settings.fb_page_slug}")

        posts = await _scrape_page_posts()
        if not posts:
            return {
                "status": "warning",
                "message": "No posts found — page may enforce login or DOM changed.",
            }

        for i, post in enumerate(posts, 1):
            text = post["text"]
            url  = post.get("url", "")
            logger.info(f"  [{i}/{len(posts)}] {url or 'no-url'} ({len(text)} chars)")
            try:
                if url and _exists(url):
                    logger.info("    ↷ Already in DB")
                    skip_cnt += 1
                    continue

                cls = await _classify(text)
                if not cls:
                    err_cnt += 1
                    continue

                if not cls.get("is_political"):
                    logger.info("    ✗ Not political")
                    skip_np += 1
                    continue

                _save(post, cls)
                logger.info(f"    ✓ Saved: {cls['title'][:60]}")
                new_cnt += 1
                await asyncio.sleep(0.3)

            except Exception as exc:
                logger.error(f"    ✗ {exc}", exc_info=True)
                err_cnt += 1

        duration = time.monotonic() - t0
        msg = (
            f"Done in {duration:.1f}s — "
            f"{new_cnt} new, {skip_cnt} known, {skip_np} not-political, {err_cnt} errors"
        )
        logger.info(f"■ Facebook scrape: {msg}")
        return {
            "status":        "success" if err_cnt == 0 else "warning",
            "new":           new_cnt,
            "skipped":       skip_cnt,
            "not_political": skip_np,
            "errors":        err_cnt,
            "duration_sec":  round(duration, 2),
            "message":       msg,
        }

    except Exception as exc:
        duration = time.monotonic() - t0
        logger.error(f"■ Facebook scrape failed: {exc}", exc_info=True)
        return {"status": "error", "message": str(exc), "duration_sec": round(duration, 2)}
    finally:
        _fb_scrape_running = False
