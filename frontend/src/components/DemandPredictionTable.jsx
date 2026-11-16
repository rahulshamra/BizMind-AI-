
export default function DemandPredictionTable({ predictions = [] }) {

  // Download predictions as CSV
  const downloadCSV = () => {
    const headers = [
      "Product ID",
      "Category",
      "Predicted Next 7 Days Sales"
    ];

    const rows = predictions.map((item) => [
      item.product_id,
      item.product_category_name_english || "Unknown",
      item.predicted_next_7_days_sales
    ]);

    const csvContent = [
      headers,
      ...rows
    ]
      .map((row) =>
        row.map((value) =>
          `"${String(value ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "top_100_demand_predictions.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Product-wise Demand Predictions
          </h2>
          <p className="text-sm text-muted">
            Top 100 products for the next 7 days
          </p>
        </div>

        <button
          onClick={downloadCSV}
          disabled={predictions.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="px-3 py-3">Rank</th>
              <th className="px-3 py-3">Product ID</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3 text-right">
                Predicted Quantity
              </th>
            </tr>
          </thead>

          <tbody>
            {predictions.map((item, index) => (
              <tr
                key={item.product_id}
                className="border-b border-line last:border-0 hover:bg-white/5"
              >
                <td className="px-3 py-3">{index + 1}</td>

                <td className="px-3 py-3 font-medium">
                  {item.product_id}
                </td>

                <td className="px-3 py-3">
                  {item.product_category_name_english || "Unknown"}
                </td>

                <td className="px-3 py-3 text-right font-semibold">
                  {Number(
                    item.predicted_next_7_days_sales
                  ).toLocaleString()}
                </td>
              </tr>
            ))}

            {predictions.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-muted">
                  No prediction records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
