from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import router
from src.models.load_model import get_model
from src.utils.config import (
    API_TITLE,
    API_VERSION
)
from src.utils.logger import logger


# ==========================================
# Create FastAPI Application
# ==========================================

app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)


# ==========================================
# Enable CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Startup Event
# ==========================================

@app.on_event("startup")
def startup():

    logger.info("Starting RezoX ML API...")

    get_model()

    logger.info("Model loaded successfully.")


# ==========================================
# Include Routes
# ==========================================

app.include_router(router)


# ==========================================
# Shutdown Event
# ==========================================

@app.on_event("shutdown")
def shutdown():

    logger.info("Shutting down RezoX ML API...")