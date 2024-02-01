import MyGlammAPI from "@libAPI/MyGlammAPI";

import { CURRENCY } from "@libConstants/CURRENCY.constant";

export function formatPrice(currency: number, prefix = false, denominate = true) {
  const { denomination } = CURRENCY[MyGlammAPI.Filter.CountryFilter];

  try {
    // @ts-ignore
    let price = typeof currency === "number" ? currency : parseInt(currency);

    if (denominate) {
      price = parseFloat((price / denomination).toFixed(2));
    } else {
      price = parseFloat(price.toFixed(2));
    }

    /* In Case of prefix flag add the desired currency sign and return a html */
    if (prefix) {
      return new Intl.NumberFormat(MyGlammAPI.LOCALE || "en-in", {
        style: "currency",
        minimumFractionDigits: 0,
        currency: getCurrency(),
      }).format(price);
    }

    return price;
  } catch {
    return "";
  }
}

export const getCurrencySymbol = () =>
  new Intl.NumberFormat(MyGlammAPI.LOCALE || "en-in", { style: "currency", currency: getCurrency() })
    .formatToParts()
    ?.find(x => x.type === "currency")?.value || "₹";

export const getCurrency = () => CURRENCY[MyGlammAPI.Filter.CountryFilter].currency;
