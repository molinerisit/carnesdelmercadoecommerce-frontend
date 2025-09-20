export function getCartContext() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
}
export function buildContextMessage({ page = '', customer = '', phone = '' } = {}){
  const cart = getCartContext()
  const lines = []
  lines.push(`Consulta desde Carnes del Mercado`)
  if (page) lines.push(`Página: ${page}`)
  if (customer) lines.push(`Nombre: ${customer}`)
  if (phone) lines.push(`Tel: ${phone}`)
  if (cart.length){
    lines.push('Carrito:')
    for (const it of cart){
      lines.push(`- ${it.name} x${it.quantity}`)
    }
  } else {
    lines.push('Carrito: (vacío)')
  }
  lines.push('Necesito ayuda de un asesor humano.')
  return lines.join('\n')
}
export function waLink(message){
  const num = import.meta.env.VITE_WA_NUMBER
  if (!num) return null
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
}
