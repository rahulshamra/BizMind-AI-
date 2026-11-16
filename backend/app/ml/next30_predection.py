# %%writefile next30_prediction.py

# Import required libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


# Function 1: Create features for next 30-day prediction
def create_next_day_features(daily_revenue, feature_columns):

    # Copy and sort historical revenue data
    revenue_data = daily_revenue.copy()
    revenue_data["date"] = pd.to_datetime(revenue_data["date"])
    revenue_data = revenue_data.sort_values("date").reset_index(drop=True)

    # Extract historical revenue
    revenue = revenue_data["total_revenue"].astype(float)

    # Check sufficient historical data
    if len(revenue) < 180:
        raise ValueError("At least 180 days of data are required.")

    # Calculate previous 30-day revenue
    previous_30 = revenue.iloc[-30:].sum()

    # Calculate lag features
    feature_values = {
        "previous_30_days_revenue": previous_30,
        "lag_1": revenue.iloc[-1],
        "lag_7": revenue.iloc[-7],
        "lag_14": revenue.iloc[-14],
        "lag_28": revenue.iloc[-28]
    }

    # Calculate rolling mean features
    feature_values.update({
        "rolling_mean_7": revenue.iloc[-7:].mean(),
        "rolling_mean_30": revenue.iloc[-30:].mean(),
        "rolling_mean_60": revenue.iloc[-60:].mean(),
        "rolling_mean_90": revenue.iloc[-90:].mean()
    })

    # Calculate rolling standard deviation features
    feature_values.update({
        "rolling_std_7": revenue.iloc[-7:].std(),
        "rolling_std_30": revenue.iloc[-30:].std(),
        "rolling_std_60": revenue.iloc[-60:].std()
    })

    # Calculate 7-day revenue growth
    previous_7 = revenue.iloc[-7:].sum()
    before_7 = revenue.iloc[-14:-7].sum()

    growth_7 = (
        (previous_7 - before_7) / before_7
        if before_7 != 0 else 0
    )

    # Calculate 30-day revenue growth
    before_30 = revenue.iloc[-60:-30].sum()

    growth_30 = (
        (previous_30 - before_30) / before_30
        if before_30 != 0 else 0
    )

    # Calculate 90-day revenue growth
    previous_90 = revenue.iloc[-90:].sum()
    before_90 = revenue.iloc[-180:-90].sum()

    growth_90 = (
        (previous_90 - before_90) / before_90
        if before_90 != 0 else 0
    )

    # Add revenue growth features
    feature_values.update({
        "revenue_growth_7d": growth_7,
        "revenue_growth_30d": growth_30,
        "revenue_growth_90d": growth_90
    })

    # Arrange features in training order
    next_features = pd.DataFrame([{
        feature: feature_values[feature]
        for feature in feature_columns
    }])

    # Return features and last historical date
    last_date = revenue_data["date"].iloc[-1]

    return next_features, last_date



import numpy as np
import pandas as pd


