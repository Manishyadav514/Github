import { useEffect } from "react";

import { PAGE_CONSTANT_DATA, SET_PAGE_DATA } from "@libStore/valtio/PAGE_DATA.store";

/**
 * Store Data if not present for this page in valtio store
 * Note: doesn't returns anything
 */

export function usePageStoreData(data: any) {
  useEffect(() => {
    if (!PAGE_CONSTANT_DATA() && data) {
      SET_PAGE_DATA(data);
    }
  }, []);
}
