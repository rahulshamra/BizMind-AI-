import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function SentimentChart({ data }) {
  const { totals, weekly } = data;
  return (
    <section className="panel">
      <h2 className="text-[17px] font-semibold">Customer sentiment</h2>
      <p className="mb-3.5 mt-0.5 text-[13px] text-muted">
        {totals.positive}% positive, {totals.neutral}% neutral, {totals.negative}% negative
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={weekly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#E3E8E6" vertical={false} />
          <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis unit="%" tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend iconType="circle" />
          <Bar dataKey="positive" name="Positive" stackId="s" fill="#0E6B5C" />
          <Bar dataKey="neutral" name="Neutral" stackId="s" fill="#B8C4C0" />
          <Bar dataKey="negative" name="Negative" stackId="s" fill="#B4412F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
