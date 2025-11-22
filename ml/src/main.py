from data_preprocessing import load_data, clean_data
from model_training import train_model
from model_evaluation import evaluate_model
import joblib

DATA_PATH = "data/bengaluru_house_prices.csv"
MODEL_PATH = "models/house_price_model.pkl"


def main():
    print("\n🚀 Bengaluru House Price Prediction Pipeline Started...\n")

    # 1. Load + Clean Data
    print("📥 Loading and cleaning data...")
    df = load_data(DATA_PATH)
    df_clean = clean_data(df)

    # 2. Train Model
    print("🤖 Training model...")
    model, X_test, y_test = train_model(DATA_PATH)

    # 3. Evaluate Model
    print("📊 Evaluating model...")
    evaluate_model(model, X_test, y_test)

    # 4. Save Model
    joblib.dump(model, MODEL_PATH)
    print(f"\n💾 Model saved successfully at {MODEL_PATH}")

    print("\n✅ Pipeline completed successfully!\n")


if __name__ == "__main__":
    main()
