"""
ADK Agent endpoint
──────────────────
POST /api/agent/chat

Runs the nepal_parliament_agent for a single user turn and returns the
full text response.  Uses ADK's InMemorySessionService so each request
is lightweight; sessions are ephemeral (no persistence between calls).

If you need multi-turn persistence, swap InMemorySessionService for a
database-backed session service.
"""

from __future__ import annotations

import logging
import uuid
from typing import AsyncGenerator

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from agent_system import base_agent

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/agent", tags=["agent"])

APP_NAME = "nepal_parliament_agent"


# ─── Schemas ──────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None   # optional — a new session is created if omitted


class ChatResponse(BaseModel):
    session_id: str
    reply: str


# ─── Helpers ──────────────────────────────────────────────────────────────────

from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner

_session_service = InMemorySessionService()
_runner = Runner(
    agent=base_agent,
    app_name=APP_NAME,
    session_service=_session_service,
)

async def _run_agent(session_id: str, message: str) -> str:
    """Run one turn of the agent and collect the final text reply."""
    from google.genai import types

    session = await _session_service.get_session(
        app_name=APP_NAME,
        user_id="anonymous",
        session_id=session_id
    )
    if session is None:
        session = await _session_service.create_session(
            app_name=APP_NAME,
            user_id="anonymous",
            session_id=session_id,
        )

    content = types.Content(role="user", parts=[types.Part.from_text(text=message)])

    reply_parts: list[str] = []
    async for event in _runner.run_async(
        user_id="anonymous",
        session_id=session.id,
        new_message=content,
    ):
        if event.is_final_response() and event.content and event.content.parts:
            for part in event.content.parts:
                if hasattr(part, "text") and part.text:
                    reply_parts.append(part.text)

    return "".join(reply_parts) or "(no response)"


# ─── Endpoint ─────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def agent_chat(body: ChatRequest):
    """
    Send a message to the Nepal Parliament AI agent and receive a reply.

    - **message**: The user's question or request.
    - **session_id**: Optional session identifier for multi-turn context within
      a single request lifecycle.  A new UUID is generated if omitted.

    The agent has access to the `get_bill_summary`, `web_search`,
    `post_to_reddit`, and `post_to_twitter` tools.
    """
    sid = body.session_id or str(uuid.uuid4())
    try:
        reply = await _run_agent(sid, body.message)
    except Exception as exc:
        logger.error("Agent error: %s", exc)
        raise HTTPException(status_code=502, detail=f"Agent error: {exc}")

    return ChatResponse(session_id=sid, reply=reply)


# ─── Manual job triggers (for testing / admin) ────────────────────────────────

@router.post("/jobs/bill", tags=["agent-jobs"])
async def trigger_bill_job():
    """
    Manually trigger the bill accountability job.
    Picks the oldest unaddressed bill, runs the agent, saves the draft to DB.
    Runs asynchronously — returns immediately.
    """
    import asyncio
    from agent_system.jobs import run_bill_job
    asyncio.create_task(run_bill_job())
    return {"status": "started", "message": "Bill accountability job queued"}


@router.post("/jobs/news", tags=["agent-jobs"])
async def trigger_news_job():
    """
    Manually trigger the news accountability job.
    Picks the oldest unaddressed activity, runs the agent, saves the draft to DB.
    Runs asynchronously — returns immediately.
    """
    import asyncio
    from agent_system.jobs import run_news_job
    asyncio.create_task(run_news_job())
    return {"status": "started", "message": "News accountability job queued"}


@router.post("/jobs/bill/sync", tags=["agent-jobs"])
async def trigger_bill_job_sync():
    """Blocking version of the bill job — waits for full completion. Use for testing."""
    from agent_system.jobs import run_bill_job
    await run_bill_job()
    return {"status": "done"}


@router.post("/jobs/news/sync", tags=["agent-jobs"])
async def trigger_news_job_sync():
    """Blocking version of the news job — waits for full completion. Use for testing."""
    from agent_system.jobs import run_news_job
    await run_news_job()
    return {"status": "done"}

