"""
agents/jobs.py
──────────────
Automated accountability jobs run by the APScheduler cron.

Two jobs, each runs twice a day (9am + 9pm NPT):

  run_bill_job()   — picks the latest unaddressed bill, runs the agent
                     to critically analyse it, saves the draft to DB.
                     The agent also uses save_social_post to save the generated post
                     into the ai_social_posts table.

  run_news_job()   — same flow for the activities (news) table.

The agent is run programmatically — no HTTP call needed since both the
scheduler and the agent live in the same FastAPI process.
"""

from __future__ import annotations

import asyncio
import logging
import os
import uuid
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

APP_NAME = "nepal_parliament_agent"


# ─── Shared: run the agent and return its final text reply ────────────────────

async def _invoke_agent(prompt: str) -> str:
    """Run one agent turn with the given prompt and return the text reply."""
    from google.adk.sessions import InMemorySessionService
    from google.adk.runners import Runner
    from google.genai import types
    from agent_system import base_agent

    session_service = InMemorySessionService()
    runner = Runner(
        agent=base_agent,
        app_name=APP_NAME,
        session_service=session_service,
    )
    session = await session_service.create_session(
        app_name=APP_NAME,
        user_id="scheduler",
        session_id=str(uuid.uuid4()),
    )
    content = types.Content(
        role="user",
        parts=[types.Part.from_text(text=prompt)],
    )
    parts: list[str] = []
    async for event in runner.run_async(
        user_id="scheduler",
        session_id=session.id,
        new_message=content,
    ):
        if event.is_final_response() and event.content and event.content.parts:
            for p in event.content.parts:
                if hasattr(p, "text") and p.text:
                    parts.append(p.text)

    return "".join(parts) or "(agent produced no output)"


def _get_db():
    from supabase import create_client
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_ROLE_KEY"],
    )


# ─── Bill accountability job ──────────────────────────────────────────────────

BILL_PROMPT_TEMPLATE = """\
You are running your daily accountability job for Nepal's जनादेश Monitor.

## Your Task
Critically analyse the bill below and produce content for Reddit and X.

## Bill Data
- **Title**: {title}
- **Nepali Title**: {title_nepali}
- **Registration No**: {registration_no}
- **Chamber**: {chamber}
- **Status**: {status}
- **Ministry**: {ministry}
- **Session**: {session} | Year: {year_bs}
- **AI Summary**: {summary}

## Steps to follow
1. Use `web_search` to find recent news, expert analysis, civil society reactions, or any criticism of this bill. Search at least twice with different queries.
2. Critically analyse the bill from a citizen's perspective:
   - What powers does it grant to the government and why are they doing this?
   - Is there an alternative to this approach?
   - Who benefits and who could be harmed?
   - Are there any constitutional or rights concerns?
   - What do experts, opposition parties, or civil society say?
3. Write a well-structured **social media post** in this format:
   - Title: clear and descriptive (max 12 words)
   - Body: structured markdown with an English analysis and a **Nepali संक्षेप** section
   - Must cite sources (bill number, news links, official statements)
4. **Save the post to the database** using the `save_social_post` tool.

## Tone
Factual, accessible to ordinary Nepali citizens. Evidence-based opposition framing. Never inflammatory. Always cite sources.

Now proceed with the analysis and posting.
"""


