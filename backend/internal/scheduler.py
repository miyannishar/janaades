"""APScheduler — bill scrape (daily) + news scrape (every 6h, configurable)."""

import logging
from datetime import datetime, timezone
from typing import Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from internal.config import settings

logger = logging.getLogger(__name__)
_scheduler: Optional[AsyncIOScheduler] = None


async def _bill_scrape_job() -> None:
    from internal.scraper import run_scrape   # lazy — avoids circular import
    logger.info("⏰ Scheduled bill scrape triggered")
    await run_scrape()


async def _news_scrape_job() -> None:
    from internal.news_scraper import run_news_scrape
    logger.info("⏰ Scheduled news scrape triggered")
    await run_news_scrape()


def start_scheduler() -> None:
    global _scheduler
    _scheduler = AsyncIOScheduler()

    # ── Bills: daily at configured hour (default 02:00 UTC) ──────
    _scheduler.add_job(
        _bill_scrape_job,
        CronTrigger(hour=settings.scrape_schedule_hour, minute=0, timezone="UTC"),
        id="daily_bill_scrape",
        replace_existing=True,
    )

    # ── News: 4× daily at 06:00, 12:00, 18:00, 00:00 UTC ────────
    # Also fires once immediately on startup so the feed is populated right away.
    news_hours = settings.news_scrape_hours   # e.g. "0,6,12,18"
    _scheduler.add_job(
        _news_scrape_job,
        CronTrigger(hour=news_hours, minute=5, timezone="UTC"),  # :05 past the hour
        id="scheduled_news_scrape",
        replace_existing=True,
    )

    # Fire immediately on startup (next_run_time = now)
    _scheduler.add_job(
        _news_scrape_job,
        CronTrigger(year=datetime.now(timezone.utc).year),   # one-shot via a distant trigger
        id="startup_news_scrape",
        replace_existing=True,
        next_run_time=datetime.now(timezone.utc),
    )

    _scheduler.start()
    logger.info(
        f"Scheduler started — "
        f"bill scrape @ {settings.scrape_schedule_hour:02d}:00 UTC daily | "
        f"news scrape @ {news_hours}:05 UTC"
    )


def stop_scheduler() -> None:
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
