import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const k = (v) => `$${v / 1000}k`;

export default function ForecastCard({ data }) {
  const { summary, series } = data;
  return (
    <section className="panel">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold">Revenue forecast</h2>
          <p className="mb-3.5 mt-0.5 text-[13px] text-muted">Next 4 months with confidence range</p>
        </div>
        <div className="flex flex-col text-right">
          <strong className="text-2xl">{summary.nextQuarter}</strong>
          <span className="text-[13px] font-semibold text-brand">+{summary.growth}% · {summary.confidence}% confidence</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={series} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="#E3E8E6" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickFormatter={k} tickLine={false} axisLine={false} fontSize={12} domain={["auto", "auto"]} />
          <Tooltip formatter={(v) => (Array.isArray(v) ? `$${v[0].toLocaleString()} – $${v[1].toLocaleString()}` : `$${v.toLocaleString()}`)} />
          <Legend iconType="circle" />
          <Area dataKey="range" name="Range" stroke="none" fill="#2F5D8A" fillOpacity={0.15} />
          <Line type="monotone" dataKey="actual" name="Actual" stroke="#0E6B5C" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#2F5D8A" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-2.5 text-[13px] text-muted">{summary.note}</p>
    </section>
  );
}
