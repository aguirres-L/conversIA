/**
 * Cliente para el AI Core (backend Python).
 * Base URL desde VITE_AI_API_URL (ej. http://localhost:8000).
 */

const getBaseUrl = () => import.meta.env.VITE_AI_API_URL?.trim() || "";

/**
 * Comprueba si el backend está disponible (GET /health).
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function checkBackendHealth() {
  const base = getBaseUrl();
  if (!base) return { ok: false, message: "URL del backend no configurada" };
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    const data = res.ok ? await res.json().catch(() => ({})) : {};
    return res.ok ? { ok: true, ...data } : { ok: false, message: `Error ${res.status}` };
  } catch (err) {
    return { ok: false, message: err.message || "Sin conexión" };
  }
}

/**
 * Envía un mensaje de entrenamiento al AI Core.
 * @param {string} businessId - ID del negocio en Firestore
 * @param {string} uid - UID del usuario (Firebase Auth)
 * @param {string} text - Mensaje del usuario
 * @param {string} [sessionId] - ID de sesión de entrenamiento (opcional)
 * @returns {Promise<{ replyText: string, updatedProfile?: object }>}
 */
export async function sendTrainingMessage(businessId, uid, text, sessionId = null) {
  const base = getBaseUrl();
  if (!base) {
    throw new Error("VITE_AI_API_URL no está configurada. Agregala en .env");
  }
  const url = `${base.replace(/\/$/, "")}/ai/training/message`;
  const body = { businessId, uid, text };
  if (sessionId) body.sessionId = sessionId;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `AI API error: ${res.status}`);
  }
  return res.json();
}
