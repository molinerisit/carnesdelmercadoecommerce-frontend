import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../lib/api'
import { formatARS } from '../lib/format'

export default function Shop(){
  const [products, setProducts] = useState([])
  useEffect(()=>{ getProducts().then(setProducts).catch(console.error) }, [])

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-800">Nuestra Tienda</h1>
        <p className="text-stone-600">Elegí tus cortes y pagá online. Retirás en tienda.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(p => (
          <Link key={p.id} to={`/product/${p.slug}`} className="card hover:shadow-md transition">
            <div className="aspect-video bg-stone-100 rounded-lg mb-3 overflow-hidden">
              <img src={p.imageUrl || 'https://placehold.co/600x400'} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{p.name}</h3>
              <span className="price">{formatARS(p.price)}</span>
            </div>
            <div className="text-xs text-stone-500 mt-1">Stock: {p.stock} · por {p.unit}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
