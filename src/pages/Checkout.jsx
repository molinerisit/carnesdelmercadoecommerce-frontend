import React, { useMemo, useState } from "react";
import { createCheckout } from "../lib/api";

function formatARS(n) {
  try {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);
  } catch { return `$${n.toFixed(2)}`; }
}

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cart = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch { return []; }
  }, []);

  const items = useMemo(() => cart.map(it => ({
    title: it.name || it.title || "Producto",
    quantity: Math.max(1, Number(it.quantity || 1)),
    // Mandamos centavos si tu store guarda en centavos; el backend lo convierte
    unit_price_cents: Number(it.price_cents ?? (Number(it.price) * 100 || 0)),
    imageUrl: it.imageUrl || it.image || undefined,
  })), [cart]);

  const totalARS = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.unit_price_cents || 0) * it.quantity) / 100, 0);
  }, [items]);

  const onPay = async () => {
    setError("");
    if (!cart.length) return setError("Tu carrito está vacío.");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Ingresá un email válido.");

    setLoading(true);
    try {
      const resp = await createCheckout({
        email,
        items, // el backend recibirá unit_price_cents y lo convertirá
        meta: { name, phone, notes },
      });
      const url = resp.init_point || resp.sandbox_init_point || resp.url;
      if (!url) throw new Error("No se recibió URL de pago");
      window.location.href = url;
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Tu pedido</h2>
        <div className="divide-y rounded border">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between p-3">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-gray-600">x{it.quantity}</div>
              </div>
              <div className="text-right">{formatARS((it.unit_price_cents * it.quantity) / 100)}</div>
            </div>
          ))}
          {!items.length && <div className="p-3 text-gray-500">No hay items en el carrito.</div>}
          <div className="flex items-center justify-between p-3 bg-gray-50 font-semibold">
            <div>Total</div>
            <div>{formatARS(totalARS)}</div>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-3">
        <input className="input" placeholder="Email (requerido)" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Nombre (opcional)" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Teléfono (opcional)" value={phone} onChange={e=>setPhone(e.target.value)} />
        <textarea className="textarea" placeholder="Notas para el pedido (opcional)" value={notes} onChange={e=>setNotes(e.target.value)} />
      </section>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <button className="btn w-full" disabled={loading || !items.length} onClick={onPay}>
        {loading ? "Redirigiendo…" : "Pagar con Mercado Pago"}
      </button>
    </main>
  );
}
