import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { BUSINESSES_COLLECTION } from "../businesses/businessesConfig.js";
import {
  CONVERSATIONS_COLLECTION,
  CONVERSATION_FIELDS,
} from "./conversationsConfig.js";

function conversationsRef(businessId) {
  return collection(db, BUSINESSES_COLLECTION, businessId, CONVERSATIONS_COLLECTION);
}

function conversationRef(businessId, conversationId) {
  return doc(db, BUSINESSES_COLLECTION, businessId, CONVERSATIONS_COLLECTION, conversationId);
}

/**
 * Obtiene una conversación por ID.
 */
export async function getConversation(businessId, conversationId) {
  const ref = conversationRef(businessId, conversationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Lista conversaciones del negocio. Opcional: filtrar por status.
 * Orden: updatedAt desc (más recientes primero).
 */
export async function listConversations(businessId, options = {}) {
  const { status = null, max = 50 } = options;
  const coll = conversationsRef(businessId);
  let q = query(coll, orderBy(CONVERSATION_FIELDS.updatedAt, "desc"), limit(max));
  if (status) {
    q = query(coll, where(CONVERSATION_FIELDS.status, "==", status), orderBy(CONVERSATION_FIELDS.updatedAt, "desc"), limit(max));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Crea una conversación. Debe pasarse conversationId (ej. wa_549351123456).
 */
export async function createConversation(businessId, conversationId, data) {
  const ref = conversationRef(businessId, conversationId);
  const now = serverTimestamp();
  await setDoc(ref, {
    ...data,
    [CONVERSATION_FIELDS.createdAt]: now,
    [CONVERSATION_FIELDS.updatedAt]: now,
  });
}

/**
 * Actualiza campos de una conversación. updatedAt se actualiza automáticamente.
 */
export async function updateConversation(businessId, conversationId, data) {
  const ref = conversationRef(businessId, conversationId);
  const payload = { ...data, [CONVERSATION_FIELDS.updatedAt]: serverTimestamp() };
  await updateDoc(ref, payload);
}

/**
 * Actualiza solo el mapa handoff (merge con notación de punto).
 */
export async function updateConversationHandoff(businessId, conversationId, handoffPatch) {
  const ref = conversationRef(businessId, conversationId);
  const updates = { [CONVERSATION_FIELDS.updatedAt]: serverTimestamp() };
  for (const [key, value] of Object.entries(handoffPatch)) {
    updates[`${CONVERSATION_FIELDS.handoff}.${key}`] = value;
  }
  await updateDoc(ref, updates);
}

/**
 * Actualiza lastMessage y opcionalmente incrementa unreadCount (usa increment de Firestore).
 */
export async function updateLastMessage(businessId, conversationId, lastMessage, unreadDelta = 0) {
  const ref = conversationRef(businessId, conversationId);
  const updates = {
    [CONVERSATION_FIELDS.lastMessage]: lastMessage,
    [CONVERSATION_FIELDS.updatedAt]: serverTimestamp(),
  };
  if (unreadDelta !== 0) {
    updates[CONVERSATION_FIELDS.unreadCount] = increment(unreadDelta);
  }
  await updateDoc(ref, updates);
}

export { conversationRef, conversationsRef };
