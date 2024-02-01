import { SITE_CODE } from "./GLOBAL_SHOP.constant";

/* Constants For Websites without Exclusive Backend/Nucleus */
export const DUMMY_VENDOR_CODES = ["twk"];

export const IS_DUMMY_VENDOR_CODE = () => DUMMY_VENDOR_CODES.includes(SITE_CODE());

export const DUMMY_VENDOR_CODE = () => IS_DUMMY_VENDOR_CODE() && "mgp"; // vendorCode for websites that's don't have their own exclusive backend