def create_next_day_features(daily_revenue, feature_columns):

    # Make a copy and sort historical revenue by date
    daily_revenue = daily_revenue.copy()
    daily_revenue["date"] = pd.to_datetime(daily_revenue["date"])
    daily_revenue = daily_revenue.sort_values("date").reset_index(drop=True)

    # Check that every calendar date is present
    if daily_revenue["date"].duplicated().any():
        raise ValueError("Duplicate dates found in daily_revenue.")

    expected_dates = pd.date_range(
        start=daily_revenue["date"].min(),
        end=daily_revenue["date"].max(),
        freq="D"
    )

    if not daily_revenue["date"].reset_index(drop=True).equals(
        pd.Series(expected_dates)
    ):
        raise ValueError("Daily revenue must contain one row for every calendar day.")

    # Extract historical revenue
    revenue = daily_revenue["total_revenue"].astype(float).reset_index(drop=True)

    # 180 days are required for the 90-day growth feature
    if len(revenue) < 180:
        raise ValueError("At least 180 days of historical data are required.")

    # Calculate features using only historical data
    features = {
        "previous_30_days_revenue": revenue.iloc[-30:].sum(),

        "lag_1": revenue.iloc[-1],
        "lag_7": revenue.iloc[-7],
        "lag_14": revenue.iloc[-14],
        "lag_28": revenue.iloc[-28],

        "rolling_mean_7": revenue.iloc[-7:].mean(),
        "rolling_mean_30": revenue.iloc[-30:].mean(),
        "rolling_mean_60": revenue.iloc[-60:].mean(),
        "rolling_mean_90": revenue.iloc[-90:].mean(),

        "rolling_std_7": revenue.iloc[-7:].std(),
        "rolling_std_30": revenue.iloc[-30:].std(),
        "rolling_std_60": revenue.iloc[-60:].std(),

        "revenue_growth_7d": (
            (revenue.iloc[-7:].sum() - revenue.iloc[-14:-7].sum())
            / revenue.iloc[-14:-7].sum()
            if revenue.iloc[-14:-7].sum() != 0 else 0
        ),

        "revenue_growth_30d": (
            (revenue.iloc[-30:].sum() - revenue.iloc[-60:-30].sum())
            / revenue.iloc[-60:-30].sum()
            if revenue.iloc[-60:-30].sum() != 0 else 0
        ),

        "revenue_growth_90d": (
            (revenue.iloc[-90:].sum() - revenue.iloc[-180:-90].sum())
            / revenue.iloc[-180:-90].sum()
            if revenue.iloc[-180:-90].sum() != 0 else 0
        )
    }

    # Arrange features in the exact order used during model training
    missing_features = [
        col for col in feature_columns if col not in features
    ]

    if missing_features:
        raise ValueError(f"Missing model features: {missing_features}")

    feature_df = pd.DataFrame(
        [[features[col] for col in feature_columns]],
        columns=feature_columns
    )

    # Return features and the last historical date
    last_date = daily_revenue["date"].iloc[-1]

    return feature_df, last_date


def predict_next_30_days(model_bundle):

    # Extract trained model and historical data from bundle
    model = model_bundle["model"]
    feature_columns = model_bundle["features"]
    daily_revenue = model_bundle["daily_revenue"].copy()

    # Generate features for the next 30-day forecast
    next_features, last_date = create_next_day_features(
        daily_revenue,
        feature_columns
    )

    # Predict total revenue for the next 30 days
    prediction = model.predict(next_features)[0]

    # Revenue cannot be negative
    predicted_revenue = max(0.0, float(prediction))

    # Calculate forecast period
    forecast_start = last_date + pd.Timedelta(days=1)
    forecast_end = last_date + pd.Timedelta(days=30)

    # Display forecast information
    print("========== NEXT 30 DAYS REVENUE FORECAST ==========")
    print("Last Historical Date:", last_date.date())
    print("Forecast Start Date:", forecast_start.date())
    print("Forecast End Date:", forecast_end.date())
    print("Predicted 30 Days Revenue:", round(predicted_revenue, 2))

    # Return one numeric prediction
    return predicted_revenue


# Function 4: Plot actual vs predicted revenue bar graph
def plot_actual_vs_predicted_bar(model_bundle):

    # Extract historical test comparison
    comparison = model_bundle["test_comparison"].copy()

    # Convert dates and sort chronologically
    comparison["date"] = pd.to_datetime(comparison["date"])
    comparison = comparison.sort_values("date").reset_index(drop=True)

    # Create bar positions
    x = np.arange(len(comparison))
    bar_width = 0.4

    # Create bar graph
    plt.figure(figsize=(20, 8))

    # Plot actual revenue bars
    plt.bar(
        x - bar_width / 2,
        comparison["actual_revenue"],
        bar_width,
        label="Actual Revenue"
    )

    # Plot predicted revenue bars
    plt.bar(
        x + bar_width / 2,
        comparison["predicted_revenue"],
        bar_width,
        label="XGBoost Predicted Revenue"
    )

    # Add graph details
    plt.title("Actual vs Predicted Revenue - XGBoost")
    plt.xlabel("Test Dates")
    plt.ylabel("Next 30 Days Revenue")

    # Display test dates
    plt.xticks(
        x,
        comparison["date"].dt.strftime("%Y-%m-%d"),
        rotation=90
    )

    # Display normal numbers on Y-axis
    plt.ticklabel_format(axis="y", style="plain")

    plt.legend()
    plt.grid(axis="y", alpha=0.3)
    plt.tight_layout()

    # Display graph
    plt.show()