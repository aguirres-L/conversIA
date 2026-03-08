/**
 * Colección: businesses
 * Ref: arquitectura/firebase/businesses.md
 */

export {
  BUSINESSES_COLLECTION,
  BUSINESS_FIELDS,
  BUSINESS_INFO_FIELDS,
  WHATSAPP_FIELDS,
  SETTINGS_FIELDS,
  DEFAULT_SETTINGS,
} from "./businessesConfig.js";

export {
  businessRef,
  getBusiness,
  getBusinessByOwnerUid,
  createBusiness,
  updateBusiness,
  updateBusinessSettings,
  updateBusinessInfo,
} from "./businessesService.js";
