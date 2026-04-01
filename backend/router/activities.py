from __future__ import annotations
from typing import Optional
from fastapi import APIRouter, Query
from internal.db import get_client

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("")
def list_activities(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    type: Optional[str] = None,
    priority: Optional[str] = None,
):
    """Return recent activities ordered by date desc."""
    db = get_client()
    q  = db.table("activities").select("*", count="exact")

    if type:
        q = q.eq("type", type)
    if priority:
        q = q.eq("priority", priority)

    res = q.order("date", desc=True).range(offset, offset + limit - 1).execute()
    return {
        "total":  res.count,
        "offset": offset,
        "limit":  limit,
        "items":  res.data,
    }


@router.get("/news")
def list_news(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Return only scraped news articles (type='news'), most recent first."""
    db  = get_client()
    res = (
        db.table("activities")
        .select("id, title, description, source_url, image_url, date, priority, created_at")
        .eq("type", "news")
        .order("date", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return {"total": len(res.data), "items": res.data}
