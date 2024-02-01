import { isClient } from "./isClient";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

export function isWebview() {
  if (isClient() && (window.location.href.includes("request_source=mobile_app") || "WV" in sessionStorage)) {
    return sessionStorage.getItem(SESSIONSTORAGE.WEBVIEW) || true;
  }

  return false;
}
