import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  AlertTriangle,
  Activity,
} from "lucide-react";

import CustomerSegmentChart from "../components/CustomerSegmentChart.jsx";
import SegmentPredictor from "../components/SegmentPredictor.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const PAGE_SIZE = 10; // rows shown per page

const segmentOptions = ["All", "High Chance to Leave", "Moderate Chance to Leave", "Low Chance to Leave"];

// summary cards (they also work as quick filters)
const cards = [
  { name: "High Chance to Leave", icon: AlertTriangle, border: "border-l-bad", badge: "bg-[#F6DAD4] text-bad" },
  { name: "Moderate Chance to Leave", icon: Activity, border: "border-l-warn", badge: "bg-[#FBEBCB] text-[#8A5400]" },
  { name: "Low Chance to Leave", icon: Users, border: "border-l-brand", badge: "bg-brand-soft text-brand" },
];

const th = "border-b border-line px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted";
const td = "border-b border-line px-4 py-3 text-sm";

const pageBtn =
  "flex min-w-9 cursor-pointer items-center justify-center gap-1 rounded-md border border-line px-3 py-1.5 text-[13px] hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

const fmt = (n) => Number(n).toLocaleString();

// badge colors follow the project theme
function getRiskStyle(segment) {
  if (segment === "High Chance to Leave") return "bg-[#F6DAD4] text-bad";
  if (segment === "Moderate Chance to Leave") return "bg-[#FBEBCB] text-[#8A5400]";
  return "bg-brand-soft text-brand";
}

const matches = (customer, query, segment) =>
  customer.customer_unique_id.toLowerCase().includes(query.trim().toLowerCase()) &&
  (segment === "All" || customer.risk_segment === segment);

// 1 2 3 … 40  style page numbers
function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("…");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

// ==========================================
// LOAD ALL CUSTOMERS (once, then cached)
// Search, filters, page counts and CSV export all use this list,
// so every filter gets its own correct number of pages.
// ==========================================

async function fetchAllCustomers(onProgress) {
  const get = async (skip, limit) => {
    const res = await fetch(`${API_URL}/customers/segments?skip=${skip}&limit=${limit}`);
    if (!res.ok) throw new Error(`Unable to load customers (${res.status})`);
    return res.json();
  };

  let first;
  try {
    first = await get(0, 1000);
  } catch {
    first = await get(0, 100); // backend may cap the page size
  }

  const total = first.total_customers;
  const step = first.customers.length || 1;
  const skips = [];
  for (let skip = step; skip < total; skip += step) skips.push(skip);

  const parts = new Array(skips.length);
  let done = first.customers.length;
  let next = 0;
  onProgress(Math.min(100, Math.round((done / total) * 100)));

  // a few requests at a time
  const worker = async () => {
    while (next < skips.length) {
      const i = next++;
      const result = await get(skips[i], step);
      parts[i] = result.customers;
      done += result.customers.length;
      onProgress(Math.min(100, Math.round((done / total) * 100)));
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));

  return first.customers.concat(...parts);
}

let allCache = null;
let allPromise = null;
const progressListeners = new Set();

function loadAllCustomers() {
  if (allCache) return Promise.resolve(allCache);
  if (!allPromise) {
    allPromise = fetchAllCustomers((p) => progressListeners.forEach((fn) => fn(p)))
      .then((rows) => (allCache = rows))
      .catch((err) => {
        allPromise = null;
        throw err;
      });
  }
  return allPromise;
}

