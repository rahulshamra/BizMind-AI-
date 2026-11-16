const styles = {
  low: "bg-brand-soft text-brand",
  mid: "bg-[#FBEBCB] text-[#8A5400]",
  high: "bg-[#F6DAD4] text-bad",
};

export default function RiskBadge({ level, children }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${styles[level]}`}>{children}</span>;
}
