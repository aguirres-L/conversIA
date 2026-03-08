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
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { BUSINESSES_COLLECTION } from "../businesses/businessesConfig.js";
import {
  PRODUCTS_COLLECTION,
  PRODUCT_FIELDS,
  DEFAULT_CURRENCY,
} from "./productsConfig.js";

function productsRef(businessId) {
  return collection(db, BUSINESSES_COLLECTION, businessId, PRODUCTS_COLLECTION);
}

function productRef(businessId, productId) {
  return doc(db, BUSINESSES_COLLECTION, businessId, PRODUCTS_COLLECTION, productId);
}

/**
 * Obtiene un producto por ID.
 */
export async function getProduct(businessId, productId) {
  const ref = productRef(businessId, productId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Lista productos del negocio. Opcional: solo activos.
 */
export async function listProducts(businessId, options = {}) {
  const { activeOnly = false, max = 100 } = options;
  const coll = productsRef(businessId);
  let q = query(coll, orderBy(PRODUCT_FIELDS.updatedAt, "desc"), limit(max));
  if (activeOnly) {
    q = query(
      coll,
      where(PRODUCT_FIELDS.isActive, "==", true),
      orderBy(PRODUCT_FIELDS.updatedAt, "desc"),
      limit(max)
    );
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Crea un producto. productId puede ser auto-generado (ej. con doc().id).
 */
export async function createProduct(businessId, productId, data) {
  const ref = productRef(businessId, productId);
  const now = serverTimestamp();
  const payload = {
    [PRODUCT_FIELDS.type]: data.type,
    [PRODUCT_FIELDS.name]: data.name,
    [PRODUCT_FIELDS.description]: data.description ?? "",
    [PRODUCT_FIELDS.price]: data.price,
    [PRODUCT_FIELDS.currency]: data.currency ?? DEFAULT_CURRENCY,
    [PRODUCT_FIELDS.tags]: data.tags ?? [],
    [PRODUCT_FIELDS.isActive]: data.isActive ?? true,
    [PRODUCT_FIELDS.metadata]: data.metadata ?? {},
    [PRODUCT_FIELDS.createdAt]: now,
    [PRODUCT_FIELDS.updatedAt]: now,
  };
  await setDoc(ref, payload);
}

/**
 * Actualiza campos del producto. updatedAt automático.
 */
export async function updateProduct(businessId, productId, data) {
  const ref = productRef(businessId, productId);
  const payload = { ...data, [PRODUCT_FIELDS.updatedAt]: serverTimestamp() };
  await updateDoc(ref, payload);
}

/**
 * Marca producto como activo/inactivo (soft delete).
 */
export async function setProductActive(businessId, productId, isActive) {
  return updateProduct(businessId, productId, { [PRODUCT_FIELDS.isActive]: isActive });
}

export { productRef, productsRef };
