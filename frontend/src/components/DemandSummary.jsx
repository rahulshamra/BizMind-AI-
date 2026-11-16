
export default function DemandSummary({ data }) {
  const cards = [
    {
      title: "Total Products",
      value: data?.total_products ?? 0,
      subtitle: "Products in the forecast"
    },
    {
      title: "Predicted Quantity",
      value: Number(data?.total_predicted_sales ?? 0).toLocaleString(),
      subtitle: "Expected sales in next 7 days"
    },
    {
      title: "Products Displayed",
      value: data?.returned_products ?? 0,
      subtitle: "Top 100 predictions"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="panel">
          <p className="text-sm text-muted">{card.title}</p>
          <h3 className="mt-2 text-2xl font-bold">
            {card.value}
          </h3>
          <p className="mt-1 text-xs text-muted">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
