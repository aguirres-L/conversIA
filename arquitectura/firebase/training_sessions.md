# Firestore — Subcolección: training_sessions (opcional)

## Propósito
Guardar las **conversaciones de entrenamiento** (mensajes usuario + respuestas del bot) para retroalimentación, análisis o futura mejora del estilo sin obligar a que la arquitectura “oficial” del entrenamiento las exija.

No es obligatorio: el flujo de entrenamiento funciona sin esta subcolección.

## Ruta
`businesses/{businessId}/training_sessions/{sessionId}`

## Estructura del documento (campos)
- `createdAt` (timestamp) — primera vez que se usó esta sesión
- `updatedAt` (timestamp) — última vez que se añadió un mensaje
- `uid` (string, opcional) — UID del usuario que entrena (Firebase Auth)
- `messages` (array)
  - Cada elemento: `{ "from": "user" | "bot", "text": string, "at": string }`  
  - `at` en ISO (ej. generado en backend) o timestamp

## Quién escribe
- **Backend (Python):** al procesar `POST /ai/training/message` con `sessionId`, puede crear o actualizar este documento y añadir el par (mensaje usuario + respuesta bot) a `messages` (p. ej. con `arrayUnion`).

## Para qué se usa
- Historial de lo que se probó en entrenamiento.
- Base para revisar si el bot respondió bien y ajustar `seller_style` o `businessInfo`.
- Posible uso futuro para sugerir nuevos `exampleReplies` o métricas.

## Ejemplo de documento
```json
{
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP",
  "uid": "UID_FIREBASE_AUTH",
  "messages": [
    { "from": "user", "text": "Qué autos tienen?", "at": "2026-03-08T20:00:00Z" },
    { "from": "bot", "text": "• camaro: $14.000\n• Honda Civic: $20.000", "at": "2026-03-08T20:00:01Z" }
  ]
}
```

## Creación en Firebase
La subcolección y el documento se crean en el primer uso (p. ej. cuando el backend escribe la primera vez con ese `sessionId`). No hace falta crearlas a mano en la consola.
