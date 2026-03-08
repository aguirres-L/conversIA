/**
 * Configuración de la subcolección "messages".
 * Ref: arquitectura/firebase/messages.md
 *
 * Ruta: businesses/{businessId}/conversations/{conversationId}/messages/{messageId}
 * Propósito: historial de mensajes de una conversación (cliente, bot, vendedor, system).
 */

export const MESSAGES_COLLECTION = "messages";

export const MESSAGE_FIELDS = {
  from: "from",
  type: "type",
  text: "text",
  media: "media",
  wa: "wa",
  ai: "ai",
  createdAt: "createdAt",
};

export const FROM_VALUES = { customer: "customer", bot: "bot", seller: "seller", system: "system" };
export const TYPE_VALUES = { text: "text", image: "image", audio: "audio", file: "file" };
export const MEDIA_FIELDS = { url: "url", mime: "mime", sha256: "sha256" };
export const WA_FIELDS = { messageId: "messageId", timestamp: "timestamp" };
export const AI_FIELDS = { intent: "intent", confidence: "confidence", scoreDelta: "scoreDelta" };
