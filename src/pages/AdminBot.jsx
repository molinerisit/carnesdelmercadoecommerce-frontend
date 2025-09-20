import { useEffect, useState } from "react";

// Usa proxy (/api/bot) por defecto. Si preferís directo, setea VITE_BOT_API_BASE en .env
const BOT_API_BASE = import.meta.env.VITE_BOT_API_BASE || "/api/bot";

async function apiGet(path) {
  const r = await fetch(`${BOT_API_BASE}${path}`, { cache: "no-store" });
  return r.json();
}
async function apiJSON(path, method, body) {
  const r = await fetch(`${BOT_API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return r.json();
}
async function apiUpload(path, file) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${BOT_API_BASE}${path}`, { method: "POST", body: fd });
  return r.json();
}

export default function AdminBot() {
  const [cfg, setCfg] = useState({ aiUsage: 60, allowOpenQA: true, topK: 6, temperature: 0.3, maxTokens: 600 });
  const [rules, setRules] = useState([]);
  const [docs, setDocs] = useState([]);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  async function refresh() {
    setCfg(await apiGet("/config"));
    setRules(await apiGet("/rules"));
    setDocs(await apiGet("/documents"));
  }
  useEffect(() => { refresh(); }, []);

  async function saveCfg() { await apiJSON("/config", "PUT", cfg); await refresh(); }
  async function ask() { const res = await apiJSON("/chat", "POST", { message: q }); setA(res.answer || ""); }
  async function uploadDoc(e) {
    const f = e.target.files?.[0]; if (!f) return;
    const doc = await apiUpload("/documents/upload", f);
    await apiJSON(`/documents/${doc.id}/ingest`, "POST");
    await refresh();
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <section style={{ border: "1px solid #2d2d2d", borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Control de IA</h2>
        <label style={{ display: "block", marginBottom: 8 }}>Uso de IA: {cfg?.aiUsage ?? 0}</label>
        <input type="range" min={0} max={100} value={cfg?.aiUsage ?? 0}
          onChange={(e)=>setCfg({...cfg, aiUsage:Number(e.target.value)})} style={{ width: "100%" }} />
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={!!cfg.allowOpenQA} onChange={(e)=>setCfg({...cfg, allowOpenQA:e.target.checked})}/>
            Respuestas abiertas
          </label>
          <label>topK
            <input style={{ marginLeft: 8, width: 80 }} type="number" value={cfg.topK || 6}
              onChange={(e)=>setCfg({...cfg, topK:Number(e.target.value)})}/>
          </label>
          <label>temp
            <input style={{ marginLeft: 8, width: 80 }} type="number" step="0.1" value={cfg.temperature || 0.3}
              onChange={(e)=>setCfg({...cfg, temperature:Number(e.target.value)})}/>
          </label>
          <label>maxTokens
            <input style={{ marginLeft: 8, width: 100 }} type="number" value={cfg.maxTokens || 600}
              onChange={(e)=>setCfg({...cfg, maxTokens:Number(e.target.value)})}/>
          </label>
          <button onClick={saveCfg} style={{ justifySelf: "end", padding: "8px 14px", borderRadius: 10, background: "#10b981", color: "#fff" }}>
            Guardar
          </button>
        </div>
      </section>

      <section style={{ border: "1px solid #2d2d2d", borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Documentos (RAG)</h2>
        <input type="file" accept="application/pdf" onChange={uploadDoc}/>
        <ul style={{ marginTop: 12, paddingLeft: 18 }}>
          {docs.map((d)=><li key={d.id}>{d.title}</li>)}
        </ul>
      </section>

      <section style={{ border: "1px solid #2d2d2d", borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Reglas de negocio</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: 14 }}>
            <thead><tr><th style={{ textAlign:"left" }}>Nombre</th><th>Tipo</th><th>Peso</th><th>Activo</th></tr></thead>
            <tbody>{rules.map((r)=>(
              <tr key={r.id}><td>{r.name}</td><td>{r.type}</td><td>{r.weight}</td><td>{String(r.isActive)}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section style={{ border: "1px solid #2d2d2d", borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Tester</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Preguntale al bot…"
                 style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #2d2d2d" }}/>
          <button onClick={ask} style={{ padding: "8px 14px", borderRadius: 10, background: "#0284c7", color:"#fff" }}>
            Enviar
          </button>
        </div>
        <pre style={{ marginTop: 12, whiteSpace: "pre-wrap", padding: 12, border: "1px solid #2d2d2d", borderRadius: 10 }}>{a}</pre>
      </section>
    </div>
  );
}
