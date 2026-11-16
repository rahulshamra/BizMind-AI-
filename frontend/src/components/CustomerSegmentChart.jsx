import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// project theme colors: bad / warn / brand
const colorFor = (label = "") =>
  label.startsWith("High") ? "#B4412F" : label.startsWith("Moderate") ? "#C77D0A" : "#0E6B5C";

const shortLabel = (label = "") => `${label.split(" ")[0]} risk`;
const fmt = (n) => Number(n).toLocaleString();

export default function CustomerSegmentChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;

    const fetchGraphData = async () => {
      try {
        const response = await fetch(`${API_URL}/customers/segments/graph`);
        if (!response.ok) throw new Error("Failed to fetch customer graph");

        const { graph } = await response.json();
        const total = graph.values.reduce((a, b) => a + b, 0);

        // convert API response into Recharts format
        const rows = graph.labels.map((label, i) => ({
          name: label,
          short: shortLabel(label),
          customers: graph.values[i],
          pct: total ? Math.round((graph.values[i] / total) * 1000) / 10 : 0,
          color: colorFor(label),
        }));

        if (live) setChartData(rows);
      } catch (err) {
        if (live) setError(err.message);
      } finally {
        if (live) setLoading(false);
      }
    };

    fetchGraphData();
    return () => {
      live = false;
    };
  }, []);

  if (loading) return <p className="panel text-muted">Loading customer segments…</p>;
  if (error) return <p className="panel text-bad">{error}</p>;

  const total = chartData.reduce((sum, d) => sum + d.customers, 0);

  return (
    <section className="panel">
      <h2 className="text-[17px] font-semibold">Customer risk segmentation</h2>
      <p className="mb-3.5 mt-0.5 text-[13px] text-muted">
        {fmt(total)} customers grouped by chance to leave
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 22, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#E3E8E6" vertical={false} />
          <XAxis dataKey="short" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickFormatter={fmt} tickLine={false} axisLine={false} fontSize={12} width={56} />
          <Tooltip
            cursor={{ fill: "rgba(22,33,43,0.04)" }}
            labelFormatter={(_label, payload) => payload?.[0]?.payload.name}
            formatter={(value, _name, item) => [`${fmt(value)} (${item.payload.pct}%)`, "Customers"]}
          />
          <Bar dataKey="customers" name="Customers" radius={[6, 6, 0, 0]} maxBarSize={120}>
            {chartData.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
            <LabelList dataKey="customers" position="top" formatter={fmt} fontSize={12} fill="#16212B" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-[13px]">
        {chartData.map((d) => (
          <span key={d.name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-muted">{d.name}</span>
            <strong>{d.pct}%</strong>
          </span>
        ))}
      </div>
    </section>
  );
}