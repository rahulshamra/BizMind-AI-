
export default function TopDemandProducts({ products = [] }) {
  return (
    <section className="panel">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Top 5 Products</h2>
        <p className="text-sm text-muted">
          Products with the highest predicted demand
        </p>
      </div>

      <div className="space-y-3">
        {products.slice(0, 5).map((product, index) => (
          <div
            key={product.product_id}
            className="flex items-center justify-between gap-3 rounded-lg border border-line p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 font-semibold text-blue-500">
                {index + 1}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {product.product_category_name_english || "Unknown Category"}
                </p>
                <p className="truncate text-xs text-muted">
                  ID: {product.product_id}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-bold">
                {Number(
                  product.predicted_next_7_days_sales
                ).toLocaleString()}
              </p>
              <p className="text-xs text-muted">Predicted units</p>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-sm text-muted">No top products available.</p>
        )}
      </div>
    </section>
  );
}
