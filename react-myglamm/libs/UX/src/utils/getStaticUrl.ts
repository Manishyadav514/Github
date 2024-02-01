import { SITE_CODE } from "@libConstants/GLOBAL_SHOP.constant";

import { isClient } from "./isClient";

export function getStaticUrl(url?: string) {
  let URL = url;

  if (!URL) return "";

  if (URL.startsWith("/global/")) {
    /* local check and runs only on dev machines */
    if (process.env.DEV_MODE || (isClient() && location.host.includes("localhost"))) return `/api${URL}`;

    if (process.env.NEXT_PUBLIC_REGION_CODE) return `/${process.env.NEXT_PUBLIC_REGION_CODE}-static${URL}`; // required only on server

    return URL;
  }

  if (!URL.startsWith("/api/")) {
    URL = `/${SITE_CODE()}${URL}`; // add vendor prefix to all the static urls incase it's not global
  }

  if (process.env.NEXT_PUBLIC_REGION_CODE) return `/${process.env.NEXT_PUBLIC_REGION_CODE}-static${URL}`; // required only on server

  return URL;
}
