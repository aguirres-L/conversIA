
---

```markdown
# Firestore — Collection: seller_style (profile)

## 📌 Propósito
Guarda el **perfil de estilo** del vendedor/dueño del negocio.  
La IA lo usa para responder “como habla el vendedor”, logrando personalización real.

## 📂 Ruta
`businesses/{businessId}/seller_style/profile`

## 🧱 Estructura del documento (campos)
- `tone` (string) — ej: "amigable", "profesional", "directo"
- `do` (array<string>) — reglas: “saludar siempre”, “usar emojis”, etc.
- `dont` (array<string>) — reglas: “no ser formal”, “no hablar en tercera persona”
- `signature` (string|null) — firma final
- `exampleReplies` (array<object>)
  - `{ "customer": "...", "seller": "..." }`
- `updatedAt` (timestamp)

## ✅ Para qué se usa en el sistema
- Personalización de respuestas del bot por negocio.
- Mantener consistencia de marca/tono.
- Mejorar conversión (respuestas más humanas).
- La UI lo alimenta mediante el apartado de “simulación/entrenamiento”.

## 🧩 Ejemplo de documento
```json
{
  "tone": "amigable",
  "do": ["saludar siempre", "usar emojis moderados", "ser breve"],
  "dont": ["ser demasiado formal", "responder con textos largos"],
  "signature": "— Juan | Ventas",
  "exampleReplies": [
    { "customer": "Hola, cuánto sale?", "seller": "Hola 😊 depende del plan, ¿qué estás buscando?" }
  ],
  "updatedAt": "TIMESTAMP"
}