import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";

export const partnershipCouponPopupOnLoad = (title: string, type: string) => {
  (window as any).digitalData = {
    common: {
      pageName: `web|${title}|add coupon`,
      newPageName: "add coupon",
      subSection: "add coupon",
      assetType: `${type}`,
      newAssetType: `${type}`,
      platform: ADOBE.PLATFORM,
      pageLocation: "",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.PageLoad();
};

export const partnershipCouponOnSuccess = (title: string, type: string) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|${title}|add coupon`,
      linkPageName: `add coupon`,
      ctaName: "add coupon success",
      newLinkPageName: "add coupon",
      subSection: "add coupon",
      assetType: `${type}`,
      newAssetType: "mobile website",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const partnershipCouponOnFailure = (title: string, type: string) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|${title}|add coupon`,
      linkPageName: `add coupon`,
      ctaName: "add coupon failure",
      newLinkPageName: "add coupon",
      subSection: "add coupon",
      assetType: `${type}`,
      newAssetType: "mobile website",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const partnershipCouponOnModalClosed = (title: string, type: String) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|${title}|add coupon`,
      linkPageName: `add coupon`,
      ctaName: "add coupon popup closed",
      newLinkPageName: "add coupon popup closed",
      subSection: "add coupon popup closed",
      assetType: `${type}`,
      newAssetType: "mobile website",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};
