export type langLocale = "en-in" | "hi-in" | "mr-in" | "en-ae" | "ar-ae" | "en-sa" | "ar-sa";

export type LanguageFilter = "EN" | "HI" | "MAR" | "TE" | "AR";

export type CountryFilter = "IND" | "SAU" | "ARE";

export type VendorCodes =
  | "mgp"
  | "bbc"
  | "stb"
  | "tmc"
  | "orh"
  | "srn"
  | "lit"
  | "blu"
  | "orb"
  | "mnm"
  | "popxo"
  | DummyVendorCodes;

export type DummyVendorCodes = "twk";

export type ME_VendorCodes = "srn-are" | "srn-sau" | "tmc-are" | "tmc-sau" | "orh-are" | "orh-sau";

export type AllVendors = VendorCodes | ME_VendorCodes;

export type Regions = "MIDDLE_EAST" | "INDIA";
