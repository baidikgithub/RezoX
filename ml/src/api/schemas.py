from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """
    Input schema for house price prediction.
    """

    total_sqft: float = Field(..., gt=0, description="Total area in square feet")

    bath: int = Field(..., gt=0, description="Number of bathrooms")

    balcony: int = Field(..., ge=0, description="Number of balconies")

    bhk: int = Field(..., gt=0, description="Number of bedrooms (BHK)")

    location: str = Field(..., min_length=2)

    area_type: str

    availability: str


class PredictionResponse(BaseModel):
    """
    Output schema.
    """

    predicted_price: float

    currency: str = "Lakhs"

    model: str = "RezoX Real Estate Price Prediction"