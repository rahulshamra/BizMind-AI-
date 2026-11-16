
import joblib
import xgboost
import sklearn
import numpy
import pandas
from pathlib import Path

# Model directory
MODEL_DIR = Path("ml_models")

# Model files
model_files = [
    "customer_segmentation.pkl",
    "demand_forecasting.pkl",
    "sales_forecasting.pkl"
]

# Print environment information
print("Python ML Environment")
print("XGBoost:", xgboost.__version__)
print("NumPy:", numpy.__version__)
print("Pandas:", pandas.__version__)
print("Scikit-learn:", sklearn.__version__)

# Test each model
for file_name in model_files:

    model_path = MODEL_DIR / file_name

    print(f"\nTesting: {file_name}")

    try:
        model = joblib.load(model_path)
        print(f"SUCCESS: {file_name} loaded!")

    except Exception as e:
        print(f"FAILED: {file_name}")
        print("Error:", repr(e))
