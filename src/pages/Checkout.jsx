import React, { useMemo, useState } from "react";
import { createCheckout } from "../lib/api";

function formatARS(n) {
  try { return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n); }
  catch { return `$${n?.toFixed ? n.toFixed(2) : n}`; }
}

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("delivery");
  const [addr, setAddr] = useState({ street: "", number: "", floor: "", apt: "", city: "", province: "", zip: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // demo cart: in real app, leer desde localStorage del carrito existente
  const cart = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch { return []; }
  }, []);

  const items = useMemo(() => (cart.length ? cart : [
    { title: "Milanesa", quantity: 2, unit_price_cents: 19990 },
    { title: "Asado", quantity: 1, unit_price_cents: 45990 },
  ]), [cart]);

  const totalARS = useMemo(() => items.reduce((acc, it) => acc + (Number(it.unit_price_cents || 0) * it.quantity) / 100, 0), [items]);

  const validate = () => {
    if (!items.length) return "Tu carrito está vacío.";
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Ingresá un email válido.";
    if (deliveryMode === "delivery") {
      const need = ["street","number","city","province","zip"];
      for (const k of need) if (!String(addr[k]||"").trim()) return "Completá la dirección: calle, número, ciudad, provincia y código postal.";
    }
    return "";
  };

  const onPay = async () => {
    const v = validate();
    if (v) { setError(v); return; }
    setError(""); setLoading(true);
    try {
      const resp = await createCheckout({
        email,
        items,
        delivery: { mode: deliveryMode, address: deliveryMode === "delivery" ? addr : null },
        customer: { name, phone, notes },
      });
      const url = resp.init_point || resp.sandbox_init_point || resp.url;
      if (!url) throw new Error("No se recibió URL de pago");
      window.location.href = url;
    } catch (e) {
      setError(String(e?.message || e));
    } finally { setLoading(false); }
  };

  return (
    <main style={{maxWidth: 720, margin: '2rem auto', padding: '0 1rem'}}>
      <h1>Checkout</h1>

      <section style={{marginBottom: 16}}>
        <h2>Tu pedido</h2>
        <div style={{border: '1px solid #ddd', borderRadius: 8}}>
          {items.map((it, idx) => (
            <div key={idx} style={{display:'flex', justifyContent:'space-between', padding: 8, borderBottom:'1px solid #eee'}}>
              <div>
                <div style={{fontWeight: 600}}>{it.title}</div>
                <div style={{fontSize: 12, color:'#555'}}>x{it.quantity}</div>
              </div>
              <div>{formatARS((it.unit_price_cents * it.quantity) / 100)}</div>
            </div>
          ))}
          <div style={{display:'flex', justifyContent:'space-between', padding: 8, background:'#fafafa', fontWeight:600}}>
            <div>Total</div><div>{formatARS(totalARS)}</div>
          </div>
        </div>
      </section>

      <section style={{marginBottom: 16}}>
        <input placeholder="Email (requerido)" value={email} onChange={e=>setEmail(e.target.value)} style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <input placeholder="Nombre (opcional)" value={name} onChange={e=>setName(e.target.value)} style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <input placeholder="Teléfono (opcional)" value={phone} onChange={e=>setPhone(e.target.value)} style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <textarea placeholder="Notas del pedido (opcional)" value={notes} onChange={e=>setNotes(e.target.value)} style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
      </section>

      <section style={{marginBottom: 16}}>
        <h2>Entrega</h2>
        <div style={{display:'flex', gap:16, marginBottom:8}}>
          <label><input type="radio" name="delivery" checked={deliveryMode==='delivery'} onChange={()=>setDeliveryMode('delivery')} /> Envío a domicilio</label>
          <label><input type="radio" name="delivery" checked={deliveryMode==='pickup'} onChange={()=>setDeliveryMode('pickup')} /> Retiro en tienda</label>
        </div>
        {deliveryMode === "delivery" && (
          <div style={{display:'grid', gap:8}}>
            <div style={{display:'grid', gap:8, gridTemplateColumns:'2fr 1fr'}}>
              <input placeholder="Calle" value={addr.street} onChange={e=>setAddr({...addr, street: e.target.value})} />
              <input placeholder="Número" value={addr.number} onChange={e=>setAddr({...addr, number: e.target.value})} />
            </div>
            <div style={{display:'grid', gap:8, gridTemplateColumns:'1fr 1fr'}}>
              <input placeholder="Piso (opcional)" value={addr.floor} onChange={e=>setAddr({...addr, floor: e.target.value})} />
              <input placeholder="Depto (opcional)" value={addr.apt} onChange={e=>setAddr({...addr, apt: e.target.value})} />
            </div>
            <div style={{display:'grid', gap:8, gridTemplateColumns:'1fr 1fr 1fr'}}>
              <input placeholder="Ciudad" value={addr.city} onChange={e=>setAddr({...addr, city: e.target.value})} />
              <input placeholder="Provincia" value={addr.province} onChange={e=>setAddr({...addr, province: e.target.value})} />
              <input placeholder="Código Postal" value={addr.zip} onChange={e=>setAddr({...addr, zip: e.target.value})} />
            </div>
          </div>
        )}
      </section>

      {error && <p style={{color:'#b00020', marginBottom:8}}>{error}</p>}
      <button onClick={onPay} disabled={loading || !items.length} style={{width:'100%', padding:12, fontWeight:600}}>
        {loading ? "Redirigiendo…" : "Pagar con Mercado Pago"}
      </button>
    </main>
  );
}
