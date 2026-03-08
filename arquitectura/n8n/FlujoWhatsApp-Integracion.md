# Flujo WhatsApp — Integración Front + Python + n8n

Este documento describe cómo encastrar **n8n** con el **front (React + Firebase)** y el **backend Python (AI Core)** para cerrar el flujo de mensajes de WhatsApp.

---

## 1. Resumen del flujo

```
WhatsApp → n8n (webhook) → Python POST /ai/whatsapp/message
                              ↓
                    replyText, leadScore, stage, intent, actions
                              ↓
n8n → escribe en Firestore (conversation, message, events)
    → envía reply por WhatsApp
    → opcional: notifica al vendedor si handoffRecommended
```

- **Front:** ya integrado con Firebase (auth, colecciones) y con el backend Python para **entrenamiento** (`POST /ai/training/message`). El usuario inicia sesión → se guarda `user` y `business` → en Entrenamiento se llama al AI con `businessId` y `uid`.
- **Python:** responde con `replyText`, `leadScore`, `stage`, `intent`, `handoffRecommended`, `actions`.
- **n8n:** orquesta: recibe el mensaje entrante de WhatsApp, llama a Python, escribe en Firestore y envía la respuesta por WhatsApp.

---

## 2. Qué debe hacer n8n (checklist)

### 2.1 Webhook entrante (WhatsApp Cloud API)

- Recibir el payload de WhatsApp cuando llega un mensaje (configurar en Meta Developer / WhatsApp Business).
- Extraer: `businessId` (o identificador del número), `conversationId` (ej. `wa_<número>`), `fromPhone`, `text`.

### 2.2 Llamar al AI Core (Python)

- **POST** `{AI_BASE_URL}/ai/whatsapp/message`
- Body (JSON): `businessId`, `conversationId`, `fromPhone`, `text`.
- Respuesta: `replyText`, `leadScore`, `stage`, `intent`, `confidence`, `handoffRecommended`, `actions` (array).

### 2.3 Firestore

- **Conversación:** crear o actualizar `businesses/{businessId}/conversations/{conversationId}` con:
  - `lastMessage` (text, from, at),
  - `lead.score`, `lead.stage`, `lead.intent`, `lead.lastUpdatedAt`,
  - `handoff` si aplica,
  - `unreadCount`, `updatedAt`.
- **Mensaje:** añadir en `businesses/{businessId}/conversations/{conversationId}/messages` el mensaje del cliente y el mensaje del bot (from, type, text, createdAt y opcionalmente ai: intent, scoreDelta).
- **Eventos (opcional):** si `actions` contiene `type: "fire_event"`, escribir en `businesses/{businessId}/events` con `type`, `ref.conversationId`, `payload`, `createdAt`.

### 2.4 Enviar respuesta por WhatsApp

- Usar la API de WhatsApp Cloud para enviar `replyText` al número que envió el mensaje.

### 2.5 Handoff / notificación

- Si `handoffRecommended` es `true` (o hay acción `handoff_recommended`), disparar notificación al vendedor (email, otro workflow, etc.).

---

## 3. Variables de entorno sugeridas (n8n)

| Variable | Uso |
|----------|-----|
| `AI_BASE_URL` | URL del backend Python (ej. `http://localhost:8000` o la URL en producción). |
| `FIREBASE_*` o service account | Para que n8n escriba en Firestore (credenciales de servicio). |
| Credenciales WhatsApp | Token / config de WhatsApp Cloud API para enviar mensajes. |

---

## 4. Orden recomendado de trabajo en n8n

1. **Webhook** que reciba un mensaje de prueba (body con `businessId`, `conversationId`, `fromPhone`, `text`).
2. **Nodo HTTP Request** hacia `POST /ai/whatsapp/message` y comprobar que devuelve `replyText` y `actions`.
3. **Nodos Firestore** (o código) para actualizar conversation y añadir mensajes.
4. **Nodo WhatsApp** para enviar `replyText`.
5. **Rama opcional** para `actions`: si hay `fire_event`, escribir en `events`; si hay `handoff_recommended`, notificar.

Con esto el flujo queda: **Front (auth + entrenamiento)** ↔ **Python (IA)** y **WhatsApp ↔ n8n ↔ Python ↔ Firestore**.
