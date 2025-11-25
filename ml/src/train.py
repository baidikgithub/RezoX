import pandas as pd
import numpy as np
import joblib
import re
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

# ------------------------------
# Load Dataset
# ------------------------------
df = pd.read_csv("data/bengaluru_house_prices.csv")

# ------------------------------
# Size (BHK) Extraction
# ------------------------------
def convert_size(x):
    try:
        return int(str(x).split(" ")[0])
    except:
        return None


df["bhk"] = df["size"].apply(convert_size)


# ------------------------------
# Sqft Cleaning Function
# Handles:
#   - "870 - 1080" → avg
#   - "188.89Sq. Yards" → sqft
#   - "34.46Sq. Meter" → sqft
#   - "3.2 Acres" → sqft
# ------------------------------
def convert_sqft(x):
    try:
        x = str(x).strip()

        # Case 1: Range like "1200 - 1400"
        if "-" in x:
            parts = x.split("-")
            return (float(parts[0]) + float(parts[1])) / 2

        # Case 2: Sq. Meter
        if "Sq. Meter" in x or "Sq. Metre" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 10.7639

        # Case 3: Sq. Yards
        if "Sq. Yards" in x or "Sq. Yard" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 9

        # Case 4: Acres
        if "Acre" in x or "Acres" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 43560

        # Case 5: Simple numeric
        return float(re.findall(r"[\d\.]+", x)[0])
    except:
        return None


df["total_sqft"] = df["total_sqft"].apply(convert_sqft)


# ------------------------------
# Remove rows with invalid data
# ------------------------------
df = df.dropna(subset=["location", "total_sqft", "bath", "bhk", "price"])

# ------------------------------
# Clean location categories
# ------------------------------
df["location"] = df["location"].apply(lambda x: x.strip())
location_counts = df["location"].value_counts()
rare_locations = location_counts[location_counts <= 10].index
df["location"] = df["location"].apply(lambda x: "other" if x in rare_locations else x)

# ------------------------------
# Train Test Split
# ------------------------------
X = df[["location", "total_sqft", "bath", "bhk"]]
y = df["price"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["location"]),
        ("num", "passthrough", ["total_sqft", "bath", "bhk"])
    ]
)

model = Pipeline([
    ("preprocessing", preprocessor),
    ("regressor", LinearRegression())
])

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train the model
model.fit(X_train, y_train)

# ------------------------------
# Save trained model
# ------------------------------
joblib.dump(model, "src/model.pkl")

print("\n🎉 Model trained successfully!")
print("📁 Saved at: src/model.pkl")
