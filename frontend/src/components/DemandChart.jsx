import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function DemandChart({ data }) {
  return (
    <section className="panel">
      <h2 className="text-[17px] font-semibold">Demand by category</h2>
      <p className="mb-3.5 mt-0.5 text-[13px] text-muted">Units per month, current vs. forecast</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="#E3E8E6" vertical={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Legend iconType="circle" />
          <Bar dataKey="current" name="Current" fill="#B8C4C0" radius={[4, 4, 0, 0]} />
          <Bar dataKey="forecast" name="Forecast" fill="#2F5D8A" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
