import logging
from internal.db import get_client

logger = logging.getLogger(__name__)

def save_social_post(title: str, content: str) -> str:
    """
    Save a generated social media post to the database for manual publishing later.
    
    Args:
        title (str): The title of the post
        content (str): The body content of the post
        
    Returns:
        str: Success or error message
    """
    try:
        db = get_client()
        data = {
            "title": title,
            "content": content
        }
        res = db.table("ai_social_posts").insert(data).execute()
        if res.data:
            logger.info(f"Successfully saved social post to db: {title}")
            return f"Successfully saved social post to database with title: {title}"
        return "Failed to save post to database."
    except Exception as e:
        logger.error(f"Error saving social post to database: {e}")
        return f"Error saving social post to database: {str(e)}"
