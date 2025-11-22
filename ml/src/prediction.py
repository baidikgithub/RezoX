import joblib
import pandas as pd

model = joblib.load("../models/house_price_model.pkl")

def predict_price(location, sqft, bath, bhk):
    df = pd.DataFrame([[location, sqft, bath, bhk]],
                      columns=['location', 'total_sqft', 'bath', 'bhk'])
    return model.predict(df)[0]

# Example:
# print(predict_price("Electronic City Phase II", 1200, 2, 2))
