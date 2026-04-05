"""
Tool: post_to_reddit
─────────────────────
Posts content to Reddit using PRAW (Python Reddit API Wrapper).
Targets Nepal-focused subreddits by default.

Required env vars:
  REDDIT_CLIENT_ID       — from https://www.reddit.com/prefs/apps
  REDDIT_CLIENT_SECRET   — from the same page
  REDDIT_USERNAME        — Reddit account username
  REDDIT_PASSWORD        — Reddit account password
  REDDIT_USER_AGENT      — e.g. "JanadeshBot/1.0 by u/nishar"

The Reddit account must be old enough and have sufficient karma to post
in subreddits. New accounts are often blocked by AutoModerator.
"""

from __future__ import annotations

import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

# Default Nepal subreddits most relevant for political accountability
DEFAULT_SUBREDDIT = "Nepal"
NEPAL_SUBREDDITS = ["Nepal", "NepalPolitics", "nepalinews"]


def post_to_reddit(
    title: str,
    body: str,
    subreddit: str = DEFAULT_SUBREDDIT,
    flair: Optional[str] = None,
) -> dict:
    """Post a text submission to a Reddit subreddit.

    Use this tool to share important parliamentary news, bill critiques,
    or accountability findings with the Reddit community.

    IMPORTANT CONTENT RULES — always follow these before posting:
    - Every factual claim must be backed by a source (bill number, news link, official statement).
    - Do not post inflammatory or speculative content.
    - Write in a factual, evidence-based tone accessible to general Nepali citizens.
    - Include a short Nepali summary section if the content is in English.
    - Recommended subreddits: 'Nepal', 'NepalPolitics', 'nepalinews'.

    Args:
        title: The post title (max 300 chars). Should be clear and descriptive.
               Example: "Bill #13 would give government power to revoke journalist licenses"
        body: The full post body in markdown. Should include:
              - A brief summary in simple English (2-3 sentences)
              - A Nepali summary (संक्षेप) for local readers
              - Key facts with sources/references
              - A "Why this matters" section
        subreddit: The subreddit name (without r/). Default: 'Nepal'.
        flair: Optional post flair text if the subreddit requires it.

    Returns:
        A dictionary with:
        - success: True/False
        - post_url: Direct link to the Reddit post (if successful)
        - post_id: Reddit post ID
        - error: Error message if posting failed
    """
    client_id     = os.environ.get("REDDIT_CLIENT_ID", "")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET", "")
    username      = os.environ.get("REDDIT_USERNAME", "")
    password      = os.environ.get("REDDIT_PASSWORD", "")
    user_agent    = os.environ.get("REDDIT_USER_AGENT", "JanadeshBot/1.0")

    if not all([client_id, client_secret, username, password]):
        return {
            "success": False,
            "error": (
                "Reddit credentials are not configured. "
                "Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, "
                "REDDIT_USERNAME, and REDDIT_PASSWORD in .env"
            ),
        }

    try:
        import praw  # type: ignore

        reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            username=username,
            password=password,
            user_agent=user_agent,
        )

        sub = reddit.subreddit(subreddit)
        submission = sub.submit(
            title=title[:300],
            selftext=body,
            flair_text=flair,
        )

        post_url = f"https://reddit.com{submission.permalink}"
        logger.info("Reddit post created: %s", post_url)

        return {
            "success":  True,
            "post_url": post_url,
            "post_id":  submission.id,
            "subreddit": subreddit,
        }

    except ImportError:
        return {
            "success": False,
            "error": "praw is not installed. Run: pip install praw",
        }
    except Exception as exc:
        logger.error("Reddit post error: %s", exc)
        return {"success": False, "error": str(exc)}
