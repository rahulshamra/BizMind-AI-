import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const k = (v) => `$${v / 1000}k`;

export default function RevenueChart({ data }) {
  return (
    <section className="panel">
      <h2 className="text-[17px] font-semibold">Revenue vs. target</h2>
      <p className="mb-3.5 mt-0.5 text-[13px] text-muted">Monthly, this year</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="#E3E8E6" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickFormatter={k} tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
          <Legend iconType="circle" />
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0E6B5C" fill="#0E6B5C" fillOpacity={0.14} strokeWidth={2.5} />
          <Line type="monotone" dataKey="target" name="Target" stroke="#C77D0A" strokeDasharray="5 5" dot={false} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
}
