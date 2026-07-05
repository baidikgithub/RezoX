import pandas as pd

from src.models.load_model import get_model
from src.utils.logger import logger


class HousePricePredictor:

    def __init__(self):
        self.model = get_model()

    def predict(
        self,
        total_sqft: float,
        bath: int,
        balcony: int,
        bhk: int,
        location: str,
        area_type: str,
        availability: str,
    ):

        input_df = pd.DataFrame([
            {
                "total_sqft": total_sqft,
                "bath": bath,
                "balcony": balcony,
                "bhk": bhk,
                "location": location,
                "area_type": area_type,
                "availability": availability,
            }
        ])

        logger.info("Running prediction...")

        prediction = self.model.predict(input_df)

        logger.info("Prediction completed successfully.")

        return float(prediction[0])


predictor = HousePricePredictor()