"""
Tool: post_to_twitter (X)
──────────────────────────
Posts content to X (formerly Twitter) using the tweepy library and
the X API v2 OAuth2 credentials.

Required env vars:
  X_BEARER_TOKEN         — for reading (not needed for posting, but good to have)
  X_API_KEY              — OAuth 1.0a Consumer Key
  X_API_KEY_SECRET       — OAuth 1.0a Consumer Secret
  X_ACCESS_TOKEN         — OAuth 1.0a Access Token (for the posting account)
  X_ACCESS_TOKEN_SECRET  — OAuth 1.0a Access Token Secret

Get credentials at: https://developer.twitter.com/en/portal/dashboard
The account needs "Read and Write" permissions.

Note on threads: X limits single tweets to 280 chars. This tool
auto-splits longer content into a thread (reply chain).
"""

from __future__ import annotations

import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

MAX_TWEET_LENGTH = 280
THREAD_MARKER = "\n\n🧵 {n}/{total}"


def _split_into_thread(text: str) -> list[str]:
    """Split long text into tweet-sized chunks for a thread."""
    # Split on double newlines (paragraph breaks) first
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    tweets: list[str] = []
    current = ""

    for para in paragraphs:
        candidate = f"{current}\n\n{para}".strip() if current else para
        if len(candidate) <= MAX_TWEET_LENGTH - 15:  # leave room for thread marker
            current = candidate
        else:
            if current:
                tweets.append(current)
            # If a single paragraph is too long, split by sentences
            if len(para) > MAX_TWEET_LENGTH - 15:
                sentences = para.replace(". ", ".\n").split("\n")
                chunk = ""
                for sent in sentences:
                    test = f"{chunk} {sent}".strip() if chunk else sent
                    if len(test) <= MAX_TWEET_LENGTH - 15:
                        chunk = test
                    else:
                        if chunk:
                            tweets.append(chunk)
                        chunk = sent[:MAX_TWEET_LENGTH - 15]
                if chunk:
                    tweets.append(chunk)
                current = ""
            else:
                current = para

    if current:
        tweets.append(current)

    # Add thread markers
    if len(tweets) > 1:
        tweets = [
            f"{t}{THREAD_MARKER.format(n=i+1, total=len(tweets))}"
            for i, t in enumerate(tweets)
        ]

    return tweets


def post_to_twitter(
    content: str,
    as_thread: bool = True,
) -> dict:
    """Post content to X (Twitter), automatically splitting into a thread if needed.

    Use this to share parliamentary accountability findings with X users.
    Content should be punchy, factual, and accessible — ideal for journalists
    and politically engaged citizens.

    IMPORTANT CONTENT RULES — always follow these before posting:
    - Keep language factual and evidence-based — never inflammatory.
    - Start the thread with a strong, clear hook (the most important fact first).
    - Use Nepali words/phrases where natural to reach local audiences.
    - Include relevant hashtags at the end: #Nepal #संसद #NepalPolitics
    - Keep individual tweets concise — one idea per tweet.
    - Cite bill numbers or sources (e.g. "Bill #13, Reg. 2082").

    Args:
        content: The full content to post. If longer than 280 characters and
                 as_thread is True, it will be split into a reply thread automatically.
                 Write naturally — the tool handles splitting.
        as_thread: If True (default), long content becomes a reply thread.
                   If False, content is truncated to 280 chars.

    Returns:
        A dictionary with:
        - success: True/False
        - tweet_ids: List of tweet IDs (one per thread item)
        - tweet_urls: List of direct URLs to each tweet
        - thread_length: Number of tweets in the thread
        - error: Error message if posting failed
    """
    api_key              = os.environ.get("X_API_KEY", "")
    api_key_secret       = os.environ.get("X_API_KEY_SECRET", "")
    access_token         = os.environ.get("X_ACCESS_TOKEN", "")
    access_token_secret  = os.environ.get("X_ACCESS_TOKEN_SECRET", "")

    if not all([api_key, api_key_secret, access_token, access_token_secret]):
        return {
            "success": False,
            "error": (
                "X/Twitter credentials are not configured. "
                "Set X_API_KEY, X_API_KEY_SECRET, X_ACCESS_TOKEN, "
                "and X_ACCESS_TOKEN_SECRET in .env"
            ),
        }

    try:
        import tweepy  # type: ignore

        client = tweepy.Client(
            consumer_key=api_key,
            consumer_secret=api_key_secret,
            access_token=access_token,
            access_token_secret=access_token_secret,
        )

        if as_thread and len(content) > MAX_TWEET_LENGTH:
            chunks = _split_into_thread(content)
        else:
            chunks = [content[:MAX_TWEET_LENGTH]]

        tweet_ids: list[str] = []
        tweet_urls: list[str] = []
        reply_to: Optional[str] = None

        # Post each chunk in sequence as a reply chain
        username = os.environ.get("X_USERNAME", "")  # optional — for URL building

        for chunk in chunks:
            kwargs: dict = {"text": chunk}
            if reply_to:
                kwargs["in_reply_to_tweet_id"] = reply_to

            resp = client.create_tweet(**kwargs)
            tweet_id = str(resp.data["id"])
            tweet_ids.append(tweet_id)

            url = (
                f"https://x.com/{username}/status/{tweet_id}"
                if username
                else f"https://x.com/i/web/status/{tweet_id}"
            )
            tweet_urls.append(url)
            reply_to = tweet_id

        logger.info("X thread posted: %d tweets, first=%s", len(tweet_ids), tweet_ids[0] if tweet_ids else "")

        return {
            "success":       True,
            "tweet_ids":     tweet_ids,
            "tweet_urls":    tweet_urls,
            "thread_length": len(tweet_ids),
        }

    except ImportError:
        return {
            "success": False,
            "error": "tweepy is not installed. Run: pip install tweepy",
        }
    except Exception as exc:
        logger.error("X post error: %s", exc)
        return {"success": False, "error": str(exc)}
