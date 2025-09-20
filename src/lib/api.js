const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787'

export async function api(path, opts = {}){
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
  const res = await fetch(`${BACKEND}${path}`, { ...opts, headers })
  if (!res.ok){
    const txt = await res.text().catch(()=> '')
    throw new Error(txt || res.statusText)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export function authHeader(){
  const t = localStorage.getItem('cm_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// Auth
export const login = (email,password)=> api('/api/auth/login', { method:'POST', body: JSON.stringify({email,password}) })
export const me = ()=> api('/api/auth/me', { headers: authHeader() })

// Productos
export const getProducts = ()=> api('/api/products')
export const getProduct = (slug)=> api(`/api/products/${slug}`)

// Admin productos
export const adminCreateProduct = (data)=> api('/api/admin/products', { method:'POST', body: JSON.stringify(data), headers: authHeader() })
export const adminUpdateProduct = (id, data)=> api(`/api/admin/products/${id}`, { method:'PUT', body: JSON.stringify(data), headers: authHeader() })
export const adminDeleteProduct = (id)=> api(`/api/admin/products/${id}`, { method:'DELETE', headers: authHeader() })

// Pedidos + CSV + Stats
export const adminListOrders = ()=> api('/api/admin/orders', { headers: authHeader() })
export const adminExportCsvUrl = ()=> `${BACKEND}/api/admin/orders/export`
export const adminStats = ()=> api('/api/admin/stats', { headers: authHeader() })

export const createCheckout = (payload)=> api('/api/checkout', { method:'POST', body: JSON.stringify(payload) })

// Aliases
export const createProduct = adminCreateProduct;
export const deleteProduct = adminDeleteProduct;
export const getOrders     = adminListOrders;
export const getStats      = adminStats;
