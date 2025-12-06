import pandas as pd
import numpy as np
import joblib
import re
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# -------------------------
# Load trained model
# -------------------------
model = joblib.load("src/model.pkl")   # saved by train.py in src/

# -------------------------
# Helper functions
# (same logic as in train.py)
# -------------------------
def convert_size(x):
    """'2 BHK' -> 2, '4 Bedroom' -> 4"""
    try:
        return int(str(x).split()[0])
    except Exception:
        return None


def convert_sqft(x):
    """
    Handles:
      - '1200 - 1400'
      - '188.89Sq. Yards'
      - '34.46Sq. Meter'
      - '3.2 Acres'
      - numeric strings
    """
    try:
        x = str(x).strip()

        if "-" in x:
            parts = x.split("-")
            return (float(parts[0]) + float(parts[1])) / 2

        if "Sq. Meter" in x or "Sq. Metre" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 10.7639

        if "Sq. Yard" in x or "Sq. Yards" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 9

        if "Acre" in x or "Acres" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 43560

        return float(re.findall(r"[\d\.]+", x)[0])
    except Exception:
        return None


def remove_sqft_per_bhk_outliers(df):
    df = df.copy()
    df["sqft_per_bhk"] = df["total_sqft"] / df["bhk"]
    df = df[df["sqft_per_bhk"] >= 300]
    df.drop(columns=["sqft_per_bhk"], inplace=True)
    return df


def remove_price_per_sqft_outliers(df):
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


# -------------------------
# Load & clean dataset
# -------------------------
df = pd.read_csv("./data/bengaluru_house_prices.csv")

df["bhk"] = df["size"].apply(convert_size)
df["total_sqft"] = df["total_sqft"].apply(convert_sqft)

df = df.dropna(subset=["location", "total_sqft", "bath", "bhk", "price"])

df = remove_sqft_per_bhk_outliers(df)

df["location"] = df["location"].apply(lambda x: x.strip())
location_counts = df["location"].value_counts()
rare_locations = location_counts[location_counts <= 10].index
df["location"] = df["location"].apply(
    lambda x: "other" if x in rare_locations else x
)

df = remove_price_per_sqft_outliers(df)

print(f"✅ Cleaned evaluation dataset shape: {df.shape}")

# -------------------------
# Features / target + split
# -------------------------
X = df[["location", "total_sqft", "bath", "bhk"]]
y = df["price"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------------
# Predict on TEST SET ONLY
# -------------------------
predictions = model.predict(X_test)

# Metrics
r2 = r2_score(y_test, predictions)
mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))

print("===== MODEL EVALUATION (TEST SET) =====")
print(f"R² Score:  {r2:.4f}")
print(f"MAE:       {mae:.4f}")
print(f"RMSE:      {rmse:.4f}")

# =========================
#       VISUALIZATIONS
# =========================

# =========================
#   SINGLE VISUALIZATION
# =========================

metrics = ["R² Score", "MAE", "RMSE"]
values = [r2, mae, rmse]

plt.figure(figsize=(8, 5))
bars = plt.bar(metrics, values)

plt.title("Model Evaluation Metrics", fontsize=14)
plt.ylabel("Metric Values", fontsize=12)

# Add value labels on bars
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, yval,
             f"{yval:.3f}", ha="center", va="bottom", fontsize=11)

plt.tight_layout()
plt.show()
