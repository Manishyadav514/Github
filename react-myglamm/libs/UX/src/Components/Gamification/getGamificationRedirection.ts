import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { showError } from "@libUtils/showToaster";
import { setLocalStorageValue } from "@libUtils/localStorage";

export function getGamificationRedirectionURL(routeJSON: string, applyCoupon = true) {
  try {
    const ROUTE_DATA = JSON.parse(routeJSON);

    const displaySiteWide = !ROUTE_DATA.displaySiteWide ? "?displaySiteWide=false" : "";

    /* In Case we want autoapply coupon we store it in localstorage */
    if (ROUTE_DATA.discountCode && applyCoupon) {
      setLocalStorageValue(LOCALSTORAGE.COUPON, ROUTE_DATA.discountCode);
    }

    /* Redirecting Based on Destination */
    if (ROUTE_DATA?.destination === "collection") {
      return `/collection/${ROUTE_DATA.slug}${displaySiteWide}`;
    }
    if (ROUTE_DATA?.destination === "product-detail") {
      return `/product/${ROUTE_DATA.slug}${displaySiteWide}`;
    }

    throw Error("Unknown Destination Provided in CTA JSON");
  } catch (err) {
    console.error(err);

    showError("Something Went Wrong!!!");
  }
}
