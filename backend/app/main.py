from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ml.model_loader import load_models
from app.api.routes.customer_routes import router as customer_router
from app.api.routes.demand_routes import router as demand_router

# Load ML models when the application starts
@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Loading BizMind AI models...")

    app.state.models = load_models()

    print("All models loaded successfully!")

    yield

    app.state.models.clear()

    print("BizMind AI backend stopped.")


# Create FastAPI application
app = FastAPI(
    title="BizMind AI API",
    description="Business Intelligence and ML Prediction API",
    version="1.0.0",
    lifespan=lifespan
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(customer_router)
app.include_router(demand_router)

# Home route
@app.get("/")
def home():

    return {
        "message": "Welcome to BizMind AI Backend",
        "status": "running"
    }


# Health check route
@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "application": "BizMind AI",
        "loaded_models": list(app.state.models.keys())
    }