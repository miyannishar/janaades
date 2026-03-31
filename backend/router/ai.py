"""
AI endpoints:
  POST /api/ai/summarize/{registration_no}  — summarise one bill and save to DB
  POST /api/ai/summarize-pending            — batch: summarise all bills without a summary
  POST /api/ai/parse                        — dev utility: pass raw text, get structured JSON back
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from internal.ai import summarize_bill, parse_and_analyze
from internal.config import settings
from internal.db import get_client

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai", tags=["ai"])


def _require_key() -> None:
    if not settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured")


# ─────────────────────────────────────────────────────────────
# Summarise a single bill
# ─────────────────────────────────────────────────────────────

@router.post("/summarize/{registration_no}")
async def summarize_one(registration_no: int, save: bool = True):
    """
    Generate a bilingual AI summary for a bill and (optionally) persist it to Supabase.

    - **registration_no**: parliament registration number
    - **save**: write summary back to `bills.summary` and `bills.ai_analysis` (default true)
    """
    _require_key()

    db = get_client()
    res = db.table("bills").select("*").eq("registration_no", registration_no).maybe_single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail=f"Bill #{registration_no} not found")

    bill = res.data
    try:
        ai = await summarize_bill(bill)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    if save:
        db.table("bills").update({
            "summary":         ai.get("summary_en"),
            "summary_ne":      ai.get("summary_ne"),
            "key_points":      ai.get("key_points"),
            "affected_groups": ai.get("affected_groups"),
            "concerns":        ai.get("concerns"),
        }).eq("registration_no", registration_no).execute()

    return {
        "registration_no": registration_no,
        "saved":           save,
        **ai,
    }


# ─────────────────────────────────────────────────────────────
# Batch: summarise all bills that have no summary yet
# ─────────────────────────────────────────────────────────────

@router.post("/summarize-pending")
async def summarize_pending(limit: int = 20):
    """
    Summarise up to `limit` bills that currently have no summary.
    Runs sequentially to respect OpenAI rate limits.
    """
    _require_key()

    db = get_client()
    res = (
        db.table("bills")
        .select("registration_no, title, ministry, presenter, year_bs, session, category, governmental_type, original_amendment, timeline_passed, summary")
        .is_("summary", "null")
        .not_.is_("registration_no", "null")
        .limit(limit)
        .execute()
    )

    bills = res.data or []
    if not bills:
        return {"message": "No pending bills found", "processed": 0}

    results = []
    for bill in bills:
        reg_no = bill["registration_no"]
        try:
            ai = await summarize_bill(bill)
            db.table("bills").update({
                "summary":         ai.get("summary_en"),
                "summary_ne":      ai.get("summary_ne"),
                "key_points":      ai.get("key_points"),
                "affected_groups": ai.get("affected_groups"),
                "concerns":        ai.get("concerns"),
            }).eq("registration_no", reg_no).execute()
            results.append({"registration_no": reg_no, "status": "ok"})
            logger.info(f"Summarised bill #{reg_no}")
        except Exception as exc:
            logger.warning(f"Failed to summarise #{reg_no}: {exc}")
            results.append({"registration_no": reg_no, "status": "error", "detail": str(exc)})

    ok    = sum(1 for r in results if r["status"] == "ok")
    errs  = len(results) - ok
    return {"processed": len(results), "succeeded": ok, "errors": errs, "results": results}


# ─────────────────────────────────────────────────────────────
# Dev utility: parse raw text
# ─────────────────────────────────────────────────────────────

class ParseRequest(BaseModel):
    raw_text: str


@router.post("/parse")
async def parse_raw(body: ParseRequest):
    """
    Dev / debug endpoint: pass raw scraped text from a parliament bill page,
    get back the AI-extracted structured JSON.
    Useful for checking what the AI fallback would extract.
    """
    _require_key()
    try:
        result = await parse_and_analyze(body.raw_text, source="manual")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    return result
