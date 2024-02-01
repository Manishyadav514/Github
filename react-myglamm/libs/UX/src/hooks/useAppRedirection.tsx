import { useRouter } from "next/router";

import { isWebview } from "@libUtils/isWebview";

/**
 * Webview - Redirection Android / IOS
 */
const useAppRedirection = () => {
  const router = useRouter();
  const { platform, block_redirect } = router.query;

  function redirect(url: string, blockWeb = false) {
    let URL = url;

    /* Attach locale for webview callback if not english-india */
    if (!url.includes(router.locale as string) && router.locale !== "en-in") {
      URL = `/${router.locale}${URL}`;
    }

    if (isWebview()) {
      const deviceType = platform || isWebview();

      if (deviceType === "android" && !block_redirect) {
        if (URL.includes("https://")) {
          (window as any).MobileApp.redirect(URL);
        } else {
          (window as any).MobileApp.redirect(`${window.location.origin}${URL}`);
        }
      } else if (deviceType === "ios") {
        if (URL.includes("https://")) {
          window.location.href = URL;
        } else {
          window.location.href = `${window.location.origin}${URL}`;
        }
      } else if (!blockWeb) {
        router.push(url);
      }
    } else if (!blockWeb) {
      router.push(url);
    }
  }

  return { redirect };
};

export default useAppRedirection;
