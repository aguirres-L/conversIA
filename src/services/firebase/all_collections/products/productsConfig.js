/**
 * Configuración de la subcolección "products".
 * Ref: arquitectura/firebase/products.md
 *
 * Ruta: businesses/{businessId}/products/{productId}
 * Propósito: productos/servicios del negocio (base de conocimiento para la IA).
 */

export const PRODUCTS_COLLECTION = "products";

export const PRODUCT_FIELDS = {
  type: "type",
  name: "name",
  description: "description",
  price: "price",
  currency: "currency",
  tags: "tags",
  isActive: "isActive",
  metadata: "metadata",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

export const TYPE_VALUES = { product: "product", service: "service" };
export const DEFAULT_CURRENCY = "ARS";
