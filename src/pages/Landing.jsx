import React from "react";
import { Link } from "react-router-dom";
import { buildContextMessage, waLink } from "../lib/context";

export default function Landing() {
  const wa = waLink(buildContextMessage({ page: "/" }));

  return (
    <main>
      <section className="bg-gradient-to-b from-brand-800 to-brand-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-widest text-white/80 text-xs mb-2">
              Carnicería local · Rosario
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Carne fresca,{" "}
              <span className="underline decoration-white/40">
                al mejor precio
              </span>
              , lista para retirar
            </h1>
            <p className="mt-4 text-white/90">
              Pedí online en minutos. Elegí tus cortes favoritos, pagá con
              MercadoPago y <strong>retirá en tienda</strong> sin esperar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop" className="btn">
                Comprar ahora
              </Link>
              <a
                href="#como-funciona"
                className="px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition"
              >
                Cómo funciona
              </a>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition"
                >
                  WhatsApp
                </a>
              )}
            </div>
            <div className="mt-6 flex gap-6 text-white/80 text-sm">
              <div>✔️ Calidad seleccionada</div>
              <div>✔️ Precios claros</div>
              <div>✔️ Retiro en tienda</div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-white/5 border border-white/10 shadow-lg">
              <img
                src="/images/landing.png"
                alt="Cortes de carne fresca"
                className="aspect-[4/3] rounded-2xl border border-white/10 shadow-lg object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-brand-800 rounded-xl px-4 py-3 shadow">
              <div className="text-xs">Satisfacción</div>
              <div className="text-xl font-extrabold">4.9★</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          "Cortes Premium",
          "Compra segura",
          "Listo en minutos",
          "Atención cercana",
        ].map((t, i) => (
          <div key={i} className="card">
            <div className="text-lg font-semibold">{t}</div>
            <p className="text-sm text-stone-600 mt-1">
              {i === 0 &&
                "Seleccionamos los mejores cortes de res, cerdo y pollo."}
              {i === 1 && "Pagás con MercadoPago, rápido y confiable."}
              {i === 2 && "Hacé tu pedido online y retirá cuando prefieras."}
              {i === 3 && "Somos de barrio. Te asesoramos por WhatsApp."}
            </p>
          </div>
        ))}
      </section>

      <section id="como-funciona" className="bg-stone-50 border-y">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-brand-800">Cómo funciona</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            {[
              ["Elegí tus cortes", "Explorá la tienda y agregá al carrito."],
              ["Pagá online", "Usá MercadoPago en pocos clics."],
              ["Retirá en tienda", "Te avisamos cuando esté listo."],
            ].map(([h, d], i) => (
              <div key={i} className="card">
                <div className="text-4xl font-extrabold text-brand-800">
                  {i + 1}
                </div>
                <div className="font-semibold">{h}</div>
                <p className="text-stone-600 text-sm">{d}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/shop" className="btn">
              Ir a la tienda
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <h3 className="text-2xl font-bold">¿Listo para comer rico?</h3>
          <p className="text-white/90">
            Hacé tu pedido y retiralo cuando quieras.
          </p>
          <Link to="/shop" className="btn mt-4 inline-flex">
            Comprar ahora
          </Link>
        </div>
      </section>
    </main>
  );
}
