
import joblib
import xgboost as xgb
from pathlib import Path


# Get backend directory
BASE_DIR = Path(__file__).resolve().parents[2]

# Model directory
MODEL_DIR = BASE_DIR / "ml_models"


def load_models():

    models = {}

    # Model file names
    model_files = {
        "customer_segmentation": "customer_segmentation.pkl",
        "demand_forecasting": "demand_forecasting.pkl",
        "sales_forecasting": "sales_forecasting.pkl"
    }

    # Load each model bundle
    for model_name, file_name in model_files.items():

        model_path = MODEL_DIR / file_name

        if not model_path.exists():
            raise FileNotFoundError(
                f"Model file not found: {model_path}"
            )

        print(f"\nLoading model: {model_name}")

        # Load pickle bundle
        model_bundle = joblib.load(model_path)

        # Reconstruct XGBoost models
        if model_name in ["demand_forecasting", "sales_forecasting"]:

            model_data = model_bundle["model"]

            if isinstance(model_data, dict) and "booster_bytes" in model_data:

                reconstructed_model = xgb.XGBRegressor(
                    **model_data["model_params"]
                )

                reconstructed_model.load_model(
                    bytearray(model_data["booster_bytes"])
                )

                # Replace serialized model data with reconstructed model
                model_bundle["model"] = reconstructed_model

                print("XGBoost model reconstructed successfully!")

        # Store loaded bundle
        models[model_name] = model_bundle

        print(f"{model_name} loaded successfully!")

    return models
