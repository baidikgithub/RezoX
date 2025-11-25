import joblib
import pandas as pd
import sys
import re

# Load trained model
model = joblib.load("model.pkl")


# ------------------------------
# Helper: Clean sqft before prediction
# ------------------------------
def clean_sqft(x):
    try:
        x = str(x).strip()

        if "-" in x:
            a, b = x.split("-")
            return (float(a) + float(b)) / 2

        if "Sq. Meter" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 10.7639

        if "Sq. Yards" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 9

        if "Acre" in x:
            num = float(re.findall(r"[\d\.]+", x)[0])
            return num * 43560

        return float(re.findall(r"[\d\.]+", x)[0])

    except:
        return None


# ------------------------------
# Main Prediction Function
# ------------------------------
def predict(location, sqft, bath, bhk):

    sqft = clean_sqft(sqft)

    data = pd.DataFrame([[
        location,
        sqft,
        int(bath),
        int(bhk)
    ]], columns=["location", "total_sqft", "bath", "bhk"])

    return float(model.predict(data)[0])


# ------------------------------
# CLI Support (Optional)
# Run like:
# python3 predict.py "Whitefield" 1200 2 2
# ------------------------------
if __name__ == "__main__":
    if len(sys.argv) == 5:
        location = sys.argv[1]
        sqft = sys.argv[2]
        bath = sys.argv[3]
        bhk = sys.argv[4]

        price = predict(location, sqft, bath, bhk)
        print(price)
    else:
        print("Usage: python3 predict.py <location> <sqft> <bath> <bhk>")
