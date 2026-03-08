/**
 * Configuración de la colección "businesses".
 * Ref: arquitectura/firebase/businesses.md
 *
 * Ruta en Firestore: businesses/{businessId}
 * Propósito: cada negocio de la plataforma (root del sistema).
 */

export const BUSINESSES_COLLECTION = "businesses";

/** Nombres de campos del documento (evitar magic strings) */
export const BUSINESS_FIELDS = {
  name: "name",
  ownerUid: "ownerUid",
  phoneNumber: "phoneNumber",
  whatsapp: "whatsapp",
  settings: "settings",
  businessInfo: "businessInfo",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

/** Subcampos de businessInfo (contexto del negocio para la IA) */
export const BUSINESS_INFO_FIELDS = {
  addressType: "addressType",
  address: "address",
  businessHours: "businessHours",
  description: "description",
  paymentMethods: "paymentMethods",
  deliveryZone: "deliveryZone",
  email: "email",
  website: "website",
  extraContext: "extraContext",
};

/** Subcampos de whatsapp */
export const WHATSAPP_FIELDS = {
  phoneNumberId: "phoneNumberId",
  wabaId: "wabaId",
  accessTokenRef: "accessTokenRef",
};

/** Subcampos de settings */
export const SETTINGS_FIELDS = {
  handoffThreshold: "handoffThreshold",
  language: "language",
  timezone: "timezone",
  autoReplyEnabled: "autoReplyEnabled",
};

/** Valores por defecto de settings (para crear/actualizar) */
export const DEFAULT_SETTINGS = {
  handoffThreshold: 50,
  language: "es-AR",
  timezone: "America/Argentina/Cordoba",
  autoReplyEnabled: true,
};
