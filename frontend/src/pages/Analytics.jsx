import { useApi, getRevenue, getSentiment, getDemand } from "../services/api.js";
import RevenueChart from "../components/RevenueChart.jsx";
import SentimentChart from "../components/SentimentChart.jsx";
import DemandChart from "../components/DemandChart.jsx";
import RiskBadge from "../components/RiskBadge.jsx";

const th = "border-b border-line px-3 py-2.5 text-left text-[13px] font-semibold text-muted";
const td = "border-b border-line px-3 py-3";

export default function Analytics() {
  const revenue = useApi(getRevenue);
  const sentiment = useApi(getSentiment);
  const demand = useApi(getDemand);

  return (
    <>
      {revenue.data ? <RevenueChart data={revenue.data} /> : <p className="p-5 text-muted">Loading revenue…</p>}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {sentiment.data ? <SentimentChart data={sentiment.data} /> : <p className="p-5 text-muted">Loading sentiment…</p>}
        {demand.data ? <DemandChart data={demand.data} /> : <p className="p-5 text-muted">Loading demand…</p>}
      </div>
      {sentiment.data && (
        <section className="panel">
          <h2 className="text-[17px] font-semibold">What customers talk about</h2>
          <p className="mb-3.5 mt-0.5 text-[13px] text-muted">Mentions and average sentiment score (−1 to +1)</p>
          <table className="w-full border-collapse">
            <thead><tr><th className={th}>Topic</th><th className={th}>Mentions</th><th className={th}>Score</th></tr></thead>
            <tbody>
              {sentiment.data.topics.map((t) => (
                <tr key={t.topic}>
                  <td className={td}>{t.topic}</td>
                  <td className={td}>{t.mentions}</td>
                  <td className={td}>
                    <RiskBadge level={t.score < 0 ? "high" : t.score < 0.5 ? "mid" : "low"}>{t.score > 0 ? "+" : ""}{t.score}</RiskBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}
