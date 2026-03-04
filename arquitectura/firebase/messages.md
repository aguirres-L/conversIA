
---

```markdown
# Firestore — Collection: messages

## 📌 Propósito
Guarda el **historial completo** de mensajes de una conversación: cliente, bot, vendedor y eventos del sistema.

## 📂 Ruta
`businesses/{businessId}/conversations/{conversationId}/messages/{messageId}`

## 🧱 Estructura del documento (campos)
- `from` (string) — "customer"|"bot"|"seller"|"system"
- `type` (string) — "text"|"image"|"audio"|"file"
- `text` (string|null)
- `media` (map|null)
  - `url` (string|null)
  - `mime` (string|null)
  - `sha256` (string|null)
- `wa` (map|null)
  - `messageId` (string|null) — id WhatsApp (idempotencia)
  - `timestamp` (string|null)
- `ai` (map|null)
  - `intent` (string|null)
  - `confidence` (number|null)
  - `scoreDelta` (number|null)
- `createdAt` (timestamp)

## ✅ Para qué se usa en el sistema
- Mostrar el chat en React (timeline).
- Auditoría / trazabilidad (qué se dijo y cuándo).
- Analítica y mejora de IA (intents, deltas, etc.).
- Idempotencia: evitar responder doble (wa.messageId).

## 🧩 Ejemplo de documento
```json
{
  "from": "customer",
  "type": "text",
  "text": "¿Cuánto sale el curso?",
  "wa": { "messageId": "wamid.HBgLM...", "timestamp": "1700000000" },
  "ai": { "intent": "ask_price", "confidence": 0.87, "scoreDelta": 10 },
  "createdAt": "TIMESTAMP"
}