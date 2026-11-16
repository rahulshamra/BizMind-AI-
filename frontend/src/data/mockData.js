// Fake data used while there is no backend. Toggle with VITE_USE_MOCK in .env

export const stats = [
  { id: "revenue", label: "Revenue (Dec)", value: "$94,200", change: 8.9, hint: "vs. Nov" },
  { id: "customers", label: "Active customers", value: "3,482", change: 4.2, hint: "vs. Nov" },
  { id: "orders", label: "Orders", value: "1,206", change: -2.1, hint: "vs. Nov" },
  { id: "churn", label: "Churn risk", value: "11.4%", change: -1.3, hint: "lower is better", invert: true },
];

export const revenue = [
  { month: "Jan", revenue: 42000, target: 45000 },
  { month: "Feb", revenue: 46000, target: 47000 },
  { month: "Mar", revenue: 51000, target: 50000 },
  { month: "Apr", revenue: 49000, target: 53000 },
  { month: "May", revenue: 58000, target: 56000 },
  { month: "Jun", revenue: 63000, target: 60000 },
  { month: "Jul", revenue: 67000, target: 64000 },
  { month: "Aug", revenue: 72000, target: 68000 },
  { month: "Sep", revenue: 70000, target: 72000 },
  { month: "Oct", revenue: 78000, target: 76000 },
  { month: "Nov", revenue: 86000, target: 82000 },
  { month: "Dec", revenue: 94200, target: 88000 },
];

export const forecast = {
  summary: {
    nextQuarter: "$318,400",
    growth: 14.6,
    confidence: 87,
    note: "Driven by Electronics and Home demand; January usually dips after the holiday peak.",
  },
  series: [
    { month: "Jul", actual: 67000 },
    { month: "Aug", actual: 72000 },
    { month: "Sep", actual: 70000 },
    { month: "Oct", actual: 78000 },
    { month: "Nov", actual: 86000 },
    { month: "Dec", actual: 94200, predicted: 94200, range: [94200, 94200] },
    { month: "Jan", predicted: 99500, range: [93000, 106000] },
    { month: "Feb", predicted: 103800, range: [95000, 112500] },
    { month: "Mar", predicted: 115100, range: [104000, 126000] },
    { month: "Apr", predicted: 118900, range: [106000, 131500] },
  ],
};

export const sentiment = {
  totals: { positive: 62, neutral: 24, negative: 14 },
  weekly: [
    { week: "W1", positive: 55, neutral: 28, negative: 17 },
    { week: "W2", positive: 57, neutral: 27, negative: 16 },
    { week: "W3", positive: 54, neutral: 29, negative: 17 },
    { week: "W4", positive: 59, neutral: 26, negative: 15 },
    { week: "W5", positive: 61, neutral: 25, negative: 14 },
    { week: "W6", positive: 60, neutral: 26, negative: 14 },
    { week: "W7", positive: 64, neutral: 23, negative: 13 },
    { week: "W8", positive: 66, neutral: 21, negative: 13 },
  ],
  topics: [
    { topic: "Delivery speed", mentions: 412, score: 0.71 },
    { topic: "Product quality", mentions: 388, score: 0.64 },
    { topic: "Customer support", mentions: 301, score: 0.38 },
    { topic: "Pricing", mentions: 254, score: -0.12 },
  ],
};

export const demand = [
  { category: "Electronics", current: 920, forecast: 1180 },
  { category: "Home", current: 740, forecast: 905 },
  { category: "Apparel", current: 810, forecast: 780 },
  { category: "Beauty", current: 530, forecast: 610 },
  { category: "Sports", current: 410, forecast: 475 },
  { category: "Grocery", current: 660, forecast: 640 },
];

