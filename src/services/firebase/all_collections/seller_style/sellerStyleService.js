import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { BUSINESSES_COLLECTION } from "../businesses/businessesConfig.js";
import {
  SELLER_STYLE_COLLECTION,
  SELLER_STYLE_PROFILE_ID,
  SELLER_STYLE_FIELDS,
} from "./sellerStyleConfig.js";

function sellerStyleRef(businessId) {
  return doc(
    db,
    BUSINESSES_COLLECTION,
    businessId,
    SELLER_STYLE_COLLECTION,
    SELLER_STYLE_PROFILE_ID
  );
}

/**
 * Obtiene el perfil de estilo del vendedor del negocio.
 */
export async function getSellerStyle(businessId) {
  const ref = sellerStyleRef(businessId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Crea o reemplaza el documento completo de seller_style.
 */
export async function setSellerStyle(businessId, data) {
  const ref = sellerStyleRef(businessId);
  const payload = {
    ...data,
    [SELLER_STYLE_FIELDS.updatedAt]: serverTimestamp(),
  };
  await setDoc(ref, payload, { merge: false });
}

/**
 * Actualiza solo los campos indicados (merge).
 */
export async function updateSellerStyle(businessId, data) {
  const ref = sellerStyleRef(businessId);
  const payload = { ...data, [SELLER_STYLE_FIELDS.updatedAt]: serverTimestamp() };
  await updateDoc(ref, payload);
}

export { sellerStyleRef };
