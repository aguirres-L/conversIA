# Firestore — Collection: businesses

## 📌 Propósito
Representa **cada negocio** que usa la plataforma.  
Es el “root” del sistema: desde acá se cuelgan conversaciones, productos, estilo del vendedor y eventos.

## 📂 Ruta
`businesses/{businessId}`

## 🧱 Estructura del documento (campos)
- `name` (string) — nombre comercial del negocio
- `ownerUid` (string) — UID de Firebase Auth del dueño
- `phoneNumber` (string) — número de WhatsApp principal del negocio (si aplica 1 número por negocio)
- `whatsapp` (map)
  - `phoneNumberId` (string) — id del número en WhatsApp Cloud API
  - `wabaId` (string) — WhatsApp Business Account ID
  - `accessTokenRef` (string) — referencia a dónde guardás el token (evitar exponerlo al cliente)
- `settings` (map)
  - `handoffThreshold` (number) — % mínimo (ej: 50) para recomendar/activar handoff
  - `language` (string) — "es-AR"
  - `timezone` (string) — "America/Argentina/Cordoba"
  - `autoReplyEnabled` (bool) — habilita respuestas del bot
- `businessInfo` (map, opcional) — contexto del negocio para que la IA responda con datos reales
  - `addressType` (string) — "physical" | "virtual"
  - `address` (string) — dirección física o texto tipo "Solo ventas online"
  - `businessHours` (string) — ej. "Lun a Vie 9-18, Sáb 9-13"
  - `description` (string) — qué hace el negocio (para contexto IA)
  - `paymentMethods` (string) — ej. "Efectivo, transferencia, tarjeta"
  - `deliveryZone` (string) — zona de envío o cobertura
  - `email` (string)
  - `website` (string)
  - `extraContext` (string) — información adicional libre para la IA
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## ✅ Para qué se usa en el sistema
- Identificar **qué negocio** recibió un mensaje entrante.
- Obtener configuración del bot (threshold, idioma, etc.).
- Controlar permisos/roles (ownerUid).
- Centralizar settings que impactan en workflows y scoring.
- **businessInfo**: dar contexto a la IA (dirección, horarios, formas de pago, etc.) para respuestas precisas.

## 🧩 Ejemplo de documento
```json
{
  "name": "Tienda Tech",
  "ownerUid": "UID_FIREBASE",
  "phoneNumber": "+549351000000",
  "whatsapp": {
    "phoneNumberId": "1234567890",
    "wabaId": "WABA_001",
    "accessTokenRef": "secret/wa_token/business_001"
  },
  "settings": {
    "handoffThreshold": 50,
    "language": "es-AR",
    "timezone": "America/Argentina/Cordoba",
    "autoReplyEnabled": true
  },
  "businessInfo": {
    "addressType": "physical",
    "address": "Av. Ejemplo 123, Córdoba",
    "businessHours": "Lun a Vie 9-18, Sáb 9-13",
    "description": "Tienda de tecnología y servicios",
    "paymentMethods": "Efectivo, transferencia, tarjeta",
    "deliveryZone": "Córdoba y alrededores",
    "email": "contacto@tiendatech.com",
    "website": "https://tiendatech.com",
    "extraContext": ""
  },
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}