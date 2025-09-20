import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProduct } from '../lib/api'
import { formatARS } from '../lib/format'

export default function Product(){
  const { slug } = useParams()
  const [prod, setProd] = useState(null)
  const [qty, setQty] = useState(1)
  const nav = useNavigate()

  useEffect(()=>{ getProduct(slug).then(setProd).catch(console.error) }, [slug])

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({ productId: prod.id, name: prod.name, price: prod.price, quantity: qty })
    localStorage.setItem('cart', JSON.stringify(cart))
    nav('/cart')
  }

  if (!prod) return <main className="max-w-6xl mx-auto px-4 py-6">Cargando…</main>
  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/shop" className="text-sm text-stone-600">← Volver</Link>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden">
          <img src={prod.imageUrl || 'https://placehold.co/600x400'} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{prod.name}</h1>
          <p className="text-stone-600 mt-2">{prod.description}</p>
          <div className="text-lg text-stone-600 mt-2">Precio por {prod.unit}</div>
          <div className="text-3xl font-extrabold text-brand-800 mt-1">{formatARS(prod.price)} <span className="text-base text-stone-500">/ {prod.unit}</span></div>
          <div className="mt-4 flex items-center gap-2">
            <input className="input w-24" type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))}/>
            <button className="btn" onClick={addToCart}>Agregar al carrito</button>
          </div>
          <div className="text-xs text-stone-500 mt-2">Stock: {prod.stock}</div>
        </div>
      </div>
    </main>
  )
}
