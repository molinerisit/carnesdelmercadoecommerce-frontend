# Carnes del Mercado — Frontend

SPA en **React + Vite + React Router** para la tienda (catálogo, carrito, checkout) y el panel **/admin/bot** para gestionar el asistente con IA (RAG + reglas).

## 📌 Características
- Tienda completa (productos, carrito, checkout, estados de orden).
- Panel de administración de productos y pedidos.
- **Panel del Bot** en `/admin/bot` con:
  - Slider 0–100 del “uso de IA”.
  - Carga de PDFs y **ingesta RAG**.
  - Listado de **reglas de negocio**.
  - **Tester** para probar el bot.
- **ChatWidget** embebido en toda la app.

## ⚙️ Requisitos
- Node.js 18+ (recomendado LTS)  
- NPM 9+  
- Backend(s) corriendo:
  - **bot-api** (http://localhost:4001 por defecto)
  - Tu backend original del e-commerce (puerto propio)

## 🚀 Quick Start

```bash
npm install
npm run dev
```

---

## 🧭 Rutas principales

- `/` Landing  
- `/shop` Tienda  
- `/product/:slug` Producto  
- `/cart` Carrito  
- `/checkout` Checkout  
- `/order-success` / `/order-failure`  
- `/login` Login  
- `/admin` Admin de productos/pedidos  
- **`/admin/bot`** Panel del Bot (protegido)

---
