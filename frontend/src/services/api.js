import { useEffect, useState } from "react";
import * as mock from "../data/mockData.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Fake responses, used only while VITE_USE_MOCK=true
const mockRoutes = {
  "/stats": () => mock.stats,
  "/revenue": () => mock.revenue,
  "/customers": () => mock.customers,
  "/forecast": () => mock.forecast,
  "/sentiment": () => mock.sentiment,
  "/demand": () => mock.demand,
  "/chat": (body) => ({ reply: mock.fakeChatReply(body.message) }),
};

async function request(path, options = {}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 350));
    const handler = mockRoutes[path];
    if (!handler) throw new Error(`No mock data for ${path}`);
    return handler(options.body ? JSON.parse(options.body) : {});
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(10000),
    ...options,
  });
  if (!res.ok) throw new Error(`Request to ${path} failed (${res.status})`);
  return res.json();
}

export const getStats = () => request("/stats");
export const getRevenue = () => request("/revenue");
export const getCustomers = () => request("/customers");
export const getForecast = () => request("/forecast");
export const getSentiment = () => request("/sentiment");
export const getDemand = () => request("/demand");
export const sendChat = (message) => request("/chat", { method: "POST", body: JSON.stringify({ message }) });

// Small hook: const { data, loading, error } = useApi(getStats)
export function useApi(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let live = true;
    fetcher()
      .then((data) => live && setState({ data, loading: false, error: null }))
      .catch((e) => live && setState({ data: null, loading: false, error: e.message }));
    return () => {
      live = false;
    };
  }, [fetcher]);
  return state;
}
