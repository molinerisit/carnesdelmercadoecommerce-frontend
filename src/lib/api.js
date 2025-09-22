const BACKEND = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3001").replace(/\/+$/, "");

async function handle(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || res.statusText || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export function authHeader() {
  if (typeof window === "undefined") return {};
  const t = window.localStorage.getItem("cm_token");
  return t ? { Authorization: "Bearer " + t } : {};
}

async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${BACKEND}${p}`;
  const res = await fetch(url, { ...opts, headers });
  return handle(res);
}

export const login = (payload) => api("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
export const me = () => api("/api/auth/me", { headers: authHeader() });

export const getProducts = () => api("/api/products");
export const getProduct = (slug) => api(`/api/products/${encodeURIComponent(slug)}`);

export const adminListOrders = () => api("/api/admin/orders", { headers: authHeader() });
export const adminExportCsvUrl = () => `${BACKEND}/api/admin/orders/export`;
export const adminStats = () => api("/api/admin/stats", { headers: authHeader() });

export const createCheckout = (payload) => api("/api/checkout", { method: "POST", body: JSON.stringify(payload) });