export const customers = [
  { id: 1, name: "Aarav Sharma", email: "aarav@brightmart.in", segment: "Enterprise", spend: 18420, orders: 64, lastOrder: "2026-11-02", churnRisk: 8 },
  { id: 2, name: "Meera Iyer", email: "meera@lotusretail.in", segment: "Enterprise", spend: 15980, orders: 52, lastOrder: "2026-11-05", churnRisk: 12 },
  { id: 3, name: "Rohan Gupta", email: "rohan@pinkcity.co", segment: "Growth", spend: 9210, orders: 38, lastOrder: "2026-10-28", churnRisk: 27 },
  { id: 4, name: "Sana Khan", email: "sana@aravalli.shop", segment: "Growth", spend: 8740, orders: 33, lastOrder: "2026-10-30", churnRisk: 19 },
  { id: 5, name: "Vikram Rathore", email: "vikram@havelihome.in", segment: "Growth", spend: 7320, orders: 29, lastOrder: "2026-09-14", churnRisk: 68 },
  { id: 6, name: "Neha Joshi", email: "neha@kalaghar.com", segment: "Starter", spend: 2140, orders: 11, lastOrder: "2026-10-12", churnRisk: 44 },
  { id: 7, name: "Karan Mehta", email: "karan@zestcart.in", segment: "Starter", spend: 1860, orders: 9, lastOrder: "2026-08-29", churnRisk: 81 },
  { id: 8, name: "Priya Nair", email: "priya@silkroute.in", segment: "Enterprise", spend: 21050, orders: 77, lastOrder: "2026-11-06", churnRisk: 5 },
  { id: 9, name: "Dev Malhotra", email: "dev@urbanloom.co", segment: "Growth", spend: 6480, orders: 24, lastOrder: "2026-10-03", churnRisk: 52 },
  { id: 10, name: "Ishita Bansal", email: "ishita@greenleaf.shop", segment: "Starter", spend: 1320, orders: 6, lastOrder: "2026-09-02", churnRisk: 74 },
  { id: 11, name: "Arjun Singh", email: "arjun@desertcraft.in", segment: "Growth", spend: 8120, orders: 31, lastOrder: "2026-11-01", churnRisk: 16 },
  { id: 12, name: "Tanvi Desai", email: "tanvi@moonbasket.in", segment: "Starter", spend: 2760, orders: 14, lastOrder: "2026-10-21", churnRisk: 33 },
  { id: 13, name: "Harsh Vardhan", email: "harsh@jaipurgoods.com", segment: "Enterprise", spend: 17640, orders: 58, lastOrder: "2026-10-31", churnRisk: 21 },
  { id: 14, name: "Anika Rao", email: "anika@petalpost.in", segment: "Starter", spend: 980, orders: 4, lastOrder: "2026-08-11", churnRisk: 88 },
];

export const chatGreeting = {
  role: "assistant",
  text: "Hi, I'm Pulse AI. Ask me about revenue, forecasts, customers, sentiment or demand.",
};

export const chatSuggestions = [
  "How is revenue trending?",
  "Which customers might churn?",
  "What does the forecast say?",
  "How do customers feel lately?",
];

export function fakeChatReply(message = "") {
  const q = message.toLowerCase();
  if (q.includes("revenue") || q.includes("sales"))
    return "Revenue reached $94,200 in December, up 8.9% on November and 7% above target. Q4 was the strongest quarter this year.";
  if (q.includes("churn") || q.includes("customer"))
    return "14 accounts are tracked and 4 have a churn risk above 70%: Anika Rao, Karan Mehta, Ishita Bansal and Vikram Rathore. A win-back offer could help.";
  if (q.includes("forecast") || q.includes("predict"))
    return "I expect about $318,400 over the next quarter (+14.6%) with 87% confidence. January may dip slightly before March picks up.";
  if (q.includes("sentiment") || q.includes("feel") || q.includes("review"))
    return "Positive sentiment is at 66% in week 8, up from 55% in week 1. Pricing is the only topic with negative sentiment.";
  if (q.includes("demand") || q.includes("stock") || q.includes("inventory"))
    return "Electronics demand should rise about 28% and Home about 22%. Apparel and Grocery look flat, so avoid overstocking them.";
  return "I can help with revenue, churn, forecasts, sentiment and demand. Try one of the suggestions below.";
}
