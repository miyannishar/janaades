"""
Nepal Parliament Monitor — FastAPI Backend
main → router → internal
"""

import logging
import logging.config
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from internal.config import settings
from internal.scheduler import start_scheduler, stop_scheduler
from router.bills import router as bills_router
from router.scraper import router as scraper_router
from router.ai import router as ai_router
from router.activities import router as activities_router

# ── Logging ─────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
# Silence noisy libraries regardless of LOG_LEVEL
for _noisy in (
    "hpack", "httpcore", "httpx",            # HTTP/2 transport
    "pdfminer.psparser", "pdfminer.pdfpage", # PDF token-level tracing
    "pdfminer.pdfinterp", "pdfminer.cmapdb",
    "pdfminer.pdfdocument", "pdfminer.pdfdevice",
    "pdfminer",                               # catch-all for pdfminer.*
    "pdfplumber",
):
    logging.getLogger(_noisy).setLevel(logging.WARNING)
logger = logging.getLogger(__name__)


# ── Lifespan ─────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up — Nepal Parliament Monitor API")
    start_scheduler()
    yield
    logger.info("Shutting down")
    stop_scheduler()


# ── App ──────────────────────────────────────────────────────────
app = FastAPI(
    title="Nepal Parliament Monitor API",
    description="Scrapes and serves Nepal Pratinidhi Sabha bill data",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten per-env
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────
app.include_router(bills_router,      prefix="/api")
app.include_router(scraper_router,    prefix="/api")
app.include_router(ai_router,         prefix="/api")
app.include_router(activities_router, prefix="/api")


# ── Health ───────────────────────────────────────────────────────
@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}
