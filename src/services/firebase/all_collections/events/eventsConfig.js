/**
 * Configuración de la subcolección "events".
 * Ref: arquitectura/firebase/events.md
 *
 * Ruta: businesses/{businessId}/events/{eventId}
 * Propósito: eventos del sistema para monitoreo, métricas y debugging.
 */

export const EVENTS_COLLECTION = "events";

export const EVENT_FIELDS = {
  type: "type",
  ref: "ref",
  payload: "payload",
  createdAt: "createdAt",
};

export const REF_FIELDS = { conversationId: "conversationId", messageId: "messageId" };

/** Tipos de evento (referencia) */
export const EVENT_TYPES = {
  waInbound: "wa_inbound",
  waOutbound: "wa_outbound",
  aiCall: "ai_call",
  leadHot: "lead_hot",
  handoffTake: "handoff_take",
  handoffRelease: "handoff_release",
  error: "error",
};
