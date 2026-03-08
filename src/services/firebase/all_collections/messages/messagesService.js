import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { BUSINESSES_COLLECTION } from "../businesses/businessesConfig.js";
import { CONVERSATIONS_COLLECTION } from "../conversations/conversationsConfig.js";
import { MESSAGES_COLLECTION, MESSAGE_FIELDS } from "./messagesConfig.js";

function messagesRef(businessId, conversationId) {
  return collection(
    db,
    BUSINESSES_COLLECTION,
    businessId,
    CONVERSATIONS_COLLECTION,
    conversationId,
    MESSAGES_COLLECTION
  );
}

function messageRef(businessId, conversationId, messageId) {
  return doc(
    db,
    BUSINESSES_COLLECTION,
    businessId,
    CONVERSATIONS_COLLECTION,
    conversationId,
    MESSAGES_COLLECTION,
    messageId
  );
}

/**
 * Obtiene un mensaje por ID.
 */
export async function getMessage(businessId, conversationId, messageId) {
  const ref = messageRef(businessId, conversationId, messageId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Lista mensajes de una conversación (orden: createdAt asc para timeline).
 */
export async function listMessages(businessId, conversationId, options = {}) {
  const { max = 100 } = options;
  const coll = messagesRef(businessId, conversationId);
  const q = query(coll, orderBy(MESSAGE_FIELDS.createdAt, "asc"), limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Añade un mensaje. El ID lo genera Firestore (addDoc).
 */
export async function addMessage(businessId, conversationId, data) {
  const coll = messagesRef(businessId, conversationId);
  const payload = {
    ...data,
    [MESSAGE_FIELDS.createdAt]: data.createdAt ?? serverTimestamp(),
  };
  const ref = await addDoc(coll, payload);
  return { id: ref.id, ...payload };
}

/**
 * Crea un mensaje con ID conocido (setDoc). Útil para idempotencia con wa.messageId.
 */
export async function setMessage(businessId, conversationId, messageId, data) {
  const ref = messageRef(businessId, conversationId, messageId);
  const payload = {
    ...data,
    [MESSAGE_FIELDS.createdAt]: data.createdAt ?? serverTimestamp(),
  };
  await setDoc(ref, payload);
  return { id: messageId, ...payload };
}

export { messageRef, messagesRef };
