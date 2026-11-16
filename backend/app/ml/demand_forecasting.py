# %%writefile demand_forcasting.py

import pandas as pd
import numpy as np


def predict_next_7_days(model, feature_table, product_info, features):

    feature_table = feature_table.copy()

    feature_table["date"] = pd.to_datetime(
        feature_table["date"]
    )

    # Get latest historical feature row for every product
    latest_features = (
        feature_table
        .sort_values("date")
        .groupby("product_id")
        .tail(1)
        .copy()
    )

    # Select already calculated features
    X_latest = latest_features[features]

    # Predict next 7 days sales
    predictions = model.predict(X_latest)

    predictions = np.rint(
        np.maximum(predictions, 0)
    ).astype(int)

    # Prepare output
    result = latest_features[["product_id"]].copy()

    result = result.merge(
        product_info[
            ["product_id", "product_category_name_english"]
        ],
        on="product_id",
        how="left"
    )

    last_date = feature_table["date"].max()

    result["forecast_start_date"] = last_date + pd.Timedelta(days=1)
    result["forecast_end_date"] = last_date + pd.Timedelta(days=7)

    result["predicted_next_7_days_sales"] = predictions

    result = result.sort_values(
        "predicted_next_7_days_sales",
        ascending=False
    ).reset_index(drop=True)

    return result


# ==========================================
# FUNCTION 2: GET TOP 5 PREDICTED PRODUCTS
# ==========================================

# Function 2: Get top 5 products based on predicted demand
def get_top_5_products(predictions):

    # Sort products by predicted sales in descending order
    top_5 = (
        predictions
        .sort_values(
            "predicted_next_7_days_sales",
            ascending=False
        )
        .head(5)
        .reset_index(drop=True)
    )

    # Return required columns
    return top_5[
        [
            "product_id",
            "product_category_name_english",
            "predicted_next_7_days_sales"
        ]
    ]
# ==========================================
# FUNCTION 3: GET PREVIOUS 7 WEEKS HISTORY
# ==========================================
# Function 3: Get previous 7 weeks' actual sales


def get_weekly_order_history(daily_sales):

    # Create a copy
    data = daily_sales.copy()

    # Convert date column to datetime
    data["date"] = pd.to_datetime(data["date"])

    # Sort data by date
    data = data.sort_values("date")

    # Get last available date
    last_date = data["date"].max()

    # Calculate total actual quantity sold per day
    daily_sales_history = (
        data.groupby("date")["quantity_sold"]
        .sum()
    )

    # Get previous 7 weeks (Monday to Sunday)
    weekly_sales = (
        daily_sales_history
        .resample("W-SUN")
        .sum()
        .loc[:last_date]
        .tail(7)
    )

    # Convert into DataFrame
    weekly_history = weekly_sales.reset_index()

    # Rename columns
    weekly_history.columns = [
        "week_ending",
        "actual_quantity_sold"
    ]

    # Convert date to string
    weekly_history["week_ending"] = (
        weekly_history["week_ending"].dt.strftime("%Y-%m-%d")
    )

    return weekly_history



    