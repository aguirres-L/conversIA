
---

```markdown
# n8n — Workflow A: WA_Inbound_Orchestrator (WhatsApp → IA → Respuesta)

## 🎯 Objetivo
Automatizar el flujo principal:
1) llega un mensaje desde WhatsApp,
2) se guarda en Firestore,
3) se evalúa handoff,
4) se llama a Python (IA),
5) se guarda respuesta + score,
6) se responde al cliente por WhatsApp,
7) si score >= umbral, se notifica.

---

## ✅ Nodos (en orden para armar en n8n)

### 1) Webhook (Trigger)
- **Path:** `/webhooks/whatsapp/inbound`
- **Method:** `POST`
- Recibe payload de WhatsApp Cloud API.

### 2) Function — `NormalizePayload`
- Extrae y normaliza:
  - `fromPhone`
  - `waMessageId`
  - `text`
  - `phoneNumberId`
  - `timestamp`

### 3) HTTP Request — `ResolveBusiness`
- Determina el `businessId` según `phoneNumberId` (o mapping).
- **Output:** `businessId`

### 4) Firestore Get — `GetConversation`
- Busca `conversationId = "wa_" + fromPhone`

### 5) IF — `ConversationExists?`
- **Si NO existe:**
  - 5.1 Firestore Create — `CreateConversation`

### 6) Firestore Create — `SaveInboundMessage`
- Guarda el mensaje entrante en:
  - `conversations/{conversationId}/messages`

### 7) Firestore Update — `UpdateConversationLastMessage`
- Actualiza:
  - `lastMessage`
  - `updatedAt`
  - `unreadCount += 1`

### 8) Firestore Get — `GetHandoffState`
- Lee `handoff.active`

### 9) IF — `HandoffActive?`
- **Si TRUE:**
  - No responde el bot (termina flujo con 200 OK)
- **Si FALSE:**
  - Continúa

### 10) HTTP Request — `CallPythonAI`
- POST: `http://python-ai-core:8000/ai/whatsapp/message`
- Body: `businessId`, `conversationId`, `fromPhone`, `text`

### 11) Firestore Create — `SaveBotMessage`
- Guarda respuesta como mensaje `from="bot"`

### 12) Firestore Update — `UpdateLeadScore`
- Actualiza en `conversations`:
  - `lead.score`, `lead.stage`, `lead.intent`, `lead.confidence`
  - `lead.lastUpdatedAt`
  - `lastMessage` con el texto del bot

### 13) IF — `Score>=Threshold?`
- Si TRUE:
  - 13.1 Firestore Create — `CreateEventLeadHot`
  - 13.2 (Opcional) Email/Push/WhatsApp interno al dueño

### 14) HTTP Request — `SendWhatsAppReply`
- Envía texto a WhatsApp Cloud API `/messages`

### 15) Webhook Response
- Devuelve 200 OK.

---

## 🔥 Resultado
- Conversación y mensajes quedan guardados en Firestore.
- Se calcula score y etapa.
- Se responde automáticamente solo cuando no hay handoff.
- Se dispara evento “lead hot” cuando corresponde.