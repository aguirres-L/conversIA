# Flujo de entrenamiento del bot (/training)

## Objetivo
El apartado **Entrenamiento** en la UI sirve para que el dueño del negocio **pruebe** cómo responde el bot con los datos reales de su negocio (productos, horarios, formas de pago, estilo), **sin** pasar por WhatsApp ni n8n.

---

## Qué usa el entrenamiento (y qué no)

| Necesario | Uso |
|-----------|-----|
| **Negocio (business)** | `businessId` + datos del documento `businesses/{id}` (p. ej. `businessInfo`, `settings`). |
| **Productos/servicios** | Subcolección `businesses/{id}/products` — precios, nombres, descripciones (RAG). |
| **businessInfo** | Dirección, horarios, formas de pago, `extraContext`, etc. |
| **seller_style** (opcional) | `businesses/{id}/seller_style/profile` — tono, firma, `exampleReplies`. Si no existe, el bot responde igual pero sin personalización de estilo. |

**No** usa para nada en el flujo de entrenamiento:

- n8n
- WhatsApp
- Conversaciones de clientes (`conversations`, `messages`)

Es decir: para que el entrenamiento funcione bien solo hacen falta **el negocio**, **productos** y **businessInfo** (y opcionalmente **seller_style**). Lo demás es para el flujo de mensajes “reales”.

---

## Flujo técnico (resumido)

1. **Front (React)**  
   - Usuario en `/training` escribe un mensaje.  
   - Se llama a `POST /ai/training/message` con `businessId`, `uid`, `text`, y opcionalmente `sessionId`.

2. **Backend (Python)**  
   - Recibe el mensaje.  
   - Lee de Firestore (si hay credenciales):  
     - `businessInfo` (dirección, horarios, pago, `extraContext`, etc.)  
     - `products` (catálogo)  
     - `seller_style/profile` (tono, firma, `exampleReplies`) si existe  
   - Arma la respuesta (RAG + businessInfo + ejemplo de estilo si aplica).  
   - Opcionalmente guarda el intercambio en `training_sessions` (ver más abajo).  
   - Devuelve `replyText` (y opcionalmente `updatedProfile`).

3. **Front**  
   - Muestra la respuesta del bot en la misma pantalla.

---

## Checklist: qué tener en Firebase para que el entrenamiento sea correcto

- [ ] **Documento del negocio**  
  `businesses/{businessId}` con al menos:  
  - `businessInfo` (con dirección, horarios, formas de pago, `extraContext`, etc.).  
  - `settings` si se usan (p. ej. idioma, timezone).

- [ ] **Productos**  
  Subcolección `businesses/{businessId}/products` con los productos/servicios que el bot debe poder citar (nombre, precio, descripción, etc.).

- [ ] **seller_style (opcional pero recomendado)**  
  Documento `businesses/{businessId}/seller_style/profile` con:  
  - `tone`, `do`, `dont`, `signature`, `exampleReplies`, `updatedAt`.  
  Si no existe, el bot sigue respondiendo con productos y businessInfo, pero sin tono/firma/ejemplos personalizados.  
  **Crear a mano en Firebase:** subcolección `seller_style`, documento con id `profile`, campos según `arquitectura/firebase/seller_style.md`. Ejemplo mínimo:  
  `tone` (string): "amigable", `signature` (string): "— Tu nombre", `exampleReplies` (array): `[{ "customer": "Hola", "seller": "Hola, ¿en qué te ayudo?" }]`, `updatedAt` (timestamp).

- [ ] **Backend**  
  - Variable de entorno con credenciales de Firebase (p. ej. `GOOGLE_APPLICATION_CREDENTIALS` o `FIREBASE_SERVICE_ACCOUNT_JSON`) para que pueda leer `businesses`, `businessInfo`, `products` y `seller_style`.

- [ ] **Front**  
  - `VITE_AI_API_URL` apuntando al backend que expone `POST /ai/training/message`.

---

## Guardar la conversación de entrenamiento (opcional)

La arquitectura **no exige** guardar cada mensaje de entrenamiento, pero es útil para retroalimentación y análisis.

Si se quiere persistir:

- Se usa la subcolección **`training_sessions`** bajo cada negocio.  
- Estructura y uso se describen en:  
  **`arquitectura/firebase/training_sessions.md`**.

El backend puede escribir ahí cada intercambio (usuario + respuesta del bot) cuando recibe un `sessionId` en `POST /ai/training/message`, de forma opcional.

---

## Resumen

- **Entrenamiento** = solo negocio + productos + businessInfo + (opcional) seller_style; **no** n8n ni conversaciones de WhatsApp.  
- Para que el flujo sea correcto: tener en Firebase negocio con `businessInfo`, productos, y (recomendado) `seller_style/profile`; y backend con credenciales de Firebase y endpoint de entrenamiento.  
- Persistir la conversación de entrenamiento es opcional y se hace con `training_sessions` según `arquitectura/firebase/training_sessions.md`.
