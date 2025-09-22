import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Checkout from './pages/Checkout.jsx'

function Home() {
  return (
    <main style={{maxWidth: 960, margin: '2rem auto', padding: '0 1rem'}}>
      <h1>Carnes del Mercado</h1>
      <p>Demo frontend listo para Checkout.</p>
      <p><Link to="/checkout">Ir al Checkout</Link></p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
