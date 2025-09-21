// Normaliza la base y evita el doble “//” en las URLs
const BACKEND = (import.meta.env.VITE_BACKEND_URL || "http://localhost:8787").replace(/\/+$/, "");

async function handle(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || res.statusText || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export function authHeader() {
  const t = localStorage.getItem("cm_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${BACKEND}${p}`;
  const res = await fetch(url, { ...opts, headers });
  return handle(res);
}

// ====== Auth ======
export const login = (payload) =>
  api("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });

export const me = () => api("/api/auth/me", { headers: authHeader() });

// ====== Productos (público) ======
export const listProducts = () => api("/api/products");
export const getProductBySlug = (slug) => api(`/api/product/${encodeURIComponent(slug)}`);

// ====== Admin Productos ======
export const adminCreateProduct = (payload) =>
  api("/api/admin/products", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(payload),
  });

export const adminUpdateProduct = (id, payload) =>
  api(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(payload),
  });

export const adminDeleteProduct = (id) =>
  api(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeader(),
  });

// ====== Pedidos / Reportes ======
export const adminListOrders = () => api("/api/admin/orders", { headers: authHeader() });
export const adminExportCsvUrl = () => `${BACKEND}/api/admin/orders/export`;
export const adminStats = () => api("/api/admin/stats", { headers: authHeader() });

// ====== Checkout ======
export const createCheckout = (payload) =>
  api("/api/checkout", { method: "POST", body: JSON.stringify(payload) });

// Aliases
export const createProduct = adminCreateProduct;
export const deleteProduct = adminDeleteProduct;
export const getOrders = adminListOrders;
export const getStats = adminStats;
