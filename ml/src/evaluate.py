import pandas as pd
import numpy as np
import joblib
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Load model
model = joblib.load("src/model.pkl")

# Load dataset
df = pd.read_csv("data/bengaluru_house_prices.csv")

# --- CLEANING PIPELINE (same as training) ---

# Remove missing values
df = df.dropna(subset=['location', 'size', 'total_sqft', 'bath', 'price'])

# Convert "2 BHK" → 2
def convert_size(x):
    try:
        return int(x.split(" ")[0])
    except:
        return None

df["bhk"] = df["size"].apply(convert_size)

# Convert total_sqft to float
def convert_sqft(x):
    try:
        x = str(x)

        # Case: "2100 - 2850"
        if "-" in x:
            a, b = x.split("-")
            return (float(a) + float(b)) / 2

        # Case: "34.46Sq. Meter" → convert meter to sqft
        if "Sq. Meter" in x:
            val = float(x.replace("Sq. Meter", ""))
            return val * 10.764

        # Case: "1200sqft" → 1200
        if "sqft" in x.lower():
            return float(x.lower().replace("sqft", ""))

        return float(x)

    except:
        return None

df["total_sqft"] = df["total_sqft"].apply(convert_sqft)

# Drop invalid rows
df = df.dropna(subset=["total_sqft", "bhk", "bath"])

# Select features
X = df[['location', 'total_sqft', 'bath', 'bhk']]
y = df['price']

# Predict
predictions = model.predict(X)

# Metrics
r2 = r2_score(y, predictions)
mae = mean_absolute_error(y, predictions)
rmse = np.sqrt(mean_squared_error(y, predictions))

print("===== MODEL EVALUATION =====")
print(f"R² Score:  {r2:.4f}")
print(f"MAE:       {mae:.4f}")
print(f"RMSE:      {rmse:.4f}")
