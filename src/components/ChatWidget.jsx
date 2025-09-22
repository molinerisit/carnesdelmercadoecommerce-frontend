import React, { useEffect, useRef, useState } from 'react'
import { buildContextMessage, waLink } from '../lib/context.js'

const SUGGESTIONS = [
  '¿Horarios de atención?',
  '¿Medios de pago?',
  '¿Cómo retiro mi pedido?',
  'Quiero hablar con un humano'
]

function botReply(text){
  const t = (text||'').toLowerCase()
  if (t.includes('horario')) return 'Atendemos de Lunes a Sábados de 9 a 20 hs. Los pedidos online se pueden retirar el mismo día.'
  if (t.includes('pago') || t.includes('mercadopago')) return 'Aceptamos MercadoPago (tarjeta, débito, efectivo). Podés pagar online al finalizar la compra.'
  if (t.includes('retiro') || t.includes('retirar') || t.includes('envio')) return 'Este demo está optimizado para “retiro en tienda”. Te avisamos cuando esté listo.'
  if (t.includes('humano') || t.includes('asesor')) return '__ESCALATE__'
  return 'Soy el asistente virtual. Contame qué necesitás y te ayudo. Podés preguntar por horarios, pagos o retiro.'
}

export default function ChatWidget(){
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?' }
  ])
  const [input, setInput] = useState('')
  const boxRef = useRef(null)

  useEffect(()=>{
    if (open && boxRef.current){
      boxRef.current.scrollTop = boxRef.current.scrollHeight
    }
  }, [open, messages.length])

  const send = (text) => {
    const userText = (text ?? input).trim()
    if (!userText) return
    setMessages(m => [...m, { from: 'user', text: userText }])
    setInput('')
    const reply = botReply(userText)
    setTimeout(()=>{
      if (reply === '__ESCALATE__'){
        const ctx = buildContextMessage({ page: location.pathname })
        const url = waLink(ctx)
        if (!url) {
          setMessages(m => [...m, { from: 'bot', text: 'Para hablar con un humano, configurá VITE_WA_NUMBER en el .env del frontend.' }])
        } else {
          window.open(url, '_blank')
          setMessages(m => [...m, { from: 'bot', text: 'Te estoy derivando con un asesor por WhatsApp 📲' }])
        }
      } else {
        setMessages(m => [...m, { from: 'bot', text: reply }])
      }
    }, 400)
  }

  return (
    <>
      {!open && (
        <button onClick={()=>setOpen(true)} className="fixed bottom-24 right-5 z-50 rounded-full shadow-lg border bg-white hover:bg-stone-50 w-14 h-14 flex items-center justify-center" title="Asistente virtual">
          <span className="sr-only">Abrir chat</span>
          💬
        </button>
      )}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl border bg-white flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="font-semibold">Asistente virtual</div>
            <button onClick={()=>setOpen(false)} className="text-stone-500 hover:text-stone-700">✕</button>
          </div>
          <div ref={boxRef} className="p-3 space-y-2 overflow-y-auto" style={{maxHeight:'50vh'}}>
            {messages.map((m,i)=>(
              <div key={i} className={m.from==='bot' ? 'text-sm bg-stone-100 rounded-lg p-2' : 'text-sm bg-brand-800 text-white rounded-lg p-2 self-end'}>{m.text}</div>
            ))}
          </div>
          <div className="p-2 border-t">
            <div className="flex flex-wrap gap-2 mb-2">
              {SUGGESTIONS.map(s => <button key={s} className="px-2 py-1 text-xs rounded-full border hover:bg-stone-50" onClick={()=>send(s)}>{s}</button>)}
            </div>
            <div className="flex gap-2">
              <input className="input" placeholder="Escribí tu consulta…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send() } />
              <button className="btn" onClick={()=>send()}>Enviar</button>
            </div>
            <div className="text-xs text-stone-500 mt-1">
              ¿Preferís WhatsApp directo? <a className="underline" href={waLink(buildContextMessage({ page: location.pathname }))||'#'} target="_blank" rel="noreferrer">Abrí WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
