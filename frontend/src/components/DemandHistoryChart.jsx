
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import Predictions from "../pages/Predictions";

export default function DemandHistoryChart({ history = [], predictions = [] }) {

  // Calculate total predicted quantity for next 7 days
  console.log(predictions)
  const predictedTotal = predictions.reduce(
    (sum, item) =>
      sum + Number(item.predicted_next_7_days_sales || 0),
    0
  );

  // Previous 7 weeks actual sales

  const chartData = history.map((item, index) => ({
    name: `Week ${index + 1}`,
    quantity: Number(item.actual_quantity_sold || 0),
    type: "Actual"
  }));

  // Last row: Next 7 days predicted sales
  chartData.push({
    name: "Next 7 Days",
    quantity: predictedTotal,
    type: "Predicted"
  });

  console.log("Predictions:", predictions);
  console.log("Predicted Total:", predictedTotal);
  console.log("Final Chart Data:", chartData);

  return (
    <section className="panel">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          Demand Overview
        </h2>

        <p className="text-sm text-muted">
          Previous 7 weeks actual sales vs next 7 days predicted sales
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-5 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-blue-500" />
          Actual Sales
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-purple-500" />
          Predicted Sales
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              opacity={0.12}
            />

           <XAxis
  dataKey="name"
  interval={0}
  minTickGap={0}
  tick={{ fontSize: 11 }}
  axisLine={false}
  tickLine={false}
  height={45}
/>

            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) => [
                Number(value).toLocaleString(),
                "Quantity Sold"
              ]}
            />

            <Bar
              dataKey="quantity"
              name="Quantity"
              radius={[5, 5, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.type === "Predicted"
                      ? "#a855f7"
                      : "#3b82f6"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
