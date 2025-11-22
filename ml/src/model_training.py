import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression

from data_preprocessing import load_data, clean_data

def train_model(data_path):
    df = load_data(data_path)
    df = clean_data(df)

    X = df[['location', 'total_sqft', 'bath', 'bhk']]
    y = df['price']

    categorical_features = ['location']
    numeric_features = ['total_sqft', 'bath', 'bhk']

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
            ('num', 'passthrough', numeric_features)
        ]
    )

    model = Pipeline([
        ('preprocessing', preprocessor),
        ('regressor', LinearRegression())
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model.fit(X_train, y_train)

    joblib.dump(model, "models/house_price_model.pkl")
    print("Model trained and saved!")

    return model, X_test, y_test

if __name__ == "__main__":
    train_model("../data/bengaluru_house_prices.csv")
