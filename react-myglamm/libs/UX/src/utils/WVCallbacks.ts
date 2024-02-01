import Router from "next/router";

import { SHOP } from "@libConstants/SHOP.constant";

import { isWebview } from "./isWebview";
import { isNotWebViewURL } from "./bbcWVCallbacks";

export function WVCallbacks(url: string, newTabRedirect?: boolean) {
  const WV_PLATFORM = isWebview();

  if (WV_PLATFORM) {
    /* ANDROID - Same for all */
    if (WV_PLATFORM === "android") return (window as any).MobileApp.redirect(url);

    /* IOS */
    if (WV_PLATFORM === "ios") {
      if (SHOP.SITE_CODE === "bbc" && isNotWebViewURL()) {
        return (window as any).webkit.messageHandlers.MobileApp.postMessage(url);
      }
      return (location.href = url);
    }
  }

  if (newTabRedirect) return window.open(url, "_blank");

  return Router.push(url);
}
