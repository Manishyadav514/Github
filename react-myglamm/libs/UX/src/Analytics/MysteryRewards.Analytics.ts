import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";

export const mysteryRewardPageLoad = () => {
  (window as any).digitalData = {
    common: {
      pageName: "web|good points |Mystery Reward Details",
      newPageName: "good points",
      subSection: "good points",
      assetType: "good points",
      newAssetType: "good points",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.PageLoad();
};

export const mysteryRewardPageLoadOnWinning = () => {
  (window as any).digitalData = {
    common: {
      pageName: "web|good points |Mystery Reward Details - winning reward",
      newPageName: "good points",
      subSection: "good points",
      assetType: "good points",
      newAssetType: "good points",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.PageLoad();
};

export const mysteryRewardCouponCopy = () => {
  (window as any).digitalData = {
    common: {
      linkName: `web|Mystery Reward Detail|winning reward|copy code`,
      linkPageName: "Mystery Reward Detail|winning reward|copy code",
      ctaName: "copy code",
      newLinkPageName: "Mystery Reward Detail|winning reward|copy code",
      subSection: "Mystery Reward Detail|winning reward|copy code",
      assetType: "Mystery reward redeem sucess",
      newAssetType: "Mystery reward redeem sucess",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const mysteryRewardPagePlaceOrder = () => {
  (window as any).digitalData = {
    common: {
      linkName: `web|Mystery Reward Detail|winning reward|place order`,
      linkPageName: "Mystery Reward Detail|winning reward|place order",
      ctaName: "place order",
      newLinkPageName: "Mystery Reward Detail|winning reward|place order",
      subSection: "Mystery Reward Detail|winning reward|place order",
      assetType: "Mystery reward redeem success",
      newAssetType: "Mystery reward redeem success",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const mysteryRewardDragComplete = (title: string) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|Mystery Reward Detail|winning reward|${title}`,
      linkPageName: `Mystery Reward Detail|winning reward|${title}`,
      ctaName: "logo slider",
      newLinkPageName: `Mystery Reward Detail|winning reward|${title}`,
      subSection: `Mystery Reward Detail|winning reward|${title}`,
      assetType: "Mystery Reward detail",
      newAssetType: "Mystery Reward detail",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};
