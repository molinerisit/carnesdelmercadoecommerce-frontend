import React, { useState } from 'react'
import { createCheckout } from '../lib/api'

export default function Checkout(){
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onPay = async () => {
    setError('')
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!cart.length){ setError('Tu carrito está vacío'); return }
    if (!customer){ setError('Completá tu nombre'); return }
    setLoading(true)
    try{
      const res = await createCheckout({ cart, customer, phone, notes })
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787'
      const url = res.init_point.startsWith('http') ? res.init_point : base + res.init_point
      window.location.href = url
    }catch(e){ setError(String(e)) }
    finally{ setLoading(false) }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="card space-y-3">
        <input className="input" placeholder="Tu nombre" value={customer} onChange={e=>setCustomer(e.target.value)} />
        <input className="input" placeholder="Teléfono" value={phone} onChange={e=>setPhone(e.target.value)} />
        <textarea className="textarea" placeholder="Notas (horario de retiro, etc.)" value={notes} onChange={e=>setNotes(e.target.value)} />
        <button className="btn w-full" disabled={loading} onClick={onPay}>{loading?'Redirigiendo…':'Pagar con MercadoPago'}</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </main>
  )
}
