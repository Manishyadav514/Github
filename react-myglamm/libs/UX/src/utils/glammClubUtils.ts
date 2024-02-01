import MyGlammAPI from "@libAPI/MyGlammAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { formatPrice } from "./format/formatPrice";
import { setLocalStorageValue } from "./localStorage";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { getSessionStorageValue, setSessionStorageValue } from "./sessionStorage";

import { SLUG } from "@libConstants/Slug.constant";
import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

export const getTrialProductFromConfig = (productTag: any) => {
  const LOCALE_VENDOR_KEY = `${MyGlammAPI.LOCALE || "en-in"}-${MyGlammAPI.Filter.APIVendor}`;
  return globalThis.pcCache[LOCALE_VENDOR_KEY]?.productTags[productTag.replaceAll(".", "")];
};

export const checkMemberShipEligibility = (productMembershipArray: any, membershipLevelIndex: any, glammClubConfig: any) => {
  let productMemberShipIndexes: any[] = [];
  productMembershipArray?.length &&
    productMembershipArray.map((productMembershipText: string) => {
      const memberShipIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
        (membershipText: string) => membershipText === productMembershipText
      );
      productMemberShipIndexes.push(memberShipIndex);
    });
  return productMemberShipIndexes.some(el => el <= membershipLevelIndex);
};

export const getTrialProductPricing = (
  product: any,
  userProfile: any,
  glammClubConfig?: any,
  membershipLevelIndex?: any,
  unformattedPrice?: any,
  isCrossBrandTrial?: boolean
) => {
  const productMeta = product?.productMeta || product?.meta;
  const productTag = product?.productName || product?.productTag;
  if (
    ((userProfile && checkMemberShipEligibility(productMeta?.memberTypeLevel, membershipLevelIndex, glammClubConfig)) ||
      getSessionStorageValue(SESSIONSTORAGE.TEMP_TRIAL_PRICE) === product.productTag ||
      isCrossBrandTrial) &&
    getTrialProductFromConfig(productTag)?.offerPrice != undefined
  ) {
    if (getTrialProductFromConfig(productTag)?.offerPrice === 0) {
      return "Free";
    } else {
      return unformattedPrice
        ? formatPrice(getTrialProductFromConfig(productTag)?.offerPrice, false, false)
        : formatPrice(getTrialProductFromConfig(productTag)?.offerPrice, true);
    }
  }
  return unformattedPrice
    ? formatPrice(product?.priceOffer || product?.offerPrice, false, false)
    : formatPrice(product?.priceOffer || product?.offerPrice, true);
};

export const setTrialProductCouponFromConfig = (
  product: any,
  userProfile: any,
  glammClubConfig?: any,
  membershipLevelIndex?: any
) => {
  const productMeta = product?.productMeta || product?.meta;
  const productTag = product?.productName || product?.productTag;
  if (
    ((userProfile && checkMemberShipEligibility(productMeta?.memberTypeLevel, membershipLevelIndex, glammClubConfig)) ||
      getSessionStorageValue(SESSIONSTORAGE.TEMP_TRIAL_PRICE) === product.productTag) &&
    productMeta?.isTrial &&
    getTrialProductFromConfig(productTag)?.discountCode != undefined
  ) {
    setLocalStorageValue(LOCALSTORAGE.COUPON, getTrialProductFromConfig(productTag)?.discountCode);
    setSessionStorageValue(SESSIONSTORAGE.TRIAL_PRODUCT_SKU, product?.sku);
  }
};

export const calculateDiscountPercentage = (price: any, offerPrice: any) => {
  const freeOfferPrice = offerPrice === "Free" ? 0 : offerPrice;
  return [Math.round(((price - freeOfferPrice) / price) * 100).toString()];
};

export const getMembershipIcon = (membership: string, glammClubConfig: any) => {
  switch (membership) {
    case glammClubConfig?.glammClubMemberShipLevels[0] || "Glamm Star":
      return glammClubConfig?.starIconImgSrc || "";
    case glammClubConfig?.glammClubMemberShipLevels[1] || "Glamm VIP":
      return glammClubConfig?.vipIconImgSrc || "";
    case glammClubConfig?.glammClubMemberShipLevels[2] || "Glamm Legend":
      return glammClubConfig?.legendIconImgSrc || "";
    default:
      return glammClubConfig?.starIconImgSrc || "";
  }
};

export const getGlammClubWidgets = async () => {
  const widgetApi = new WidgetAPI();
  try {
    const { data } = await widgetApi.getHomeWidgets({ where: { slugOrId: SLUG().G3_GLAMM_CLUB_WIDGETS } }, 10, 0, false);
    return data?.data?.data?.widget || [];
  } catch {
    console.error("Error glamm club widget");
    return [];
  }
};

export const getShopForMoreAmount = (personalSales: any, nextMembershipThreshold: any) => {
  if (nextMembershipThreshold >= personalSales) {
    const amountToShop = nextMembershipThreshold - personalSales;
    if (typeof amountToShop === "number") return nextMembershipThreshold - personalSales;
  }
};
export const GLAMMCLUB_CONFIG = () => ({
  ...CONFIG_REDUCER?.configV3?.g3GlammClubConfig,
  ...CONFIG_REDUCER?.configV3?.glammClubConfigV2,
});
