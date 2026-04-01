from __future__ import annotations
from fastapi import APIRouter, HTTPException, Query
from internal.db import get_client

router = APIRouter(prefix="/bills", tags=["bills"])


@router.get("")
def list_bills(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    ministry: str | None = None,
    status: str | None = None,
    year_bs: str | None = None,
    search: str | None = None,
):
    db = get_client()
    offset = (page - 1) * page_size

    q = db.table("bills").select("*", count="exact")

    if ministry:
        q = q.ilike("ministry", f"%{ministry}%")
    if status:
        q = q.eq("status", status)
    if year_bs:
        q = q.eq("year_bs", year_bs)
    if search:
        q = q.or_(f"title.ilike.%{search}%,ministry.ilike.%{search}%")

    res = q.order("registration_no", desc=True).range(offset, offset + page_size - 1).execute()

    return {
        "total":     res.count,
        "page":      page,
        "page_size": page_size,
        "items":     res.data,
    }


@router.get("/stats")
def bill_stats():
    db = get_client()
    all_res = db.table("bills").select("status, scrape_status").execute()
    rows = all_res.data or []

    from collections import Counter
    by_status = Counter(r.get("status") for r in rows)

    return {
        "total":        len(rows),
        "by_status":    dict(by_status),
        "with_pdf":     sum(1 for r in rows if r.get("pdf_url")),
        "scraped":      sum(1 for r in rows if r.get("registration_no")),
    }


@router.get("/{registration_no}")
def get_bill(registration_no: int):
    db = get_client()
    res = db.table("bills").select("*").eq("registration_no", registration_no).maybe_single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail=f"Bill #{registration_no} not found")
    return res.data
