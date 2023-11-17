import NucleusAPI from "@/services/nucleusAPI";
import { CURRENCY } from "@/constants/CURRENCY.constant";

export function formatPrice(currency: number, fixedDecimal = 0, prefix = false, denominate = true) {
  if (!currency) {
    return "";
  }
  const { denomination } = CURRENCY[NucleusAPI.Filter.CountryFilter];
  let price = typeof currency === "number" ? currency : parseInt(currency);
  if (denominate) {
    price = parseFloat((price / denomination).toFixed(2));
  } else {
    price = parseFloat(price.toFixed(2));
  }

  /* In Case of prefix flag add the desired currency sign and return a html */
  if (prefix) {
    return new Intl.NumberFormat(NucleusAPI.Filter.LanguageFilter || "en-in", {
      style: "currency",
      minimumFractionDigits: fixedDecimal,
      currency: getCurrency()
    }).format(price);
  }

  console.log({ price });
  return price || "";
}

export const getCurrencySymbol = () =>
  new Intl.NumberFormat(NucleusAPI.Filter.LanguageFilter || "en-in", { style: "currency", currency: getCurrency() })
    .formatToParts()
    .find(x => x.type === "currency")?.value || "₹";

export const getCurrency = () => CURRENCY[NucleusAPI.Filter.CountryFilter].currency;
