import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './styles.css'
import { me } from './lib/api'
import Landing from './pages/Landing'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Failure from './pages/Failure'
import Login from './pages/Login'
import AdminBot from './pages/AdminBot'
import Admin from './pages/Admin'
import Dashboard from './pages/Dashboard'
import ChatWidget from './components/ChatWidget'

function Nav(){
  const [isAuthed, setAuthed] = useState(false)
  useEffect(()=>{ me().then(()=>setAuthed(true)).catch(()=>setAuthed(false)) }, [])
  const logout = () => { localStorage.removeItem('cm_token'); window.location.href='/' }
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-brand-800">Carnes del Mercado</Link>
        <nav className="flex gap-4 items-center">
          <Link to="/shop" className="hover:text-brand-700">Tienda</Link>
          <Link to="/cart" className="hover:text-brand-700">Carrito</Link>
          {isAuthed ? (<>
            <Link to="/admin" className="hover:text-brand-700">Admin</Link>
            <Link to="/dashboard" className="hover:text-brand-700">Dashboard</Link>
            <button onClick={logout} className="text-sm text-stone-600 hover:text-brand-700">Salir</button>
          </>) : (<Link to="/login" className="hover:text-brand-700">Login</Link>)}
        </nav>
      </div>
    </header>
  )
}

function Protected({ children }){
  const [ok, setOk] = useState(null)
  useEffect(()=>{ me().then(()=>setOk(true)).catch(()=>setOk(false)) }, [])
  if (ok === null) return <main className="max-w-6xl mx-auto px-4 py-6">Cargando…</main>
  return ok ? children : <Navigate to="/login" replace />
}

function App(){
  return (
    <BrowserRouter>
      <Nav />
      <ChatWidget />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<Success />} />
        <Route path="/order-failure" element={<Failure />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Protected><Admin /></Protected>} />
        <Route path="/admin/bot" element={<Protected><AdminBot /></Protected>} /> {/* 👈 NUEVA */}
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      </Routes>
      <footer className="py-10 text-center text-sm text-stone-500">© Carnes del Mercado — Demo</footer>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
