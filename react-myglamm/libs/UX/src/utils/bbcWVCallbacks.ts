import { SHOP } from "@libConstants/SHOP.constant";

import { isWebview } from "./isWebview";

export const isNotWebViewURL = () => !location.href.includes("request_source=mobile_app");

export function bbcActionCallback(key: string, json: any) {
  try {
    const WV_PLATFORM = isWebview();
    if (SHOP.SITE_CODE === "bbc" && WV_PLATFORM && isNotWebViewURL()) {
      /* ANDROID */
      if (WV_PLATFORM === "android") (window as any).app.sendActionCallback(key, JSON.stringify(json));
      /* IOS */ else
        (window as any).webkit.messageHandlers.sendActionCallback.postMessage({ action: key, data: JSON.stringify(json) });
    }
  } catch (err) {
    console.error(err);
  }
}

export function bbcEventCallback(key: string, json: any) {
  try {
    const WV_PLATFORM = isWebview();
    if (SHOP.SITE_CODE === "bbc" && WV_PLATFORM && isNotWebViewURL()) {
      /* ANDROID */
      if (WV_PLATFORM === "android") (window as any).app.sendAnalyticsEventV2(key, JSON.stringify(json));
      /* IOS */ else
        (window as any).webkit.messageHandlers.sendAnalyticsEventV2.postMessage({
          eventName: key,
          eventProperties: JSON.stringify(json),
        });
    }
  } catch (err) {
    console.error(err);
  }
}

export function bbcUrlCallback(url: string) {
  try {
    const WV_PLATFORM = isWebview();
    if (SHOP.SITE_CODE === "bbc" && WV_PLATFORM && isNotWebViewURL()) {
      /* ANDROID */
      if (WV_PLATFORM === "android") (window as any).MobileApp.redirect(url);
      /* IOS */ else (window as any).webkit.messageHandlers.MobileApp.postMessage(url);
    }
  } catch (err) {
    console.error(err);
  }
}
