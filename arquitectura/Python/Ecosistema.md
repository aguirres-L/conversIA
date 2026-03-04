# Python (FastAPI) — Ecosistema AI Core (qué hacer y por qué)

## 🎯 Objetivo del servicio Python
Python es el **cerebro de la plataforma**: el lugar donde vive la IA real.
n8n debe quedar como orquestador (webhooks, integraciones, reintentos),
y Python debe encargarse de:

- Entender el mensaje del cliente (intención / etapa)
- Calcular el **lead score** (tu % de compra)
- Generar respuestas con estilo del vendedor (`seller_style`)
- Consultar productos/servicios (`products`) para responder con información real (RAG)
- Decidir si corresponde recomendar handoff a humano

---

## ✅ Por qué conviene usar Python como IA (y no n8n “como IA”)
- Python permite un **código escalable y testeable**
- Podés hacer RAG real (buscar catálogo, FAQs, datos)
- Podés versionar y mejorar el scoring sin tocar workflows
- Podés integrar modelos locales o cloud
- Podés aplicar reglas, filtros y guardrails con precisión

n8n queda excelente para:
- recibir WhatsApp
- escribir/leer Firestore
- enviar WhatsApp
- notificar al dueño
- manejar reintentos

---

## 🧩 Endpoints mínimos que debe exponer Python

### 1) Endpoint para WhatsApp (producción)
`POST /ai/whatsapp/message`

**Input (mínimo):**
- `businessId`
- `conversationId`
- `fromPhone`
- `text`

**Output:**
- `replyText`
- `leadScore` (0..100)
- `stage`
- `intent`
- `confidence`
- `handoffRecommended` (true/false)
- `actions` (opcional)

Este endpoint lo llama n8n.

---

### 2) Endpoint para entrenamiento (UI)
`POST /ai/training/message`

**Input:**
- `businessId`
- `uid`
- `text`
- `sessionId` (opcional)

**Output:**
- `replyText`
- `updatedProfile` (opcional)

Este endpoint lo llama React (o tu backend).

---

## 🔄 Qué debería hacer internamente el AI Core (roadmap lógico)

### Paso 1 (MVP)
- Score simple + respuesta básica.
- Guardar/leer contexto mínimo.

### Paso 2 (Personalización)
- Leer `seller_style/profile` y aplicar tono/firma.
- Usar ejemplos del vendedor como guía.

### Paso 3 (RAG de productos)
- Leer catálogo `products`
- Armar respuestas con:
  - precio
  - descripción
  - condiciones
- Evitar alucinaciones.

### Paso 4 (Score inteligente)
- Modelo o reglas avanzadas:
  - señales de compra (“pago”, “link”, “envío”, “turno”, “reserva”)
  - objeciones (“caro”, “descuento”)
  - intención y urgencia

### Paso 5 (Tools / Acciones)
- Cuando detecta intención clara:
  - crear pedido
  - solicitar datos (nombre, dirección, método de pago)
  - disparar un evento

---

## 🧠 Resultado final esperado
- La UI muestra conversaciones con **score real** y etapa real.
- El bot responde “como el vendedor”.
- El bot recomienda handoff al 50%+.
- El vendedor entra solo cuando conviene, aumentando conversión.