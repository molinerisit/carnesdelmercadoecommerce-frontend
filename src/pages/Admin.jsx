import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminCreateProduct, adminDeleteProduct, adminListOrders, adminUpdateProduct, getProducts, adminExportCsvUrl } from '../lib/api.js'
import { formatARS } from '../lib/format.js'

export default function Admin(){
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ id:null, name:'', slug:'', description:'', price:0, unit:'kg', imageUrl:'', stock:0 })

  const load = async ()=> setProducts(await getProducts())
  const loadOrders = async ()=> setOrders(await adminListOrders())

  useEffect(()=>{ load(); loadOrders() }, [])

  const save = async ()=>{
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
    if (form.id) await adminUpdateProduct(form.id, payload)
    else await adminCreateProduct(payload)
    setForm({ id:null, name:'', slug:'', description:'', price:0, unit:'kg', imageUrl:'', stock:0 })
    await load()
  }
  const edit = (p)=> setForm({ ...p })
  const del = async (id)=>{ await adminDeleteProduct(id); await load() }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">

      {/* Botón de acceso al panel del bot */}
      <div className="flex justify-end mb-4">
        <Link to="/admin/bot" className="btn">
          Configurar Bot 🤖
        </Link>
      </div>

      <section>
        <h1 className="text-2xl font-bold mb-4">Productos</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              <input className="input" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form, slug:e.target.value})} />
            </div>
            <textarea className="textarea" placeholder="Descripción" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
            <div className="grid grid-cols-4 gap-2">
              <input className="input" placeholder="Precio (centavos)" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
              <select className="select" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})}>
                <option value="kg">kg</option><option value="unidad">unidad</option>
              </select>
              <input className="input" placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} />
              <input className="input" placeholder="URL imagen" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})} />
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={save}>{form.id?'Actualizar':'Crear'}</button>
              {form.id && <button className="px-4 py-2 rounded-lg border" onClick={()=>setForm({ id:null, name:'', slug:'', description:'', price:0, unit:'kg', imageUrl:'', stock:0 })}>Cancelar</button>}
            </div>
          </div>
          <div className="card overflow-x-auto">
            <table className="table min-w-[560px]">
              <thead><tr><th>Producto</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
              <tbody>
                {products.map(p=>(
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{formatARS(p.price)}</td>
                    <td>{p.stock}</td>
                    <td className="space-x-2">
                      <button className="text-brand-800" onClick={()=>edit(p)}>Editar</button>
                      <button className="text-red-700" onClick={()=>del(p.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Pedidos</h2>
          <a className="btn" href={adminExportCsvUrl()}>Export CSV</a>
        </div>
        <div className="card overflow-x-auto">
          <table className="table min-w-[640px]">
            <thead><tr><th>Código</th><th>Cliente</th><th>Estado</th><th>Total</th><th>Fecha</th></tr></thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o.id}>
                  <td>{o.code}</td>
                  <td>{o.customer}</td>
                  <td>{o.status}</td>
                  <td>{formatARS(o.totalCents)}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
