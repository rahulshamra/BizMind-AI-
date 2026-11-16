
import { useState } from "react";
import {
  UserRound,
  ShoppingBag,
  Wallet,
  Sparkles,
  LoaderCircle
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function SegmentPredictor() {

  // Only two input fields are required
  const [orders, setOrders] = useState("");
  const [totalSpent, setTotalSpent] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get styling according to predicted risk segment
  const getRiskStyle = (segment) => {

    if (segment === "High Chance to Leave") {
      return {
        color: "text-red-600",
        background: "bg-red-50",
        border: "border-red-200",
        description: "This customer may need immediate retention attention."
      };
    }

    if (segment === "Moderate Chance to Leave") {
      return {
        color: "text-amber-600",
        background: "bg-amber-50",
        border: "border-amber-200",
        description: "Consider engagement activities to improve customer retention."
      };
    }

    return {
      color: "text-green-600",
      background: "bg-green-50",
      border: "border-green-200",
      description: "This customer belongs to the low-risk segment."
    };
  };


  // ==========================================
  // PREDICT CUSTOMER SEGMENT
  // ==========================================

  const handlePredict = async (e) => {

    e.preventDefault();

    setError("");
    setPrediction(null);

    // Validate inputs
    if (orders === "" || totalSpent === "") {
      setError("Please enter both required fields.");
      return;
    }

    if (
      !Number.isInteger(Number(orders)) ||
      Number(orders) < 0 ||
      Number(totalSpent) < 0 ||
      !Number.isFinite(Number(totalSpent))
    ) {
      setError("Enter valid non-negative values.");
      return;
    }

    try {

      setLoading(true);

      // Send the two input features to FastAPI
      const response = await fetch(
        `${API_URL}/customers/predict`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            orders_last_90_days: Number(orders),
            total_spent: Number(totalSpent)
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Customer prediction failed."
        );
      }

      // Save prediction result
      setPrediction(result.prediction);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // CLEAR FORM
  // ==========================================

  const handleReset = () => {

    setOrders("");
    setTotalSpent("");
    setPrediction(null);
    setError("");
  };


  const riskStyle = prediction
    ? getRiskStyle(prediction.risk_segment)
    : null;


  // ==========================================
  // UI
  // ==========================================

  return (

    <section className="panel h-full">

      {/* HEADER */}

      <div className="mb-5 flex items-center gap-3">

        <div className="rounded-lg bg-brand-soft p-3 text-brand">
          <Sparkles size={22} />
        </div>

        <div>
          <h2 className="text-[17px] font-semibold">
            Customer Segment Predictor
          </h2>

          <p className="text-xs text-muted">
            Predict customer risk using KNN
          </p>
        </div>

      </div>


      {/* INPUT FORM */}

      <form onSubmit={handlePredict} className="space-y-4">

        {/* PREVIOUS 90 DAYS ORDERS */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium">

            <ShoppingBag size={16} className="text-muted" />

            Orders in Previous 90 Days

          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={orders}
            onChange={(e) => setOrders(e.target.value)}
            placeholder="Example: 5"
            className="w-full rounded-lg border border-line bg-transparent px-3 py-3 text-sm outline-none focus:border-brand"
            required
          />

          <p className="mt-1 text-xs text-muted">
            Number of orders placed by the customer.
          </p>

        </div>


        {/* TOTAL SPENT */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium">

            <Wallet size={16} className="text-muted" />

            Total Amount Spent

          </label>

          <input
            type="number"
            min="0"
            step="any"
            value={totalSpent}
            onChange={(e) => setTotalSpent(e.target.value)}
            placeholder="Example: 1500"
            className="w-full rounded-lg border border-line bg-transparent px-3 py-3 text-sm outline-none focus:border-brand"
            required
          />

          <p className="mt-1 text-xs text-muted">
            Total customer spending in the dataset's currency (BRL).
          </p>

        </div>


        {/* ERROR */}

        {error && (

          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>

        )}


        {/* BUTTONS */}

        <div className="flex gap-2">

          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >

            {loading ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Predict Segment
              </>
            )}

          </button>


          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer rounded-lg border border-line px-4 py-3 text-sm"
          >
            Reset
          </button>

        </div>

      </form>


      {/* PREDICTION RESULT */}

      {prediction && (

        <div className="mt-6 border-t border-line pt-5">

          <div className="mb-4 flex items-center gap-2">

            <UserRound size={19} className="text-brand" />

            <h3 className="font-semibold">
              Prediction Result
            </h3>

          </div>


          <div className={`rounded-xl border p-4 ${riskStyle.background} ${riskStyle.border}`}>

            <p className="text-xs font-medium text-muted">
              PREDICTED CUSTOMER SEGMENT
            </p>

            <h3 className={`mt-2 text-xl font-bold ${riskStyle.color}`}>
              {prediction.risk_segment}
            </h3>

            <p className="mt-2 text-sm text-muted">
              {riskStyle.description}
            </p>

          </div>


          {/* INPUT SUMMARY */}

          <div className="mt-4 grid grid-cols-2 gap-3">

            <div className="rounded-lg bg-bg p-3">

              <p className="text-xs text-muted">
                Previous 90 Days Orders
              </p>

              <p className="mt-1 text-lg font-bold">
                {prediction.orders_last_90_days}
              </p>

            </div>


            <div className="rounded-lg bg-bg p-3">

              <p className="text-xs text-muted">
                Total Amount Spent
              </p>

              <p className="mt-1 text-lg font-bold">
                R$ {Number(prediction.total_spent).toLocaleString("pt-BR")}
              </p>

            </div>

          </div>


          <div className="mt-3 rounded-lg border border-line p-3">

            <p className="text-xs text-muted">
              Predicted Cluster
            </p>

            <p className="mt-1 font-semibold">
              Cluster {prediction.predicted_cluster}
            </p>

          </div>

        </div>

      )}


      {!prediction && !loading && (

        <div className="mt-5 rounded-lg border border-dashed border-line p-4 text-center">

          <Sparkles size={22} className="mx-auto mb-2 text-muted" />

          <p className="text-sm text-muted">
            Enter customer details to see the predicted risk segment.
          </p>

        </div>

      )}

    </section>
  );
}
