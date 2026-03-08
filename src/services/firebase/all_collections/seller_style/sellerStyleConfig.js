/**
 * Configuración del documento "seller_style" (perfil de estilo del vendedor).
 * Ref: arquitectura/firebase/seller_style.md
 *
 * Ruta: businesses/{businessId}/seller_style/profile (documento fijo)
 * Propósito: tono, reglas y ejemplos para que la IA responda como el vendedor.
 */

export const SELLER_STYLE_COLLECTION = "seller_style";
export const SELLER_STYLE_PROFILE_ID = "profile";

export const SELLER_STYLE_FIELDS = {
  tone: "tone",
  do: "do",
  dont: "dont",
  signature: "signature",
  exampleReplies: "exampleReplies",
  updatedAt: "updatedAt",
};
