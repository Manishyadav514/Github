import { Regions } from "@typesLib/APIFilters";

import { SHOP } from "@libConstants/SHOP.constant";

export function getPageByRegion(pageObject: { [char in Regions | "default"]?: any }) {
  return pageObject[SHOP.REGION] || pageObject.default || null;
}
