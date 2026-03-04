
---

```markdown
# Firestore — Collection: events

## 📌 Propósito
Registra **eventos del sistema** para monitoreo, métricas y debugging.  
No es estrictamente necesario para el MVP, pero es MUY útil para escalar y detectar problemas.

## 📂 Ruta
`businesses/{businessId}/events/{eventId}`

## 🧱 Estructura del documento (campos)
- `type` (string)
  - ejemplos: "wa_inbound", "wa_outbound", "ai_call", "lead_hot", "handoff_take", "handoff_release", "error"
- `ref` (map)
  - `conversationId` (string|null)
  - `messageId` (string|null)
- `payload` (map) — datos útiles recortados (sin información sensible)
- `createdAt` (timestamp)

## ✅ Para qué se usa en el sistema
- Auditoría: qué pasó y cuándo.
- Debugging: errores de WhatsApp/IA.
- Analítica: cuántos leads hot, cuántos handoffs, etc.
- Trazabilidad por conversationId.

## 🧩 Ejemplo de documento
```json
{
  "type": "lead_hot",
  "ref": { "conversationId": "wa_549351123456", "messageId": "msg_002" },
  "payload": { "score": 75, "stage": "closing" },
  "createdAt": "TIMESTAMP"
}