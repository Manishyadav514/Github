import { getLocalStorageValue } from "@libUtils/localStorage";

import { SLUG } from "@libConstants/Slug.constant";
import { LOCALSTORAGE, XTOKEN } from "@libConstants/Storage.constant";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";
import { getCountryCode, getLanguageCode, getVendorCode } from "@libUtils/getAPIParams";
import { getMCVID } from "@libUtils/getMCVID";
import { getClientQueryParam } from "@libUtils/_apputils";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";

export function checkUserLoginStatus() {
  try {
    const xtoken = getLocalStorageValue(XTOKEN());
    const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);

    if (xtoken && memberId) {
      return { memberId, xtoken };
    }
    return undefined;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export function getCartIdentifier() {
  const cartId = getLocalStorageValue(LOCALSTORAGE.CARTID);
  const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);

  if (cartId) return cartId;

  if (memberId) return memberId;

  return undefined;
}

export const getBottomNavSlug = () => {
  if (IS_DUMMY_VENDOR_CODE()) return SLUG().DUMMY_BOTTOM_NAV;

  return SLUG().BOTTOM_NAV;
};

export function getIgnoredCoupon(checkoutPages = true) {
  const ignoreDiscountCode = getLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT);

  if (checkoutPages && ignoreDiscountCode) {
    return JSON.parse(ignoreDiscountCode || "[]");
  }

  return undefined;
}

export function getCouponandPoints() {
  const coupon = getLocalStorageValue(LOCALSTORAGE.COUPON) || undefined;
  const gp = parseInt(getLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS) || "0", 10) || undefined;

  return { coupon, gp };
}

export const customSkinData = (data: any) => {
  return {
    Texture: {
      name: "Texture",
      score: data.texture,
    },
    Acne: {
      name: "Acne",
      score: data.acne,
    },
    Spots: {
      name: "Spots",
      score: data.ageSpots,
    },
    Oiliness: {
      name: "Oiliness",
      score: data.oiliness,
    },
    Moisturiser: {
      name: "Moisturiser",
      score: data.moisture,
    },
    Wrinkles: {
      name: "Wrinkles",
      score: data.wrinkles,
    },
    "Dark Circle": {
      name: "Dark Circle",
      score: data.darkCircles,
    },
    SkinHealth: {
      name: "SkinHealth",
      score: data.skinHealth,
    },
    Timed: {
      name: "Timed",
      score: data.timed,
    },
    "Tanned Skin": {
      name: "Tanned Skin",
      score: data.texture,
    },
    Pigmentation: {
      name: "Pigmentation",
      score: data.ageSpots,
    },
    Ageing: {
      name: "Ageing",
      score: data.wrinkles,
    },
  };
};

export const generateSkinAnaData = (configSAData: any, localData: any, timeUTC: string) => {
  let result: any = [];
  configSAData?.forEach((item: any) => {
    if (item.name === localData?.[item.name]?.name) {
      result.push({
        name: item.name || "",
        score: localData[item.name]?.score,
        scoreScale10: Math.trunc(localData[item.name]?.score / 10),
      });
    }
  });

  return {
    country: getCountryCode() || "",
    language: getLanguageCode() || "",
    vendorCode: getVendorCode() || "",
    identifier: checkUserLoginStatus()?.memberId || "",
    key: "skinAnalyzer",
    value: {
      skinAnalyzerSlug: "app-skin-analyzer-primary",
      action: "face_scan",
      scores: result,
      adobeMCVID: getMCVID() || "",
      userId: checkUserLoginStatus()?.memberId || "",
      guestUser: checkUserLoginStatus() ? false : true,
      deviceType: "mobile_website",
      userAgent: (typeof window !== "undefined" && window?.navigator?.userAgent) || "",
      utms: {
        utm_source: getClientQueryParam("utm_source") || "",
        utm_medium: getClientQueryParam("utm_medium") || "",
        utm_campaign: getClientQueryParam("utm_campaign") || "",
        utm_term: getClientQueryParam("utm_term") || "",
        utm_content: getClientQueryParam("utm_content") || "",
      },
      scanTimeUTC: timeUTC,
    },
  };
};

export const skinAnalyserHomeAnalytics = () => {
  const SkinAnalysisData = sessionStorage.getItem(LOCALSTORAGE.SKIN_ANALYSER_RESULTS);
  if (!SkinAnalysisData) {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|Skin Analyser|Landing Page",
        newPageName: "Skin Analyser Landing Page",
        subSection: "Skin Analyser Landing Product Page",
        assetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        newAssetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  } else {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|Skin Analyser|Repeat User - Landing Page",
        newPageName: "Skin Analyser Repeat User - Landing Page",
        subSection: "Skin Analyser Repeat User - Landing Product Page",
        assetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        newAssetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }
};
