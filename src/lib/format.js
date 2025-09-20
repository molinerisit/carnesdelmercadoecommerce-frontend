export function formatARS(cents){
  const n = (cents || 0) / 100
  return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 })
}
