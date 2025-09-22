import React, { useEffect, useState } from 'react'
import { adminStats, adminListOrders } from '../lib/api.js'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

export default function Dashboard(){
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    adminStats().then(setStats).catch(console.error)
    adminListOrders().then(setOrders).catch(console.error)
  }, [])

  if (!stats) return <main className="max-w-6xl mx-auto px-4 py-6">Cargando…</main>

  const pieData = [
    { name:'Aprobados', value: stats.ordersStatus.approved },
    { name:'Pendientes', value: stats.ordersStatus.pending },
    { name:'Rechazados', value: stats.ordersStatus.rejected },
  ]

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard de Ventas</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="text-stone-500 text-sm">Ventas totales</div><div className="text-3xl font-extrabold">${stats.totals.revenue.toLocaleString('es-AR')}</div></div>
        <div className="card"><div className="text-stone-500 text-sm">Pedidos</div><div className="text-3xl font-extrabold">{stats.totals.orders}</div></div>
        <div className="card"><div className="text-stone-500 text-sm">Ticket promedio</div><div className="text-3xl font-extrabold">${stats.totals.ticket.toFixed(2)}</div></div>
      </div>

      <section className="card h-80">
        <h2 className="font-semibold mb-2">Ventas por día</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats.salesByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="card h-80 grid md:grid-cols-2 gap-4">
        <div className="h-80">
          <h2 className="font-semibold mb-2">Estado de pedidos</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="value" data={pieData} label>
                {pieData.map((entry, index) => <Cell key={`c-${index}`} />)}
              </Pie>
              <Legend /><Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80 overflow-auto">
          <h2 className="font-semibold mb-2">Últimos pedidos</h2>
          <div className="card">
            <table className="table">
              <thead><tr><th>Código</th><th>Cliente</th><th>Estado</th><th>Total</th><th>Fecha</th></tr></thead>
              <tbody>
                {orders.slice(0,8).map(o=> (
                  <tr key={o.id}>
                    <td>{o.code}</td>
                    <td>{o.customer}</td>
                    <td>{o.status}</td>
                    <td>${(o.totalCents/100).toLocaleString('es-AR')}</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
