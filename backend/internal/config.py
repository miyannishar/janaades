from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from typing import Optional


class Settings(BaseSettings):
    # ── Core ──────────────────────────────────────────────────────────────────
    supabase_url: str
    supabase_service_role_key: str
    openai_api_key: str = ""
    google_api_key: str = ""          # Google ADK / Gemini
    pdf_storage_dir: Path = Path("/app/pdfs")
    scrape_schedule_hour: int = 2        # UTC hour for daily bill scrape
    news_scrape_hours: str = "0,6,12,18" # UTC hours for news scrape (cron hour field)
    log_level: str = "INFO"

    # ── Facebook Graph API ────────────────────────────────────────────────────
    fb_page_slug: str = "officialroutineofnepalbanda"
    fb_access_token: str = ""

    # ── Agent: Pillar 1 — Intelligence (SerpAPI) ──────────────────────────────
    serpapi_key: str = ""

    # ── Agent: Pillar 3 — Action (Reddit / PRAW) ──────────────────────────────
    reddit_client_id: str = ""
    reddit_client_secret: str = ""
    reddit_username: str = ""
    reddit_password: str = ""
    reddit_user_agent: str = "JanadeshBot/1.0"

    # ── Agent: Pillar 3 — Action (X / Twitter) ───────────────────────────────
    x_api_key: str = ""
    x_api_key_secret: str = ""
    x_access_token: str = ""
    x_access_token_secret: str = ""
    x_username: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
