"""
Tool: web_search
─────────────────
Uses the SerpAPI (serpapi.com) to search Google in real time.

Required env var: SERPAPI_KEY
Get one at: https://serpapi.com  (free tier: 100 searches/month)

Package: google-search-results (already in requirements.txt)
"""

from __future__ import annotations

import logging
import os

logger = logging.getLogger(__name__)


def web_search(query: str, num_results: int = 5) -> dict:
    """Search the web for real-time information using Google Search via SerpAPI.

    Use this tool whenever you need current news, recent statements, court decisions,
    budget documents, or any information that may not be in the local database.
    Always prefer this over guessing when facts are uncertain.

    Args:
        query: The search query. Be specific — include names, bill titles, dates.
               Examples:
                 "Nepal Media Council Bill 2082 criticism"
                 "KP Sharma Oli press freedom statement 2024"
                 "Nepal parliament session schedule 2082"
        num_results: Number of results to return (1-10, default 5).

    Returns:
        A dictionary with a 'results' list. Each result has:
        - title: The page title
        - snippet: A summary of the page content
        - link: The URL
        - date: Publication date if available
        Returns an 'error' key if the search fails or the key is missing.
    """
    api_key = os.environ.get("SERPAPI_KEY", "")
    if not api_key:
        return {"error": "SERPAPI_KEY is not configured. Cannot perform web search."}

    try:
        from serpapi import GoogleSearch  # type: ignore

        params = {
            "q":       query,
            "api_key": api_key,
            "num":     min(num_results, 10),
            "gl":      "np",   # geolocation: Nepal
            "hl":      "en",   # language: English
        }
        search = GoogleSearch(params)
        data   = search.get_dict()

        if "error" in data:
            return {"error": data["error"]}

        results = []

        # Knowledge graph (fast fact, if available)
        kg = data.get("knowledge_graph", {})
        if kg.get("description"):
            results.append({
                "title":   kg.get("title", ""),
                "snippet": kg.get("description", ""),
                "link":    kg.get("website", ""),
                "date":    "",
                "source":  "knowledge_graph",
            })

        # Organic results
        for item in data.get("organic_results", []):
            results.append({
                "title":   item.get("title", ""),
                "snippet": item.get("snippet", ""),
                "link":    item.get("link", ""),
                "date":    item.get("date", ""),
                "source":  "organic",
            })

        return {
            "query":       query,
            "results":     results[:num_results],
            "total_found": len(data.get("organic_results", [])),
        }

    except ImportError:
        return {
            "error": (
                "google-search-results is not installed. "
                "Run: pip install google-search-results"
            )
        }
    except Exception as exc:
        logger.error("web_search error: %s", exc)
        return {"error": str(exc)}
