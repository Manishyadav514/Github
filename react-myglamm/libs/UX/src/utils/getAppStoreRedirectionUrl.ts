import { SHOP } from "@libConstants/SHOP.constant";

/**
 * Retuns App store redirection based on the identifier
 * @param shortUrl - URL identifier
 */
export function getAppStoreRedirectionUrl(shortUrl: string, tracking: string = "", discountCode: any = "") {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent || navigator.platform || navigator.vendor : "";
  let platform = "";

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    platform = "Windows Phone";
  }
  if (/android/i.test(userAgent)) {
    platform = "Android";
  }
  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    platform = "iOS";
  }

  switch (platform) {
    case "iOS": {
      return `${shortUrl}?${discountCode && `discountCode=${discountCode}&`}${
        tracking && `~channel=${tracking}&`
      }$ios_url=${encodeURIComponent(appUrls[platform][SHOP.SITE_CODE])}`;
    }
    case "Android": {
      return `${shortUrl}?${discountCode && `discountCode=${discountCode}&`}${
        tracking && `~channel=${tracking}&`
      }$android_url=${encodeURIComponent(appUrls[platform][SHOP.SITE_CODE])}`;
    }
    default: {
      return shortUrl;
    }
  }
}

export const appUrls: any = {
  iOS: {
    mgp: "https://apps.apple.com/in/app/myglamm-beauty-shopping-app/id1282962703",
    popxo: "",
    bbc: "https://apps.apple.com/in/app/babychakra-pregnancy-baby-app/id1299615848",
    stb: "https://apps.apple.com/in/app/st-botanica-hair-skin-care/id1616719164",
    tmc: "https://apps.apple.com/in/app/the-moms-co-skin-care-shop/id1623764108",
    orh: "https://apps.apple.com/in/app/organic-harvest-beauty-shop/id1625099447",
    srn: "https://apps.apple.com/in/app/sirona-puberty-to-menopause/id1621656960",
  },
  Android: {
    mgp: "https://play.google.com/store/apps/details?id=com.myglamm.ecommerce",
    popxo: "",
    bbc: "https://play.google.com/store/apps/details?id=app.babychakra.babychakra",
    stb: "https://play.google.com/store/apps/details?id=com.stbotanica.ecommerce",
    tmc: "https://play.google.com/store/apps/details?id=com.themomsco",
    orh: "https://play.google.com/store/apps/details?id=com.organicharvest",
    srn: "https://play.google.com/store/apps/details?id=com.thesirona",
  },
};
