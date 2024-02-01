import { CountryFilter } from "@typesLib/APIFilters";

type currencyType = {
  [char in CountryFilter]: { denomination: number; currencyCode: string; currency: string };
};

export const CURRENCY: currencyType = {
  IND: { denomination: 100, currencyCode: "₹", currency: "INR" },
  ARE: { denomination: 100, currencyCode: "AED", currency: "AED" },
  SAU: { denomination: 100, currencyCode: "SAR", currency: "SAR" },
};
