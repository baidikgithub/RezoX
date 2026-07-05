from pathlib import Path

# ==========================================
# Project Root
# ==========================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

# ==========================================
# Model Path
# ==========================================

MODEL_PATH = PROJECT_ROOT / "models" / "best_model.pkl"

# ==========================================
# Data Paths
# ==========================================

DATA_DIR = PROJECT_ROOT / "data"

RAW_DATA_DIR = DATA_DIR / "raw"

PROCESSED_DATA_DIR = DATA_DIR / "processed"

REPORT_DIR = PROJECT_ROOT / "reports"

# ==========================================
# API Configuration
# ==========================================

API_TITLE = "RezoX Real Estate Price Prediction API"

API_VERSION = "1.0.0"

HOST = "0.0.0.0"

PORT = 8000