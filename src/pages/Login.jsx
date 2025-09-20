import React, { useState } from 'react'
import { login } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('admin@carnesdelmercado.test')
  const [password,setPassword] = useState('admin123')
  const [error,setError] = useState('')
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault(); setError('')
    try{
      const res = await login(email,password)
      localStorage.setItem('cm_token', res.token)
      nav('/admin')
    }catch(e){ setError('Credenciales inválidas') }
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Ingresar al panel</h1>
      <form className="card space-y-3" onSubmit={submit}>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" />
        <button className="btn w-full">Entrar</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  )
}
