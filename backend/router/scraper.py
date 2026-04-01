from typing import Optional
import asyncio
import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException
from internal.db import get_client
from internal.scraper import run_scrape, _scrape_running                        # noqa: WPS450
from internal.news_scraper import run_news_scrape, _news_scrape_running         # noqa: WPS450
from internal.facebook_scraper import run_facebook_scrape, _fb_scrape_running  # noqa: WPS450

router = APIRouter(prefix="/scraper", tags=["scraper"])
logger = logging.getLogger(__name__)


# ── Bills ─────────────────────────────────────────────────────

@router.post("/run")
async def trigger_scrape(background_tasks: BackgroundTasks):
    """Trigger a manual bill scrape run (non-blocking)."""
    if _scrape_running:
        raise HTTPException(status_code=409, detail="A bill scrape is already running")
    background_tasks.add_task(run_scrape)
    return {"status": "started", "message": "Bill scrape queued in background"}


@router.post("/run/sync")
async def trigger_scrape_sync():
    """Trigger bill scrape and wait for result (blocking)."""
    if _scrape_running:
        raise HTTPException(status_code=409, detail="A bill scrape is already running")
    return await run_scrape()


# ── News ──────────────────────────────────────────────────────

@router.post("/run/news")
async def trigger_news_scrape(background_tasks: BackgroundTasks):
    """Trigger a manual OnlineKhabar news scrape (non-blocking)."""
    if _news_scrape_running:
        raise HTTPException(status_code=409, detail="News scrape already running")
    background_tasks.add_task(run_news_scrape)
    return {"status": "started", "message": "News scrape queued in background"}


@router.post("/run/news/sync")
async def trigger_news_scrape_sync():
    """Trigger news scrape and wait for result (blocking)."""
    if _news_scrape_running:
        raise HTTPException(status_code=409, detail="News scrape already running")
    return await run_news_scrape()


# ── Facebook ──────────────────────────────────────────────────

@router.post("/run/facebook")
async def trigger_facebook_scrape(background_tasks: BackgroundTasks):
    """
    Scrape facebook.com/officialroutineofnepalbanda via mbasic,
    classify each post with OpenAI, and insert political ones into activities.
    Non-blocking — returns immediately.
    """
    if _fb_scrape_running:
        raise HTTPException(status_code=409, detail="Facebook scrape already running")
    background_tasks.add_task(run_facebook_scrape)
    return {"status": "started", "message": "Facebook scrape queued in background"}


@router.post("/run/facebook/sync")
async def trigger_facebook_scrape_sync():
    """
    Same as /run/facebook but waits for the full result (blocking, use for testing).
    """
    if _fb_scrape_running:
        raise HTTPException(status_code=409, detail="Facebook scrape already running")
    return await run_facebook_scrape()


# ── Status & Logs ─────────────────────────────────────────────

@router.get("/status")
def scrape_status():
    """Current running state of all scrapers."""
    return {
        "bills_running":    _scrape_running,
        "news_running":     _news_scrape_running,
        "facebook_running": _fb_scrape_running,
    }


@router.get("/logs")
def scrape_logs(limit: int = 20):
    """Return last N bill scrape log entries."""
    db = get_client()
    res = db.table("scrape_logs").select("*").order("scrape_date", desc=True).limit(limit).execute()
    return res.data or []
