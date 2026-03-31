import asyncio
import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException
from internal.db import get_client
from internal.scraper import run_scrape, _scrape_running   # noqa: WPS450

router = APIRouter(prefix="/scraper", tags=["scraper"])
logger = logging.getLogger(__name__)


@router.post("/run")
async def trigger_scrape(background_tasks: BackgroundTasks):
    """Trigger a manual scrape run (non-blocking)."""
    if _scrape_running:
        raise HTTPException(status_code=409, detail="A scrape is already running")
    background_tasks.add_task(run_scrape)
    return {"status": "started", "message": "Scrape queued in background"}


@router.get("/status")
def scrape_status():
    """Is a scrape currently running?"""
    return {"running": _scrape_running}


@router.get("/logs")
def scrape_logs(limit: int = 20):
    """Return last N scrape log entries."""
    db = get_client()
    res = db.table("scrape_logs").select("*").order("scrape_date", desc=True).limit(limit).execute()
    return res.data or []


@router.post("/run/sync")
async def trigger_scrape_sync():
    """Trigger scrape and wait for result (blocking — use for testing only)."""
    if _scrape_running:
        raise HTTPException(status_code=409, detail="A scrape is already running")
    result = await run_scrape()
    return result
