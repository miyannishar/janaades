from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):
    supabase_url: str
    supabase_service_role_key: str
    openai_api_key: str = ""
    pdf_storage_dir: Path = Path("/app/pdfs")
    scrape_schedule_hour: int = 2        # UTC hour for daily bill scrape
    news_scrape_hours: str = "0,6,12,18" # UTC hours for news scrape (cron hour field)
    log_level: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
