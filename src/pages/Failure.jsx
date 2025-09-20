import React from 'react'
import { Link } from 'react-router-dom'
export default function Failure(){
  return <main className="max-w-xl mx-auto px-4 py-10 text-center">
    <h1 className="text-3xl font-extrabold text-red-700">Pago rechazado</h1>
    <p className="text-stone-600 mt-2">Hubo un problema con tu pago. Probá nuevamente.</p>
    <Link to="/checkout" className="btn mt-4 inline-flex">Reintentar</Link>
  </main>
}
