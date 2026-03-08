import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import {
  BUSINESSES_COLLECTION,
  BUSINESS_FIELDS,
  DEFAULT_SETTINGS,
} from "./businessesConfig.js";

/**
 * Referencia al documento de un negocio.
 * Útil para subcolecciones: businesses/{businessId}/conversations, etc.
 */
export function businessRef(businessId) {
  return doc(db, BUSINESSES_COLLECTION, businessId);
}

/**
 * Obtiene un negocio por ID.
 * @param {string} businessId
 * @returns {Promise<{ id: string, ... } | null>} documento con id o null si no existe
 */
export async function getBusiness(businessId) {
  const ref = businessRef(businessId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Obtiene el primer negocio cuyo dueño es el usuario (ownerUid).
 * Útil tras login para saber con qué negocio trabajar.
 * @param {string} ownerUid - UID de Firebase Auth del dueño
 * @returns {Promise<{ id: string, ... } | null>}
 */
export async function getBusinessByOwnerUid(ownerUid) {
  const coll = collection(db, BUSINESSES_COLLECTION);
  const q = query(coll, where(BUSINESS_FIELDS.ownerUid, "==", ownerUid));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const first = snapshot.docs[0];
  return { id: first.id, ...first.data() };
}

/**
 * Crea un documento de negocio. Si el documento ya existe, no se sobrescribe.
 * @param {string} businessId - ID del documento (ej. generado con doc().id o un slug)
 * @param {object} data - name, ownerUid, phoneNumber (opc.), whatsapp (opc.), settings (opc.)
 * @returns {Promise<void>}
 */
export async function createBusiness(businessId, data) {
  const ref = businessRef(businessId);
  const now = serverTimestamp();
  const payload = {
    [BUSINESS_FIELDS.name]: data.name,
    [BUSINESS_FIELDS.ownerUid]: data.ownerUid,
    [BUSINESS_FIELDS.createdAt]: now,
    [BUSINESS_FIELDS.updatedAt]: now,
    [BUSINESS_FIELDS.settings]: { ...DEFAULT_SETTINGS, ...data.settings },
  };
  if (data.phoneNumber != null) payload[BUSINESS_FIELDS.phoneNumber] = data.phoneNumber;
  if (data.whatsapp != null) payload[BUSINESS_FIELDS.whatsapp] = data.whatsapp;
  await setDoc(ref, payload, { merge: false });
}

/**
 * Actualiza campos de un negocio. updatedAt se escribe automáticamente.
 * @param {string} businessId
 * @param {object} data - solo los campos a actualizar (name, phoneNumber, whatsapp, settings, etc.)
 * @returns {Promise<void>}
 */
export async function updateBusiness(businessId, data) {
  const ref = businessRef(businessId);
  const payload = { ...data, [BUSINESS_FIELDS.updatedAt]: serverTimestamp() };
  await updateDoc(ref, payload);
}

/**
 * Actualiza solo el mapa "settings" del negocio (merge con lo existente).
 * Usa notación de punto para no reemplazar todo el mapa.
 * @param {string} businessId
 * @param {object} settingsPatch - handoffThreshold, language, timezone, autoReplyEnabled
 * @returns {Promise<void>}
 */
export async function updateBusinessSettings(businessId, settingsPatch) {
  const ref = businessRef(businessId);
  const updates = { [BUSINESS_FIELDS.updatedAt]: serverTimestamp() };
  for (const [key, value] of Object.entries(settingsPatch)) {
    updates[`${BUSINESS_FIELDS.settings}.${key}`] = value;
  }
  await updateDoc(ref, updates);
}

/**
 * Actualiza el mapa "businessInfo" del negocio (contexto para la IA).
 * Reemplaza todo el objeto businessInfo con el proporcionado.
 * @param {string} businessId
 * @param {object} businessInfo - addressType, address, businessHours, description, etc.
 * @returns {Promise<void>}
 */
export async function updateBusinessInfo(businessId, businessInfo) {
  const ref = businessRef(businessId);
  await updateDoc(ref, {
    [BUSINESS_FIELDS.businessInfo]: businessInfo,
    [BUSINESS_FIELDS.updatedAt]: serverTimestamp(),
  });
}
