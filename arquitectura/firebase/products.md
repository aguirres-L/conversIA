
---

```markdown
# Firestore — Collection: products

## 📌 Propósito
Almacena los **productos y/o servicios** ofrecidos por el negocio.  
Se usa como “base de conocimiento comercial” para que la IA responda con datos reales (precio, descripción, variantes).

## 📂 Ruta
`businesses/{businessId}/products/{productId}`

## 🧱 Estructura del documento (campos)
- `type` (string) — `"product"` o `"service"`
- `name` (string)
- `description` (string)
- `price` (number|string) — number si es fijo; string si hay rango (“desde $…”)
- `currency` (string) — "ARS"
- `tags` (array<string>) — keywords para búsqueda/IA
- `isActive` (bool) — si el ítem está disponible
- `metadata` (map) — libre (duración, stock, categoría, etc.)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## ✅ Para qué se usa en el sistema
- Responder preguntas: “¿precio?”, “¿qué incluye?”, “¿tenés X?”
- Recomendaciones inteligentes (según intención del cliente).
- RAG: armar respuestas basadas en catálogo real (evitar inventar).
- La UI lo usa para ABM (alta/baja/modificación).

## 🧩 Ejemplo de documento
```json
{
  "type": "service",
  "name": "Curso Python",
  "description": "Curso completo desde cero",
  "price": 120000,
  "currency": "ARS",
  "tags": ["programacion", "python", "curso"],
  "isActive": true,
  "metadata": {
    "duracion": "8 semanas",
    "modalidad": "online"
  },
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}