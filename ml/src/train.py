# train_model.py
import pandas as pd
import numpy as np
import joblib
import re

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# ------------------------------
# Load Dataset
# ------------------------------
df = pd.read_csv("../data/bengaluru_house_prices.csv")

# ------------------------------
# Helpers
# ------------------------------
def convert_size(x):
    """'2 BHK' -> 2, '4 Bedroom' -> 4"""
    try:
        return int(str(x).split()[0])
    except Exception:
        return None


def convert_sqft(x):
    """
    Handles:
      - '1200 - 1400'    -> average
      - '188.89Sq. Yards'
      - '34.46Sq. Meter'
      - '3.2 Acres'
      - plain numeric strings
    """
    try:
        x = str(x).strip()

        # Range like "1200 - 1400"
        if "-" in x:
            parts = x.split("-")
            return (float(parts[0]) + float(parts[1])) / 2

        # Sq. Meter
        if "Sq. Meter" in x or "Sq. Metre" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 10.7639

        # Sq. Yards
        if "Sq. Yard" in x or "Sq. Yards" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 9

        # Acres
        if "Acre" in x or "Acres" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 43560

        # Simple numeric
        return float(re.findall(r"[\d\.]+", x)[0])
    except Exception:
        return None


def remove_sqft_per_bhk_outliers(df):
    """
    Minimum 300 sq.ft per BHK.
    Removes crazy small houses like 1000 sqft, 6 BHK etc.
    """
    df = df.copy()
    df["sqft_per_bhk"] = df["total_sqft"] / df["bhk"]
    df = df[df["sqft_per_bhk"] >= 300]
    df.drop(columns=["sqft_per_bhk"], inplace=True)
    return df


def remove_price_per_sqft_outliers(df):
    """
    Removes price-per-sqft outliers location-wise:
      Keep rows within [mean - 1*std, mean + 1*std] for each location.
    """
    df = df.copy()
    df["price_per_sqft"] = df["price"] * 100000 / df["total_sqft"]

    def filter_group(subdf):
        m = subdf["price_per_sqft"].mean()
        s = subdf["price_per_sqft"].std()
        return subdf[
            (subdf["price_per_sqft"] > m - s) &
            (subdf["price_per_sqft"] < m + s)
        ]

    df = df.groupby("location", group_keys=False).apply(filter_group)
    df.drop(columns=["price_per_sqft"], inplace=True)
    return df


# ------------------------------
# Basic Cleaning
# ------------------------------
df["bhk"] = df["size"].apply(convert_size)
df["total_sqft"] = df["total_sqft"].apply(convert_sqft)

df = df.dropna(subset=["location", "total_sqft", "bath", "bhk", "price"])

# Remove absurd sqft/bhk combos
df = remove_sqft_per_bhk_outliers(df)

# Strip location names
df["location"] = df["location"].apply(lambda x: x.strip())

# Group very rare locations to "other"
location_counts = df["location"].value_counts()
rare_locations = location_counts[location_counts <= 10].index
df["location"] = df["location"].apply(
    lambda x: "other" if x in rare_locations else x
)

# Remove price_per_sqft outliers (AFTER location cleaning)
df = remove_price_per_sqft_outliers(df)

print(f"✅ Cleaned dataset shape: {df.shape}")

# ------------------------------
# Train / Test Split
# ------------------------------
X = df[["location", "total_sqft", "bath", "bhk"]]
y = df["price"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["location"]),
        ("num", "passthrough", ["total_sqft", "bath", "bhk"]),
    ]
)

# A stronger model than plain LinearRegression
regressor = RandomForestRegressor(
    n_estimators=200,
    max_depth=None,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
)

model = Pipeline([
    ("preprocessing", preprocessor),
    ("regressor", regressor),
])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ------------------------------
# Train
# ------------------------------
model.fit(X_train, y_train)

# ------------------------------
# Evaluate on Test Set
# ------------------------------
y_pred = model.predict(X_test)

r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print("\n===== TEST SET PERFORMANCE =====")
print(f"R² Score:  {r2:.4f}")
print(f"MAE:       {mae:.4f}")
print(f"RMSE:      {rmse:.4f}")

# ------------------------------
# Save trained model (for predict.py)
# ------------------------------
joblib.dump(model, "model.pkl")
print("\n🎉 Model trained successfully!")
print("📁 Saved at: model.pkl")
