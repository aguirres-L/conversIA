/**
 * Configuración de la subcolección "conversations".
 * Ref: arquitectura/firebase/conversations.md
 *
 * Ruta: businesses/{businessId}/conversations/{conversationId}
 * Propósito: conversación con un cliente (estado, score, handoff, último mensaje).
 */

export const CONVERSATIONS_COLLECTION = "conversations";

export const CONVERSATION_FIELDS = {
  channel: "channel",
  customer: "customer",
  status: "status",
  handoff: "handoff",
  lead: "lead",
  lastMessage: "lastMessage",
  unreadCount: "unreadCount",
  links: "links",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

export const CUSTOMER_FIELDS = { phone: "phone", name: "name", profilePic: "profilePic" };
export const HANDOFF_FIELDS = {
  active: "active",
  takenByUid: "takenByUid",
  takenAt: "takenAt",
  note: "note",
};
export const LEAD_FIELDS = {
  score: "score",
  stage: "stage",
  intent: "intent",
  confidence: "confidence",
  lastUpdatedAt: "lastUpdatedAt",
};
export const LAST_MESSAGE_FIELDS = { text: "text", from: "from", at: "at" };
export const LINKS_FIELDS = { directChatUrl: "directChatUrl" };

export const STATUS_VALUES = { open: "open", closed: "closed", archived: "archived" };
export const STAGE_VALUES = {
  discovery: "discovery",
  interest: "interest",
  consideration: "consideration",
  closing: "closing",
};
