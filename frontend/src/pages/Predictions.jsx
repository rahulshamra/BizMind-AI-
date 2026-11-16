
import { useState, useEffect } from "react";
import { useApi, getForecast } from "../services/api.js";

import ForecastCard from "../components/ForecastCard.jsx";

import DemandSummary from "../components/DemandSummary.jsx";
import TopDemandProducts from "../components/TopDemandProducts.jsx";
import DemandHistoryChart from "../components/DemandHistoryChart.jsx";
import DemandPredictionTable from "../components/DemandPredictionTable.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Predictions() {

  const [selectedPrediction, setSelectedPrediction] = useState("orders");

  // Existing revenue prediction
  const forecast = useApi(getForecast);

  // Order prediction states
  const [predictions, setPredictions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [summary, setSummary] = useState({});

  const [demandLoading, setDemandLoading] = useState(true);
  const [demandError, setDemandError] = useState("");

  // ==========================================
  // FETCH ALL FOUR DEMAND APIs
  // ==========================================

  useEffect(() => {

    const fetchDemandData = async () => {

      try {

        setDemandLoading(true);
        setDemandError("");

        // Call all four APIs simultaneously
        const [
          predictionsResponse,
          topProductsResponse,
          weeklyHistoryResponse,
          summaryResponse
        ] = await Promise.all([
          fetch(`${API_URL}/demand/predictions`),
          fetch(`${API_URL}/demand/top-products`),
          fetch(`${API_URL}/demand/weekly-history`),
          fetch(`${API_URL}/demand/summary`)
        ]);

        // Check API responses
        if (
          !predictionsResponse.ok ||
          !topProductsResponse.ok ||
          !weeklyHistoryResponse.ok ||
          !summaryResponse.ok
        ) {
          throw new Error("Failed to fetch demand prediction data.");
        }

        // Convert responses to JSON
        const [
          predictionsData,
          topProductsData,
          weeklyHistoryData,
          summaryData
        ] = await Promise.all([
          predictionsResponse.json(),
          topProductsResponse.json(),
          weeklyHistoryResponse.json(),
          summaryResponse.json()
        ]);

        // Store data in states
        setPredictions(predictionsData.predictions || []);

        setTopProducts(topProductsData.top_products || []);

        setWeeklyHistory(weeklyHistoryData.weekly_history || []);

        setSummary({
          ...summaryData,
          returned_products: predictionsData.returned_products
        });

      } catch (error) {

        console.error("Demand API Error:", error);

        setDemandError(error.message);

      } finally {

        setDemandLoading(false);

      }
    };

    fetchDemandData();

  }, []);

  return (
    <div className="space-y-5">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Predictions</h1>
        <p className="mt-1 text-sm text-muted">
          Predict future product demand and business revenue.
        </p>
      </div>

      {/* PREDICTION DROPDOWN */}
      <section className="panel">
        <label className="mb-2 block text-sm font-semibold">
          Select Prediction
        </label>

        <select
          value={selectedPrediction}
          onChange={(e) => setSelectedPrediction(e.target.value)}
          className="w-full rounded-lg border border-line bg-transparent px-4 py-3 text-sm outline-none md:w-80"
        >
          <option value="orders">Order Prediction (Next 7 Days)</option>
          <option value="revenue">Revenue Prediction (Next 30 Days)</option>
        </select>
      </section>

      {/* ========================================== */}
      {/* ORDER PREDICTION */}
      {/* ========================================== */}

      {selectedPrediction === "orders" && (
        <section className="space-y-5">

          <div>
            <h2 className="text-lg font-semibold">Order Prediction</h2>
            <p className="text-sm text-muted">
              Forecast product demand for the next 7 days.
            </p>
          </div>

          {demandLoading ? (

            <p className="text-muted">
              Loading order predictions...
            </p>

          ) : demandError ? (

            <p className="text-red-500">
              {demandError}
            </p>

          ) : (

            <>

              {/* SUMMARY CARDS */}
              {/* <DemandSummary data={summary} /> */}

              {/* CHART AND TOP 5 PRODUCTS */}
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
<DemandHistoryChart
  history={weeklyHistory}
  predictions={predictions}
/>

                <TopDemandProducts
                  products={topProducts}
                />

              </div>

              {/* TOP 100 PRODUCTS */}
              <DemandPredictionTable
                predictions={predictions}
              />

            </>

          )}

        </section>
      )}

      {/* ========================================== */}
      {/* REVENUE PREDICTION */}
      {/* ========================================== */}

      {selectedPrediction === "revenue" && (
        <section className="space-y-5">

          <div>
            <h2 className="text-lg font-semibold">Revenue Prediction</h2>
            <p className="text-sm text-muted">
              Forecast total business revenue for the next 30 days.
            </p>
          </div>

          {forecast.loading ? (

            <p className="text-muted">
              Loading revenue predictions...
            </p>

          ) : forecast.error ? (

            <p className="text-red-500">
              Failed to load revenue predictions.
            </p>

          ) : forecast.data ? (

            <ForecastCard data={forecast.data} />

          ) : (

            <p className="text-muted">
              No revenue prediction data available.
            </p>

          )}

        </section>
      )}

    </div>
  );
}
