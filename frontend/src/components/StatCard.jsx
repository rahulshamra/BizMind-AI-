import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ label, value, change, hint, invert = false }) {
  const up = change >= 0;
  const good = invert ? !up : up;
  return (
    <div className="panel">
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mb-1.5 mt-1 text-3xl font-bold tracking-tight">{value}</p>
      <p className={`flex items-center gap-1 text-[13px] font-semibold ${good ? "text-brand" : "text-bad"}`}>
        {up ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
        {Math.abs(change)}% <span className="font-normal text-muted">{hint}</span>
      </p>
    </div>
  );
}
