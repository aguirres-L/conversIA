
---

```markdown
# Firestore — Collection: conversations

## 📌 Propósito
Representa una **conversación** con un cliente (para WhatsApp u otros canales).  
Es la colección principal para tu UI (cards) porque guarda el estado resumido: score, etapa, handoff, último mensaje, no leídos.

## 📂 Ruta
`businesses/{businessId}/conversations/{conversationId}`

## 🧱 Estructura del documento (campos)
- `channel` (string) — "whatsapp"
- `customer` (map)
  - `phone` (string)
  - `name` (string|null)
  - `profilePic` (string|null)
- `status` (string) — "open" | "closed" | "archived"
- `handoff` (map)
  - `active` (bool)
  - `takenByUid` (string|null)
  - `takenAt` (timestamp|null)
  - `note` (string|null)
- `lead` (map)
  - `score` (number) — 0..100 (tu %)
  - `stage` (string) — "discovery"|"interest"|"consideration"|"closing"
  - `intent` (string|null)
  - `confidence` (number|null)
  - `lastUpdatedAt` (timestamp)
- `lastMessage` (map)
  - `text` (string)
  - `from` ("customer"|"bot"|"seller")
  - `at` (timestamp)
- `unreadCount` (number)
- `links` (map)
  - `directChatUrl` (string|null)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## ✅ Para qué se usa en el sistema
- Pintar las **cards** (score, etapa, último mensaje, estado).
- Determinar si responde el bot o el humano (handoff.active).
- Controlar prioridades de atención (score alto).
- Mostrar contadores y filtros (open/closed).

## 🧩 Ejemplo de documento
```json
{
  "channel": "whatsapp",
  "customer": { "phone": "549351123456", "name": "Juan", "profilePic": null },
  "status": "open",
  "handoff": { "active": false, "takenByUid": null, "takenAt": null, "note": null },
  "lead": {
    "score": 65,
    "stage": "closing",
    "intent": "buy_intent",
    "confidence": 0.85,
    "lastUpdatedAt": "TIMESTAMP"
  },
  "lastMessage": { "text": "Perfecto, quiero comprar", "from": "customer", "at": "TIMESTAMP" },
  "unreadCount": 2,
  "links": { "directChatUrl": "https://wa.me/549351123456" },
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}