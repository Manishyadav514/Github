import { VendorCodes } from "@typesLib/APIFilters";
import { SHOP } from "./SHOP.constant";

export let GLOBAL_SHOP = {
  SITE_CODE: "",
  VENDOR_CODE: "",
};

export const SITE_CODE = () => (GLOBAL_SHOP.SITE_CODE || SHOP.SITE_CODE) as VendorCodes;

export const VENDOR_CODE = () => GLOBAL_SHOP.VENDOR_CODE;
