from supabase import create_client, Client
from internal.config import settings
import functools


@functools.lru_cache(maxsize=1)
def get_client() -> Client:
    """Singleton Supabase client (service role — bypasses RLS)."""
    return create_client(str(settings.supabase_url), settings.supabase_service_role_key)
