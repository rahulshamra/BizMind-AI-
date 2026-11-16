import { useApi, getStats, getRevenue, getForecast, getSentiment, getDemand } from "../services/api.js";
import StatCard from "../components/StatCard.jsx";
import RevenueChart from "../components/RevenueChart.jsx";
import ForecastCard from "../components/ForecastCard.jsx";
import SentimentChart from "../components/SentimentChart.jsx";
import DemandChart from "../components/DemandChart.jsx";

const loading = (text) => <p className="p-5 text-muted">{text}</p>;

export default function Dashboard() {
  const stats = useApi(getStats);
  const revenue = useApi(getRevenue);
  const forecast = useApi(getForecast);
  const sentiment = useApi(getSentiment);
  const demand = useApi(getDemand);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-5">
        {stats.loading && loading("Loading stats…")}
        {stats.error && <p className="p-5 text-bad">{stats.error}</p>}
        {stats.data?.map((s) => <StatCard key={s.id} {...s} />)}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {revenue.data ? <RevenueChart data={revenue.data} /> : loading("Loading revenue…")}
        {forecast.data ? <ForecastCard data={forecast.data} /> : loading("Loading forecast…")}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {sentiment.data ? <SentimentChart data={sentiment.data} /> : loading("Loading sentiment…")}
        {demand.data ? <DemandChart data={demand.data} /> : loading("Loading demand…")}
      </div>
    </>
  );
}
