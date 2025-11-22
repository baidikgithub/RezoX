from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import numpy as np

def evaluate_model(model, X_test, y_test):
    predictions = model.predict(X_test)

    r2 = r2_score(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))

    print("\n===== MODEL EVALUATION =====")
    print("R2 Score :", round(r2, 3))
    print("MAE :", round(mae, 3))
    print("RMSE :", round(rmse, 3))

    return r2, mae, rmse
