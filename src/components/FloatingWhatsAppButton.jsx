import React from 'react'
import { buildContextMessage, waLink } from '../lib/context'

export default function FloatingWhatsAppButton(){
  const onClick = () => {
    const msg = buildContextMessage({ page: location.pathname })
    const url = waLink(msg)
    if (!url) return alert('Configura VITE_WA_NUMBER en .env')
    window.open(url, '_blank')
  }
  return (
    <button
      onClick={onClick}
      title="Chatear por WhatsApp"
      className="fixed bottom-5 right-5 z-50 rounded-full shadow-lg border bg-green-500 hover:bg-green-600 text-white w-14 h-14 flex items-center justify-center"
      aria-label="WhatsApp"
    >
      💬
    </button>
  )
}
