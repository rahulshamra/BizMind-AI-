
from fastapi import APIRouter, Request, HTTPException
from fastapi.encoders import jsonable_encoder

from app.ml.demand_forecasting import (
    predict_next_7_days,
    get_top_5_products,
    get_weekly_order_history
)


router = APIRouter(
    prefix="/api/demand",
    tags=["Demand Forecasting"]
)


# ==========================================
# HELPER FUNCTION: GET ALL PREDICTIONS
# ==========================================

def get_demand_predictions(request: Request):

    try:
        # Get loaded demand forecasting bundle
        bundle = request.app.state.models["demand_forecasting"]

        # Extract model components
        model = bundle["model"]
        feature_table = bundle["feature_table"]
        product_info = bundle["product_info"]
        features = bundle["features"]

        # Generate predictions
        predictions = predict_next_7_days(
            model,
            feature_table,
            product_info,
            features
        )

        return predictions

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Demand prediction error: {str(e)}"
        )


# ==========================================
# API 1: ALL PRODUCT-WISE PREDICTIONS
# ==========================================

# ==========================================
# API 1: TOP 100 PRODUCT-WISE PREDICTIONS
# ==========================================

@router.get("/predictions")
def get_all_demand_predictions(request: Request):

    predictions = get_demand_predictions(request)

    # Sort by predicted sales and select top 100
    top_100 = (
        predictions
        .sort_values(
            "predicted_next_7_days_sales",
            ascending=False
        )
        .head(100)
        .reset_index(drop=True)
    )

    return jsonable_encoder({
        "success": True,
        "total_products": len(predictions),
        "returned_products": len(top_100),
        "predictions": top_100.to_dict(orient="records")
    })

# ==========================================
# API 2: TOP 5 PRODUCTS
# ==========================================

@router.get("/top-products")
def get_top_products(request: Request):

    predictions = get_demand_predictions(request)

    top_5 = get_top_5_products(predictions)

    return jsonable_encoder({
        "success": True,
        "top_products": top_5.to_dict(orient="records")
    })


# ==========================================
# API 3: PREVIOUS 7 WEEKS HISTORY
# ==========================================

@router.get("/weekly-history")
def get_weekly_history(request: Request):

    try:
        bundle = request.app.state.models["demand_forecasting"]

        daily_sales = bundle["daily_sales"]

        weekly_history = get_weekly_order_history(
            daily_sales
        )

        return jsonable_encoder({
            "success": True,
            "weekly_history": weekly_history.to_dict(orient="records")
        })

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Weekly history error: {str(e)}"
        )

# ==========================================
# API 4: DEMAND SUMMARY
# ==========================================

@router.get("/summary")
def get_demand_summary(request: Request):

    predictions = get_demand_predictions(request)

    total_predicted_sales = int(
        predictions["predicted_next_7_days_sales"].sum()
    )

    return {
        "success": True,
        "total_products": len(predictions),
        "total_predicted_sales": total_predicted_sales,
        "forecast_period": "Next 7 Days"
    }
