"""APScheduler — daily scrape at configured hour."""

import asyncio
import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from internal.config import settings

logger = logging.getLogger(__name__)
_scheduler: AsyncIOScheduler | None = None


async def _scheduled_job() -> None:
    from internal.scraper import run_scrape   # lazy import avoids circular
    logger.info("⏰ Scheduled scrape triggered")
    await run_scrape()


def start_scheduler() -> None:
    global _scheduler
    _scheduler = AsyncIOScheduler()
    _scheduler.add_job(
        _scheduled_job,
        CronTrigger(hour=settings.scrape_schedule_hour, minute=0),
        id="daily_scrape",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info(f"Scheduler started — daily scrape at {settings.scrape_schedule_hour:02d}:00 UTC")


def stop_scheduler() -> None:
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
