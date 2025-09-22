import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatARS } from '../lib/format.js'

export default function Cart(){
  const [cart, setCart] = useState([])
  useEffect(()=>{ setCart(JSON.parse(localStorage.getItem('cart') || '[]')) }, [])

  const remove = (i) => {
    const c = [...cart]; c.splice(i,1); setCart(c); localStorage.setItem('cart', JSON.stringify(c))
  }
  const totalCents = cart.reduce((acc, it)=> acc + it.price * it.quantity, 0)

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>
      {!cart.length ? <p>Tu carrito está vacío. <Link to="/shop" className="text-brand-800">Ver productos</Link></p> : (
        <div className="card">
          <table className="table">
            <thead><tr><th>Producto</th><th className="text-center">Cant.</th><th className="text-right">Subtotal</th><th></th></tr></thead>
            <tbody>
              {cart.map((it,i)=>(
                <tr key={i}>
                  <td>{it.name}</td>
                  <td className="text-center">{it.quantity}</td>
                  <td className="text-right">{formatARS(it.price*it.quantity)}</td>
                  <td className="text-right"><button className="text-brand-800" onClick={()=>remove(i)}>Quitar</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan="2"></td><td className="text-right font-extrabold">{formatARS(totalCents)}</td><td></td></tr>
            </tfoot>
          </table>
          <div className="mt-4 flex justify-end">
            <Link to="/checkout" className="btn">Continuar al pago</Link>
          </div>
        </div>
      )}
    </main>
  )
}
