/**
 * Subcolección: products
 * Ref: arquitectura/firebase/products.md
 */

export * from "./productsConfig.js";
export {
  productRef,
  productsRef,
  getProduct,
  listProducts,
  createProduct,
  updateProduct,
  setProductActive,
} from "./productsService.js";
