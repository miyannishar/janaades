import os
import logging
from agent_system.tools.search import web_search
from agent_system.tools.database import save_social_post

logger = logging.getLogger(__name__)

def get_bill_summary(registration_no: int) -> dict:
    """Fetch the title and summary of a Nepal parliament bill by its registration number.

    Args:
        registration_no: The official parliament registration number of the bill.

    Returns:
        A dictionary containing bill information. If multiple bills share the
        same registration number (e.g. different chambers or years), all matches
        are returned under the 'bills' key. Returns an error key if not found.
    """
    try:
        from supabase import create_client

        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        db  = create_client(url, key)

        res = (
            db.table("bills")
            .select("registration_no, title, title_nepali, status, summary, chamber, ministry, year_bs, session")
            .eq("registration_no", registration_no)
            .limit(5)
            .execute()
        )

        rows = res.data or []
        if not rows:
            return {"error": f"Bill #{registration_no} not found in the database."}

        if len(rows) == 1:
            b = rows[0]
            return {
                "registration_no": b.get("registration_no"),
                "title":           b.get("title"),
                "title_nepali":    b.get("title_nepali"),
                "status":          b.get("status"),
                "chamber":         b.get("chamber"),
                "ministry":        b.get("ministry"),
                "year_bs":         b.get("year_bs"),
                "session":         b.get("session"),
                "summary":         b.get("summary") or "No AI summary available yet.",
            }

        return {
            "note": (
                f"Registration #{registration_no} matches {len(rows)} bill(s) "
                "(same number used across different sessions or chambers)."
            ),
            "bills": [
                {
                    "title":    b.get("title"),
                    "status":   b.get("status"),
                    "chamber":  b.get("chamber"),
                    "year_bs":  b.get("year_bs"),
                    "session":  b.get("session"),
                    "summary":  b.get("summary") or "No AI summary available yet.",
                }
                for b in rows
            ],
        }
    except Exception as exc:
        logger.error("get_bill_summary error: %s", exc)
        return {"error": str(exc)}

def search_bills(query: str = "", limit: int = 5) -> dict:
    """Search for bills in the Nepal parliament database by keyword in title or summary.
    If query is empty, returns the latest bills.

    Args:
        query: Optional keyword to search within bill titles or summaries.
        limit: Number of results to return (default 5, max 10).

    Returns:
        A dictionary containing a list of matched bills.
    """
    try:
        from supabase import create_client

        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        db  = create_client(url, key)

        limit_val = min(limit, 10)
        
        req = db.table("bills").select("registration_no, title, status, chamber, summary, id")
        if query.strip():
            # filter by title ilike query
            req = req.ilike("title", f"%{query}%")
        
        # order by ID descending to get recent ones implicitly
        res = req.order("id", desc=True).limit(limit_val).execute()

        rows = res.data or []
        if not rows:
            return {"note": "No bills found matching your query in the database."}

        return {
            "query": query,
            "results": [
                {
                    "id": b.get("id"),
                    "registration_no": b.get("registration_no"),
                    "title": b.get("title"),
                    "status": b.get("status"),
                    "chamber": b.get("chamber"),
                    "summary": b.get("summary") or "No AI summary available yet.",
                }
                for b in rows
            ],
            "note": "Use 'get_bill_summary' with the 'registration_no' to see full details if needed, or use the provided summary."
        }
    except Exception as exc:
        logger.error("search_bills error: %s", exc)
        return {"error": str(exc)}

async def semantic_search_db(table_name: str, query: str, limit: int = 5) -> dict:
    """Perform a semantic search across any database table using AI embeddings.
    Allows the agent to find conceptually relevant bills, activities, or promises.

    Args:
        table_name: The name of the table to search (e.g. 'bills', 'activities', 'promises', 'ministers', 'misconduct').
        query: The semantic search query phrase.
        limit: Number of results to return (default 5).

    Returns:
        JSON response of matched documents or an error.
    """
    try:
        from supabase import create_client
        from internal.ai import generate_embedding

        emb = await generate_embedding(query)
        if not emb:
            return {"error": "Failed to generate embedding for the search query."}

        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        db  = create_client(url, key)

        res = db.rpc(
            "match_documents",
            {
                "query_table": table_name,
                "query_embedding": emb,
                "match_threshold": 0.0,
                "match_count": min(limit, 10),
            }
        ).execute()

        return {"query": query, "table": table_name, "results": res.data or []}
    except Exception as exc:
        logger.error("semantic_search_db error: %s", exc)
        return {"error": str(exc)}

def database_update(table_name: str, row_id: str, updates: dict) -> dict:
    """Update a specific row in the database dynamically. 
    Allows the agent to update 'opposition_analysis' or other fields when the user provides context.

    Args:
        table_name: The name of the table to update (e.g. 'bills', 'activities').
        row_id: The exact UUID or string ID of the row to update.
        updates: A dictionary of column names to their new values to update.

    Returns:
        A dictionary with success status or an error.
    """
    try:
        from supabase import create_client

        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        db  = create_client(url, key)

        res = db.table(table_name).update(updates).eq("id", row_id).execute()
        if not res.data:
            return {"error": f"Failed to update row {row_id} in {table_name}. Row might not exist."}
        
        return {"status": "success", "message": f"Updated {len(res.data)} row(s) in {table_name}.", "updated_row": res.data[0]}

    except Exception as exc:
        logger.error("database_update error: %s", exc)
        return {"error": str(exc)}

BASE_TOOLS = [get_bill_summary, search_bills, semantic_search_db, database_update, web_search, save_social_post]