// Build and download a CSV file
function downloadCSV(customers) {
  const headers = ["Customer ID", "Orders Last 90 Days", "Total Spent", "Predicted Cluster", "Risk Segment"];

  const rows = customers.map((c) => [
    c.customer_unique_id,
    c.orders_last_90_days,
    c.total_spent,
    c.predicted_cluster,
    c.risk_segment,
  ]);

  const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\r\n");

  // BOM so Excel opens the file correctly
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "customer_segmentation.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function Customers() {
  // first page straight from the API (fast), until the full list is ready
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [summary, setSummary] = useState([]);

  // the full list
  const [all, setAll] = useState(allCache);
  const [allProgress, setAllProgress] = useState(allCache ? 100 : 0);
  const [allError, setAllError] = useState("");

  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("All");
  const [page, setPage] = useState(1); // 1-based

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  // summary cards: load once
  useEffect(() => {
    let live = true;
    fetch(`${API_URL}/customers/segments/summary`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Unable to load customer summary."))))
      .then((result) => live && setSummary(result.summary))
      .catch((err) => live && setError(err.message));
    return () => {
      live = false;
    };
  }, []);

  // full customer list: load in the background
  useEffect(() => {
    if (allCache) return;
    progressListeners.add(setAllProgress);
    loadAllCustomers()
      .then(setAll)
      .catch((err) => setAllError(err.message));
    return () => progressListeners.delete(setAllProgress);
  }, []);

  // until the full list is ready: load 10 customers per page from the API
  useEffect(() => {
    if (all) {
      setLoading(false);
      return;
    }
    let live = true;
    setLoading(true);

    fetch(`${API_URL}/customers/segments?skip=${(page - 1) * PAGE_SIZE}&limit=${PAGE_SIZE}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Unable to load customer data."))))
      .then((result) => {
        if (!live) return;
        setCustomers(result.customers);
        setTotalCustomers(result.total_customers);
        setError("");
      })
      .catch((err) => live && setError(err.message))
      .finally(() => live && setLoading(false));

    return () => {
      live = false;
    };
  }, [page, all]);

  const filtersActive = query.trim() !== "" || segment !== "All";

  // every customer that matches the search + segment filter
  const matched = useMemo(
    () => (all ? all.filter((c) => matches(c, query, segment)) : null),
    [all, query, segment]
  );

  const useLocal = Boolean(matched);
  const waiting = !useLocal && filtersActive; // filter needs the full list first
  const total = useLocal ? matched.length : totalCustomers;

  // each filter has its own page count
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, totalPages);

  const rows = useLocal
    ? matched.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
    : filtersActive
      ? []
      : customers;

  const from = total ? (current - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(current * PAGE_SIZE, total);

  const summaryTotal = summary.reduce((sum, s) => sum + s.customer_count, 0);
  const getCount = (name) => summary.find((s) => s.risk_segment === name)?.customer_count ?? 0;

  const changeSearch = (value) => {
    setQuery(value);
    setPage(1);
  };

  const changeSegment = (value) => {
    setSegment(value);
    setPage(1);
  };

  // export every customer that matches the current search / segment filter
  async function handleExport() {
    setExporting(true);
    setExportError("");
    try {
      const data = await loadAllCustomers();
      setAll(data);
      const exportRows = data.filter((c) => matches(c, query, segment));
      if (exportRows.length === 0) throw new Error("No customers match the current filter.");
      downloadCSV(exportRows);
    } catch (err) {
      setExportError(err.message);
    } finally {
      setExporting(false);
    }
  }

  if (error && customers.length === 0 && !all) {
    return (
      <p className="panel border-bad text-bad">
        {error} Check that the backend is running at {API_URL}.
      </p>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Customer segmentation and retention risk analysis</p>

        <div className="flex items-center gap-3">
          {exportError && <span className="text-[13px] text-bad">{exportError}</span>}
          <button
            onClick={handleExport}
            disabled={exporting || total === 0}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            {exporting ? (all ? "Preparing…" : `Exporting ${allProgress}%`) : `Export CSV${useLocal ? ` (${fmt(total)})` : ""}`}
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map(({ name, icon: Icon, border, badge }) => {
          const count = getCount(name);
          const active = segment === name;
          return (
            <button
              key={name}
              onClick={() => changeSegment(active ? "All" : name)}
              aria-pressed={active}
              className={`panel cursor-pointer border-l-4 text-left transition-colors ${border} ${
                active ? "ring-2 ring-ink" : "hover:bg-bg"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-muted">{name}</p>
                  <p className="mb-0.5 mt-1 text-3xl font-bold tracking-tight">{fmt(count)}</p>
                  <p className="text-xs text-muted">
                    {summaryTotal ? Math.round((count / summaryTotal) * 1000) / 10 : 0}% of customers · click to filter
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${badge}`}>
                  <Icon size={22} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* GRAPH + PREDICTOR */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <CustomerSegmentChart />
      <SegmentPredictor />
      </div>

      {/* CUSTOMER TABLE */}
      <section className="panel">
        <div className="mb-4">
          <h2 className="text-[17px] font-semibold">Customer list</h2>
          <p className="mt-0.5 text-[13px] text-muted">
            {waiting
              ? "Preparing filter…"
              : `Showing ${fmt(from)}–${fmt(to)} of ${fmt(total)} ${filtersActive ? "matching " : ""}customers`}
          </p>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="mb-4 flex flex-wrap justify-between gap-3">
          <label className="flex min-w-[260px] items-center gap-2 rounded-md border border-line px-3 py-[7px]">
            <Search size={16} className="text-muted" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              value={query}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder="Search customer ID"
            />
          </label>

          <select
            value={segment}
            onChange={(e) => changeSegment(e.target.value)}
            aria-label="Filter by segment"
            className="cursor-pointer rounded-md border border-line bg-white px-3 py-2 text-sm outline-none"
          >
            {segmentOptions.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "All segments" : option}
              </option>
            ))}
          </select>
        </div>

        {waiting ? (
          <div className="py-12 text-center">
            {allError ? (
              <p className="text-sm text-bad">{allError}. Refresh the page to try again.</p>
            ) : (
              <>
                <p className="text-sm text-muted">
                  Loading all customers so the filter covers every page… {allProgress}%
                </p>
                <div className="mx-auto mt-3 h-1.5 w-64 max-w-full overflow-hidden rounded-full bg-line">
                  <div className="h-full bg-brand transition-all" style={{ width: `${allProgress}%` }} />
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={th}>Customer ID</th>
                    <th className={th}>Orders (90 days)</th>
                    <th className={th}>Total spend</th>
                    <th className={th}>Cluster</th>
                    <th className={th}>Risk segment</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((customer) => (
                    <tr key={customer.customer_unique_id} className="hover:bg-bg">
                      <td className={td}>
                        <code className="text-xs">{customer.customer_unique_id}</code>
                      </td>
                      <td className={td}>{customer.orders_last_90_days}</td>
                      <td className={td}>
                        R${" "}
                        {Number(customer.total_spent).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className={td}>
                        <span className="rounded-md bg-bg px-2 py-1 text-xs font-medium">
                          Cluster {customer.predicted_cluster}
                        </span>
                      </td>
                      <td className={td}>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getRiskStyle(
                            customer.risk_segment
                          )}`}
                        >
                          {customer.risk_segment}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-sm text-muted">
                        {loading ? "Loading customers…" : "No customers found. Clear the search or choose another segment."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION: page count follows the active filter */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-[13px] text-muted">
                Page {fmt(current)} of {fmt(totalPages)}
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <button className={pageBtn} onClick={() => setPage(1)} disabled={current <= 1 || loading} aria-label="First page">
                  <ChevronsLeft size={15} />
                </button>
                <button className={pageBtn} onClick={() => setPage(current - 1)} disabled={current <= 1 || loading}>
                  <ChevronLeft size={15} /> Previous
                </button>

                {pageItems(current, totalPages).map((item, i) =>
                  item === "…" ? (
                    <span key={`gap-${i}`} className="px-1 text-muted">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      disabled={loading}
                      aria-current={item === current ? "page" : undefined}
                      className={`${pageBtn} ${item === current ? "border-brand bg-brand text-white hover:bg-brand" : ""}`}
                    >
                      {fmt(item)}
                    </button>
                  )
                )}

                <button className={pageBtn} onClick={() => setPage(current + 1)} disabled={current >= totalPages || loading}>
                  Next <ChevronRight size={15} />
                </button>
                <button className={pageBtn} onClick={() => setPage(totalPages)} disabled={current >= totalPages || loading} aria-label="Last page">
                  <ChevronsRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}