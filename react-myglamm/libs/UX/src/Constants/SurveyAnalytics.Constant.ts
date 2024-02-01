import { SHOP } from "./SHOP.constant";

import { ADOBE } from "./Analytics.constant";

export const SURVEYLANDING_ANALYTICS = {
  default: {
    pageName: `web|${ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE]}|surveypage`,
    newPageName: "surveypage",
    subSection: ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE],
    assetType: "surveypage",
    newAssetType: ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE],
    platform: ADOBE.PLATFORM,
    pageLocation: "",
    technology: ADOBE.TECHNOLOGY,
  },
  v2: {
    pageName: `web|${SHOP.SITE_CODE}_product_survey|surveypage`,
    newPageName: `${SHOP.SITE_CODE}_product_survey landing page`,
    subSection: `${SHOP.SITE_CODE}_product_survey`,
    assetType: `${SHOP.SITE_CODE}_product_surveylandingpage`,
    newAssetType: `${SHOP.SITE_CODE}_product_survey`,
    platform: ADOBE.PLATFORM,
    pageLocation: "",
    technology: ADOBE.TECHNOLOGY,
  },
};

export const SURVEYTHANKYOU_ANALYTICS = {
  default: {
    pageName: `web|${ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE]}|surveythankyoupage`,
    newPageName: `survey thank you page`,
    subSection: ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE],
    assetType: `surveythankyou`,
    newAssetType: ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE],
    platform: ADOBE.PLATFORM,
    pageLocation: "",
    technology: ADOBE.TECHNOLOGY,
  },
  v2: {
    pageName: `web|${SHOP.SITE_CODE}_product_survey|surveythankyoupage`,
    newPageName: `${SHOP.SITE_CODE}_product_survey Thank You Page`,
    subSection: `${SHOP.SITE_CODE}_product_survey`,
    assetType: `${SHOP.SITE_CODE}_product_surveythankyou`,
    newAssetType: `${SHOP.SITE_CODE}_product_survey`,
    platform: ADOBE.PLATFORM,
    pageLocation: "",
    technology: ADOBE.TECHNOLOGY,
  },
};
