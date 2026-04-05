"""
AI helpers — OpenAI-powered bill parsing and analysis.

Flow per bill:
  1. Fetch PDF bytes (in-memory, no local storage)
  2. Extract text with pdfplumber
  3. Send text to GPT in ONE call that returns:
     - All structured fields (title, presenter, ministry, timeline, etc.)
     - AI summary + key points + affected groups + concerns
  4. Results merged back into the bill dict and saved to DB.

Fallback: if no PDF, we still send the HTML page text to AI.
"""

import io
import json
import logging
from typing import Any

import pdfplumber
from openai import AsyncOpenAI, OpenAIError

from internal.config import settings

logger = logging.getLogger(__name__)

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not set in .env")
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


# ─────────────────────────────────────────────────────────────
# PDF text extraction  (in-memory, no disk I/O)
# ─────────────────────────────────────────────────────────────

def extract_pdf_text(pdf_bytes: bytes, max_chars: int = 12_000) -> str:
    """
    Extract plain text from PDF bytes using pdfplumber.
    Returns up to `max_chars` characters so we stay within GPT token budget.
    """
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            pages_text: list[str] = []
            total = 0
            for page in pdf.pages:
                text = page.extract_text() or ""
                pages_text.append(text)
                total += len(text)
                if total >= max_chars:
                    break
            return "\n".join(pages_text)[:max_chars]
    except Exception as exc:
        logger.warning(f"pdfplumber extract failed: {exc}")
        return ""


# ─────────────────────────────────────────────────────────────
# Combined parse + analyse — ONE GPT call per bill
# ─────────────────────────────────────────────────────────────

COMBINED_SYSTEM = """\
You are a bilingual (English + Nepali) legislative analyst for Nepal's Pratinidhi Sabha.
The input starts with a "== Known metadata ==" section containing values already confirmed from the
parliament website — treat those as authoritative ground truth. Below that is the full bill text
(PDF or HTML). Use both together to return a single JSON object:

{
  "title":              "full bill title in English (use known metadata if already correct)",
  "title_nepali":       "bill title in Nepali (Devanagari script) — extract from PDF/page or translate",
  "ministry":           "responsible ministry name",
  "presenter":          "name of bill presenter / sponsor (Hon. ...) or null",
  "year_bs":            "Bikram Sambat year e.g. '2082' or null",
  "session":            5,
  "category":           "bill category e.g. 'General' or null",
  "governmental_type":  "Governmental or Non-Governmental or null",
  "original_amendment": "Original or Amendment or null",
  "timeline": {
    "distribution":   "date string or null",
    "present":        "date string or null",
    "general_disc":   "date string or null",
    "committee_disc": "date string or null",
    "report":         "date string or null",
    "passed":         "date string or null",
    "authenticated":  "date string or null"
  },
  "summary_en":       "2-3 sentence plain-English summary of what the bill does and why it matters",
  "summary_ne":       "same summary in Nepali (Devanagari script)",
  "key_points":       ["bullet 1 (English)", "bullet 2", "bullet 3"],
  "affected_groups":  ["group 1", "group 2"],
  "concerns":         ["potential concern 1", "potential concern 2"],
  "opposition_analysis": "An extensive adversarial analysis finding contradictions, hidden impacts, who benefits unfairly, and questioning alternative policies."
}

Rules:
- Prioritise the "Known metadata" section over the bill text for fields already listed there.
- Use null (not empty string) for missing fields.
- For title_nepali: extract from the PDF/page if present in Devanagari, otherwise translate the English title.
- For summary_en / summary_ne: write a real 2-3 sentence summary based on the bill content.
  If there is insufficient text, write "Insufficient text available for summary." in both languages.
- Keep key_points concise (max 5 bullets).
- Respond with raw JSON only — no markdown fences or extra keys.
"""



async def parse_and_analyze(text: str, source: str = "page") -> dict[str, Any]:
    """
    Send bill text (from PDF or HTML) to GPT and get structured fields + analysis.
    `source` is just for logging ('pdf' or 'page').
    """
    truncated = text[:12_000]  # ~3k tokens, well within gpt-4o-mini limit

    logger.debug(f"  AI call — source={source}, chars={len(truncated)}")
    try:
        client = _get_client()
        resp = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": COMBINED_SYSTEM},
                {"role": "user",   "content": f"Bill text ({source}):\n\n{truncated}"},
            ],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        raw = resp.choices[0].message.content
        data = json.loads(raw)

        # Flatten timeline → top-level keys
        tl = data.pop("timeline", {}) or {}
        data["timeline_distribution"]   = tl.get("distribution")
        data["timeline_present"]        = tl.get("present")
        data["timeline_general_disc"]   = tl.get("general_disc")
        data["timeline_committee_disc"] = tl.get("committee_disc")
        data["timeline_report"]         = tl.get("report")
        data["timeline_passed"]         = tl.get("passed")
        data["timeline_authenticated"]  = tl.get("authenticated")

        logger.info(f"  AI extracted fields: {[k for k, v in data.items() if v is not None]}")
        return data

    except OpenAIError as exc:
        logger.error(f"OpenAI error: {exc}")
        raise
    except json.JSONDecodeError as exc:
        logger.error(f"AI returned invalid JSON: {exc}")
        raise ValueError(str(exc)) from exc


# ─────────────────────────────────────────────────────────────
# Embeddings 
# ─────────────────────────────────────────────────────────────

async def generate_embedding(text: str) -> list[float]:
    """Generate a 1536-dimensional embedding via OpenAI."""
    try:
        client = _get_client()
        # Ensure we don't pass massively huge text to embeddings
        safe_text = text.replace('\n', ' ')[:8192]
        if not safe_text.strip():
            return []

        resp = await client.embeddings.create(
            input=[safe_text],
            model="text-embedding-3-small"
        )
        return resp.data[0].embedding
    except Exception as exc:
        logger.error(f"OpenAI embedding error: {exc}")
        return []


# ─────────────────────────────────────────────────────────────
# Legacy summarise endpoint (kept for /api/ai/summarize routes)
# ─────────────────────────────────────────────────────────────

async def summarize_bill(bill: dict[str, Any]) -> dict[str, Any]:
    """Generate a bilingual summary from structured bill data (no PDF needed)."""
    prompt = f"""
Bill title:       {bill.get('title', 'N/A')}
Ministry:         {bill.get('ministry', 'N/A')}
Presenter:        {bill.get('presenter', 'N/A')}
Year (BS):        {bill.get('year_bs', 'N/A')}
Session:          {bill.get('session', 'N/A')}
Category:         {bill.get('category', 'N/A')}
Type:             {bill.get('governmental_type', 'N/A')}
Original/Amend:   {bill.get('original_amendment', 'N/A')}
Timeline (passed):{bill.get('timeline_passed', 'not yet')}
""".strip()

    SUMMARISE_SYSTEM = """\
You are a bilingual (English + Nepali) legislative analyst for Nepal's Pratinidhi Sabha.
Given structured data about a parliamentary bill, return a JSON object with exactly these keys:
{
  "summary_en": "2-3 sentence plain-English summary",
  "summary_ne": "same summary in Nepali (Devanagari script)",
  "key_points": ["bullet 1", "bullet 2", "bullet 3"],
  "affected_groups": ["group 1", "group 2"],
  "concerns": ["concern 1", "concern 2"]
}
Be concise, factual, and neutral. Respond with raw JSON only — no markdown fences.
"""
    client = _get_client()
    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SUMMARISE_SYSTEM},
            {"role": "user",   "content": prompt},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)
