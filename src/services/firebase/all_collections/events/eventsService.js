import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { BUSINESSES_COLLECTION } from "../businesses/businessesConfig.js";
import { EVENTS_COLLECTION, EVENT_FIELDS } from "./eventsConfig.js";

function eventsRef(businessId) {
  return collection(db, BUSINESSES_COLLECTION, businessId, EVENTS_COLLECTION);
}

function eventRef(businessId, eventId) {
  return doc(db, BUSINESSES_COLLECTION, businessId, EVENTS_COLLECTION, eventId);
}

/**
 * Obtiene un evento por ID.
 */
export async function getEvent(businessId, eventId) {
  const ref = eventRef(businessId, eventId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Registra un nuevo evento (ID auto-generado por Firestore).
 */
export async function addEvent(businessId, data) {
  const coll = eventsRef(businessId);
  const payload = {
    [EVENT_FIELDS.type]: data.type,
    [EVENT_FIELDS.ref]: data.ref ?? {},
    [EVENT_FIELDS.payload]: data.payload ?? {},
    [EVENT_FIELDS.createdAt]: serverTimestamp(),
  };
  const ref = await addDoc(coll, payload);
  return { id: ref.id, ...payload };
}

/**
 * Lista eventos recientes. Opcional: filtrar por type o conversationId.
 */
export async function listEvents(businessId, options = {}) {
  const { type = null, conversationId = null, max = 50 } = options;
  const coll = eventsRef(businessId);
  let q;
  if (type && conversationId) {
    q = query(
      coll,
      where(EVENT_FIELDS.type, "==", type),
      where(`${EVENT_FIELDS.ref}.conversationId`, "==", conversationId),
      orderBy(EVENT_FIELDS.createdAt, "desc"),
      limit(max)
    );
  } else if (type) {
    q = query(
      coll,
      where(EVENT_FIELDS.type, "==", type),
      orderBy(EVENT_FIELDS.createdAt, "desc"),
      limit(max)
    );
  } else if (conversationId) {
    q = query(
      coll,
      where(`${EVENT_FIELDS.ref}.conversationId`, "==", conversationId),
      orderBy(EVENT_FIELDS.createdAt, "desc"),
      limit(max)
    );
  } else {
    q = query(coll, orderBy(EVENT_FIELDS.createdAt, "desc"), limit(max));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export { eventRef, eventsRef };
