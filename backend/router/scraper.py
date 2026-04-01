from __future__ import annotations
import asyncio
import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException
from internal.db import get_client
from internal.scraper import run_scrape, _scrape_running           # noqa: WPS450
from internal.news_scraper import run_news_scrape, _news_scrape_running  # noqa: WPS450

router = APIRouter(prefix="/scraper", tags=["scraper"])
logger = logging.getLogger(__name__)


@router.post("/run")
async def trigger_scrape(background_tasks: BackgroundTasks):
    """Trigger a manual bill scrape run (non-blocking)."""
    if _scrape_running:
        raise HTTPException(status_code=409, detail="A scrape is already running")
    background_tasks.add_task(run_scrape)
    return {"status": "started", "message": "Bill scrape queued in background"}


@router.get("/status")
def scrape_status():
    """Is a scrape currently running?"""
    return {"bills_running": _scrape_running, "news_running": _news_scrape_running}


@router.get("/logs")
def scrape_logs(limit: int = 20):
    """Return last N bill scrape log entries."""
    db = get_client()
    res = db.table("scrape_logs").select("*").order("scrape_date", desc=True).limit(limit).execute()
    return res.data or []


@router.post("/run/sync")
async def trigger_scrape_sync():
    """Trigger bill scrape and wait for result (blocking — testing only)."""
    if _scrape_running:
        raise HTTPException(status_code=409, detail="A scrape is already running")
    result = await run_scrape()
    return result


@router.post("/run/news")
async def trigger_news_scrape(background_tasks: BackgroundTasks):
    """Trigger a manual news scrape from OnlineKhabar (non-blocking)."""
    if _news_scrape_running:
        raise HTTPException(status_code=409, detail="News scrape already running")
    background_tasks.add_task(run_news_scrape)
    return {"status": "started", "message": "News scrape queued in background"}


@router.post("/run/news/sync")
async def trigger_news_scrape_sync():
    """Trigger news scrape and wait for result (blocking — testing only)."""
    if _news_scrape_running:
        raise HTTPException(status_code=409, detail="News scrape already running")
    result = await run_news_scrape()
    return result

