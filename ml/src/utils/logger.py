import logging
import sys

LOGGER_NAME = "rezox_ml"

logger = logging.getLogger(LOGGER_NAME)

logger.setLevel(logging.INFO)

formatter = logging.Formatter(
    "%(asctime)s | %(levelname)s | %(message)s"
)

console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)

if not logger.handlers:
    logger.addHandler(console_handler)