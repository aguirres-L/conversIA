# n8n — Workflow B: UI_Control_Actions (Handoff + Mensaje manual)

## 🎯 Objetivo
Permitir que la UI (React) controle el sistema:
- Tomar conversación (handoff_take)
- Liberar conversación (handoff_release)
- Enviar mensaje manual (send_manual)

---

## ✅ Nodos (en orden para armar en n8n)

### 1) Webhook (Trigger)
- **Path:** `/webhooks/ui/action`
- **Method:** `POST`
- Body incluye: `action`, `businessId`, `conversationId`, `uid`, `text?`

### 2) Function — `ValidateAndParse`
- Valida campos obligatorios.
- Normaliza payload.

### 3) Switch — `ByAction`
- Casos:
  - `handoff_take`
  - `handoff_release`
  - `send_manual`

---

## 🟦 Caso A: `handoff_take`

### 4) Firestore Update — `SetHandoffActiveTrue`
- Set:
  - `handoff.active = true`
  - `handoff.takenByUid = uid`
  - `handoff.takenAt = now()`

### 5) Firestore Create — `EventHandoffTake`
- Guarda evento en `events`

### 6) Webhook Response
- 200 OK

---

## 🟩 Caso B: `handoff_release`

### 7) Firestore Update — `SetHandoffActiveFalse`
- Set:
  - `handoff.active = false`
  - `handoff.takenByUid = null`
  - `handoff.takenAt = null`

### 8) Firestore Create — `EventHandoffRelease`

### 9) Webhook Response
- 200 OK

---

## 🟧 Caso C: `send_manual`

### 10) Firestore Create — `SaveSellerMessage`
- Guarda mensaje del vendedor en `messages` con `from="seller"`

### 11) HTTP Request — `SendWhatsAppManual`
- Envía el texto a WhatsApp Cloud API `/messages`

### 12) Firestore Update — `UpdateConversationLastMessage`
- Actualiza:
  - `lastMessage`
  - `updatedAt`
  - `unreadCount` (opcional según tu lógica)

### 13) Webhook Response
- 200 OK

---

## 🔥 Resultado
- El vendedor toma o libera control con un click desde la UI.
- Puede responder manualmente desde el panel.
- Todo queda auditado y guardado en Firestore.