async def run_bill_job(bill_id: int | None = None) -> None:
    """Pick a specific unaddressed bill (or latest if None) and run accountability analysis."""
    try:
        db = _get_db()

        if bill_id is not None:
            res = (
                db.table("bills")
                .select("id, registration_no, title, title_nepali, chamber, status, ministry, session, year_bs, summary")
                .eq("id", bill_id)
                .eq("ai_addressed", False)
                .limit(1)
                .execute()
            )
        else:
            res = (
                db.table("bills")
                .select("id, registration_no, title, title_nepali, chamber, status, ministry, session, year_bs, summary")
                .eq("ai_addressed", False)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )

        if not res.data:
            logger.info("📋 Bill job: no unaddressed bills found (or already addressed).")
            return

        bill = res.data[0]
        bid = bill["id"]
        title = bill.get("title", "Unknown Bill")

        logger.info("📋 Bill job: analysing '%s' (id=%s)", title, bid)

        prompt = BILL_PROMPT_TEMPLATE.format(
            title=title,
            title_nepali=bill.get("title_nepali") or "N/A",
            registration_no=bill.get("registration_no") or "N/A",
            chamber=bill.get("chamber") or "N/A",
            status=bill.get("status") or "N/A",
            ministry=bill.get("ministry") or "N/A",
            session=bill.get("session") or "N/A",
            year_bs=bill.get("year_bs") or "N/A",
            summary=bill.get("summary") or "No summary available.",
        )

        draft = await _invoke_agent(prompt)
        logger.info("📋 Bill job: agent completed (%d chars)", len(draft))

        # Mark as addressed and save draft
        db.table("bills").update({
            "ai_addressed":    True,
            "ai_addressed_at": datetime.now(timezone.utc).isoformat(),
            "ai_draft":        draft,
        }).eq("id", bid).execute()

        logger.info("✅ Bill job: marked '%s' as addressed", title)

    except Exception as exc:
        logger.error("❌ Bill job error: %s", exc, exc_info=True)


# ─── News / activity accountability job ───────────────────────────────────────

NEWS_PROMPT_TEMPLATE = """\
You are running your daily accountability job for Nepal's जनादेश Monitor.

## Your Task
Critically analyse the following news / political activity item and produce content for Reddit and X.

## News Item
- **Title**: {title}
- **Description**: {description}
- **Priority**: {priority}
- **Source**: {source_url}
- **Published**: {published_at}

## Steps to follow
1. Use `web_search` to find related news, official government responses, or additional context. Search at least twice.
2. Is this news political or actions done by the government? If yes, critically analyse the item:
   - Why is the government doing this?
   - Is there a better alternative to this action?
   - What does this mean for ordinary Nepali citizens?
   - Is this consistent with what the government has previously said or promised?
   - What are the opposition or civil society reactions?
   - Is there any accountability angle the public should know about?
3. Write a **social media post** in this format:
   - Title: clear and newsworthy (max 12 words)
   - Body: structured markdown with English analysis and a **Nepali संक्षेप** section
   - Cite sources
4. **Save the post to the database** using the `save_social_post` tool.

## Tone
Factual and evidence-based. Accessible to ordinary citizens. Never inflammatory.

Now proceed.
"""


async def run_news_job(news_id: int | str | None = None) -> None:
    """Pick a specific unaddressed activity/news item (or latest if None) and run accountability analysis."""
    try:
        db = _get_db()

        if news_id is not None:
            res = (
                db.table("activities")
                .select("id, title, description, priority, source_url, published_at")
                .eq("id", news_id)
                .eq("ai_addressed", False)
                .limit(1)
                .execute()
            )
        else:
            res = (
                db.table("activities")
                .select("id, title, description, priority, source_url, published_at")
                .eq("ai_addressed", False)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )

        if not res.data:
            logger.info("📰 News job: no unaddressed items found (or already addressed).")
            return

        item = res.data[0]
        nid = item["id"]
        title = item.get("title", "Untitled")

        logger.info("📰 News job: analysing '%s' (id=%s)", title, nid)

        prompt = NEWS_PROMPT_TEMPLATE.format(
            title=title,
            description=item.get("description") or "No description available.",
            priority=item.get("priority") or "medium",
            source_url=item.get("source_url") or "N/A",
            published_at=item.get("published_at") or "N/A",
        )

        draft = await _invoke_agent(prompt)
        logger.info("📰 News job: agent completed (%d chars)", len(draft))

        db.table("activities").update({
            "ai_addressed":    True,
            "ai_addressed_at": datetime.now(timezone.utc).isoformat(),
            "ai_draft":        draft,
        }).eq("id", nid).execute()

        logger.info("✅ News job: marked '%s' as addressed", title)

    except Exception as exc:
        logger.error("❌ News job error: %s", exc, exc_info=True)


# ─── Sync wrappers for APScheduler ───────────────────────────────────────────

def bill_accountability_job() -> None:
    """Sync entry point for APScheduler."""
    asyncio.run(run_bill_job())


def news_accountability_job() -> None:
    """Sync entry point for APScheduler."""
    asyncio.run(run_news_job())
