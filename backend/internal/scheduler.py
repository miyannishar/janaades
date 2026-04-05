"""APScheduler — bill scrape (daily) + news scrape (every 6h) + Facebook scrape (every 3h)."""

import logging
from datetime import datetime, timezone
from typing import Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from internal.config import settings

logger = logging.getLogger(__name__)
_scheduler: Optional[AsyncIOScheduler] = None


async def _bill_scrape_job() -> None:
    from internal.scraper import run_scrape
    logger.info("⏰ Scheduled bill scrape triggered")
    await run_scrape()


async def _news_scrape_job() -> None:
    from internal.news_scraper import run_news_scrape
    logger.info("⏰ Scheduled news scrape triggered")
    await run_news_scrape()


async def _facebook_scrape_job() -> None:
    from internal.facebook_scraper import run_facebook_scrape
    logger.info("⏰ Scheduled Facebook scrape triggered")
    await run_facebook_scrape()


async def _bill_accountability_job() -> None:
    from agent_system.jobs import run_bill_job
    logger.info("🤖 Scheduled bill accountability job triggered")
    await run_bill_job()


async def _news_accountability_job() -> None:
    from agent_system.jobs import run_news_job
    logger.info("🤖 Scheduled news accountability job triggered")
    await run_news_job()


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

    # ── News: 4× daily at 00:05, 06:05, 12:05, 18:05 UTC ────────
    _scheduler.add_job(
        _news_scrape_job,
        CronTrigger(hour=settings.news_scrape_hours, minute=5, timezone="UTC"),
        id="scheduled_news_scrape",
        replace_existing=True,
    )

    # ── Facebook: every 3h at :10 past (1, 4, 7, 10, 13, 16, 19, 22 UTC) ──
    _scheduler.add_job(
        _facebook_scrape_job,
        CronTrigger(hour="1,4,7,10,13,16,19,22", minute=10, timezone="UTC"),
        id="scheduled_facebook_scrape",
        replace_existing=True,
    )

    # ── Fire news + facebook immediately on startup ───────────────
    _scheduler.add_job(
        _news_scrape_job,
        id="startup_news_scrape",
        next_run_time=datetime.now(timezone.utc),
        trigger=CronTrigger(year="2099"),   # effectively a one-shot
    )
    _scheduler.add_job(
        _facebook_scrape_job,
        id="startup_facebook_scrape",
        next_run_time=datetime.now(timezone.utc),
        trigger=CronTrigger(year="2099"),
    )

    # ── AI Accountability: 2× daily at 03:30 + 15:30 UTC (≈9:15am + 9:15pm NPT) ──
    # Runs AFTER the scrape jobs so fresh data is already in the DB.
    _scheduler.add_job(
        _bill_accountability_job,
        CronTrigger(hour="3,15", minute=30, timezone="UTC"),
        id="ai_bill_accountability",
        replace_existing=True,
    )
    _scheduler.add_job(
        _news_accountability_job,
        CronTrigger(hour="3,15", minute=45, timezone="UTC"),
        id="ai_news_accountability",
        replace_existing=True,
    )

    _scheduler.start()
    logger.info(
        "Scheduler started — "
        f"bills @ {settings.scrape_schedule_hour:02d}:00 UTC daily | "
        f"news @ {settings.news_scrape_hours}:05 UTC | "
        "facebook @ 1,4,7,10,13,16,19,22:10 UTC | "
        "AI accountability @ 03:30 + 15:30 UTC (bills) and 03:45 + 15:45 UTC (news)"
    )


def stop_scheduler() -> None:
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
