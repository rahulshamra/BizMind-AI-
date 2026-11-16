
import pandas as pd
import matplotlib.pyplot as plt


# ==========================================c
# FUNCTION 1: SINGLE CUSTOMER PREDICTION
# ==========================================

def predict_single_customer(model_bundle, orders_last_90_days, total_spent):

    model = model_bundle["knn_model"]
    mapping = model_bundle["risk_mapping"]

    input_data = pd.DataFrame([{
        "orders_last_90_days": orders_last_90_days,
        "total_spent": total_spent
    }])

    cluster = int(model.predict(input_data)[0])

    return {
        "orders_last_90_days": orders_last_90_days,
        "total_spent": total_spent,
        "predicted_cluster": cluster,
        "risk_segment": mapping[cluster]
    }


# ==========================================
# FUNCTION 2: PREDICT ALL TRAINING CUSTOMERS
# ==========================================

def predict_all_customers(model_bundle):

    model = model_bundle["knn_model"]
    mapping = model_bundle["risk_mapping"]
    data = model_bundle["customer_features"].copy()
    features = model_bundle["features"]

    result = data[[
        "customer_unique_id",
        "orders_last_90_days",
        "total_spent"
    ]].copy()

    result["predicted_cluster"] = model.predict(
        result[features]
    )

    result["risk_segment"] = result[
        "predicted_cluster"
    ].map(mapping)

    return result


# ==========================================
# FUNCTION 3: CUSTOMER SEGMENT GRAPH
# ==========================================

def plot_customer_segments(predictions):

    segment_counts = predictions[
        "risk_segment"
    ].value_counts().reindex([
        "High Chance to Leave",
        "Moderate Chance to Leave",
        "Low Chance to Leave"
    ], fill_value=0)

    plt.figure(figsize=(9, 5))

    bars = plt.bar(
        segment_counts.index,
        segment_counts.values
    )

    for bar in bars:
        height = bar.get_height()

        plt.text(
            bar.get_x() + bar.get_width() / 2,
            height,
            str(int(height)),
            ha="center",
            va="bottom"
        )

    plt.xlabel("Customer Risk Segment")
    plt.ylabel("Number of Customers")
    plt.title("Customer Segmentation Using KNN")
    plt.xticks(rotation=15)

    plt.tight_layout()
    plt.show()

    return segment_counts
