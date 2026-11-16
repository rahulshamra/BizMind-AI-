
from fastapi import APIRouter, Request, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field

# Import existing ML functions without changing their logic
from app.ml.customer_segmentation import (
    predict_single_customer,
    predict_all_customers
    )

# Create API router
router = APIRouter(
    prefix="/api/customers",
    tags=["Customer Segmentation"]
)


# ==========================================
# REQUEST MODEL
# ==========================================

class CustomerInput(BaseModel):

    orders_last_90_days: int = Field(ge=0)
    total_spent: float = Field(ge=0)


# ==========================================
# HELPER: GET ALL CUSTOMER PREDICTIONS
# ==========================================

def get_customer_predictions(request: Request):

    models = request.app.state.models
    model_bundle = models["customer_segmentation"]

    return predict_all_customers(model_bundle)


# ==========================================
# API 1: SINGLE CUSTOMER PREDICTION
# ==========================================

@router.post("/predict")
def predict_customer(
    customer: CustomerInput,
    request: Request
):

    try:

        models = request.app.state.models
        model_bundle = models["customer_segmentation"]
        print(customer.total_spent)

        result = predict_single_customer(
            model_bundle=model_bundle,
            orders_last_90_days=customer.orders_last_90_days,
            total_spent=customer.total_spent
        )

        return {
            "success": True,
            "prediction": result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Customer prediction failed: {str(e)}"
        )


# ==========================================
# API 2: PREDICT ALL CUSTOMERS
# ==========================================

@router.get("/segments")
def get_all_customer_segments(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):

    try:

        # Get predictions for all customers
        predictions = get_customer_predictions(request)

        total_customers = len(predictions)

        # Apply pagination
        paginated_data = predictions.iloc[
            skip:skip + limit
        ]

        customers = jsonable_encoder(
            paginated_data.to_dict(orient="records")
        )

        return {
            "success": True,
            "total_customers": total_customers,
            "skip": skip,
            "limit": limit,
            "returned_customers": len(customers),
            "customers": customers
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Customer segmentation failed: {str(e)}"
        )


# ==========================================
# API 3: CUSTOMER SEGMENT SUMMARY
# ==========================================

@router.get("/segments/summary")
def get_customer_segment_summary(request: Request):

    try:

        predictions = get_customer_predictions(request)

        # Count customers in each risk segment
        segment_counts = (
            predictions["risk_segment"]
            .value_counts()
            .reindex([
                "High Chance to Leave",
                "Moderate Chance to Leave",
                "Low Chance to Leave"
            ], fill_value=0)
        )

        total_customers = len(predictions)

        summary = []

        for segment, count in segment_counts.items():

            percentage = (
                (count / total_customers) * 100
                if total_customers > 0 else 0
            )

            summary.append({
                "risk_segment": segment,
                "customer_count": int(count),
                "percentage": round(percentage, 2)
            })

        return {
            "success": True,
            "total_customers": total_customers,
            "summary": summary
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Customer summary failed: {str(e)}"
        )


# ==========================================
# API 4: CUSTOMER SEGMENT GRAPH DATA
# ==========================================

@router.get("/segments/graph")
def get_customer_segment_graph(request: Request):

    try:

        predictions = get_customer_predictions(request)

        # Generate graph data using the same segment order
        segment_counts = (
            predictions["risk_segment"]
            .value_counts()
            .reindex([
                "High Chance to Leave",
                "Moderate Chance to Leave",
                "Low Chance to Leave"
            ], fill_value=0)
        )

        return {
            "success": True,
            "graph": {
                "labels": segment_counts.index.tolist(),
                "values": [
                    int(value)
                    for value in segment_counts.values
                ]
            }
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Customer graph data failed: {str(e)}"
        )
