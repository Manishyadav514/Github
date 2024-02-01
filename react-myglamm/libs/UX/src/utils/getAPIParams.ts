import { SHOP } from "@libConstants/SHOP.constant";
import { DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";

import MyGlammAPI from "@libAPI/MyGlammAPI";

import { AllVendors } from "@typesLib/APIFilters";

export function getVendorCode() {
  return (MyGlammAPI.Filter.APIVendor || DUMMY_VENDOR_CODE() || SHOP.SITE_CODE) as AllVendors;
}

export function getLanguageCode() {
  return MyGlammAPI.Filter.LanguageFilter;
}

export function getCountryCode() {
  return MyGlammAPI.Filter.CountryFilter;
}
