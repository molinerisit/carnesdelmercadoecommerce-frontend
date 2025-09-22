// src/lib/api.js
// Base del backend (sin barras duplicadas al final)
const BACKEND = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3001").replace(/\/+$/, "");

// Helper para respuestas HTTP
async function handle(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || res.statusText || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// Header de auth (safe)
export function authHeader() {
  if (typeof window === "undefined") return {};
  const t = window.localStorage.getItem("cm_token");
  return t ? { Authorization: "Bearer " + t } : {};
}

// Fetch centralizado
async function api(path, opts = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${BACKEND}${p}`;
  const res = await fetch(url, { ...opts, headers });
  return handle(res);
}

/* ================== AUTH ================== */
export const login = (payload) =>
  api("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });

export const me = () =>
  api("/api/auth/me", { headers: authHeader() });

/* =============== PRODUCTOS (público) =============== */
export const getProducts = () =>
  api("/api/products");

export const getProduct = (slug) =>
  api(`/api/products/${encodeURIComponent(slug)}`);

/* =============== ADMIN (productos) =============== */
export const adminCreateProduct = (payload) =>
  api("/api/admin/products", {
    method: "POST",
    headers: { ...authHeader() },
    body: JSON.stringify(payload),
  });

export const adminUpdateProduct = (id, payload) =>
  api(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { ...authHeader() },
    body: JSON.stringify(payload),
  });

export const adminDeleteProduct = (id) =>
  api(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });

/* =============== PEDIDOS / REPORTES =============== */
export const adminListOrders = () =>
  api("/api/admin/orders", { headers: authHeader() });

export const adminExportCsvUrl = () =>
  `${BACKEND}/api/admin/orders/export`;

export const adminStats = () =>
  api("/api/admin/stats", { headers: authHeader() });

/* ================== CHECKOUT ================== */
// Envía items + email al backend. El backend convierte centavos a ARS si mandás unit_price_cents.
export const createCheckout = (payload) =>
  api("/api/checkout", { method: "POST", body: JSON.stringify(payload) });

/* ===== Aliases por compatibilidad ===== */
export const createProduct = adminCreateProduct;
export const deleteProduct = adminDeleteProduct;
export const getOrders = adminListOrders;
export const getStats = adminStats;
