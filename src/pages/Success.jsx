import React from 'react'
import { Link } from 'react-router-dom'
export default function Success(){
  return <main className="max-w-xl mx-auto px-4 py-10 text-center">
    <h1 className="text-3xl font-extrabold text-green-700">¡Pago aprobado!</h1>
    <p className="text-stone-600 mt-2">Tu pedido fue registrado. Te avisamos cuando esté listo.</p>
    <Link to="/shop" className="btn mt-4 inline-flex">Volver a la tienda</Link>
  </main>
}
