from fastapi import APIRouter, HTTPException

from src.api.schemas import (
    PredictionRequest,
    PredictionResponse
)

from src.inference.predictor import predictor
from src.utils.logger import logger

router = APIRouter()


@router.get("/")
def home():
    """
    Health Check Endpoint
    """

    return {
        "status": "running",
        "model": "Real Estate Price Prediction API",
        "version": "1.0.0"
    }


@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict_house_price(request: PredictionRequest):

    try:

        logger.info("Received prediction request")

        predicted_price = predictor.predict(
            total_sqft=request.total_sqft,
            bath=request.bath,
            balcony=request.balcony,
            bhk=request.bhk,
            location=request.location,
            area_type=request.area_type,
            availability=request.availability
        )

        logger.info("Prediction Successful")

        return PredictionResponse(
            predicted_price=round(predicted_price, 2)
        )

    except Exception as e:

        logger.error(str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Prediction Failed : {str(e)}"
        )