import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import Adobe from "@libUtils/analytics/adobe";

export function adobeSelectAddressPageLoad() {
  ADOBE_REDUCER.adobePageLoadData = {
    common: {
      pageName: "web|order checkout|change address",
      newPageName: "order checkout - change address",
      subSection: "order checkout step2",
      assetType: ADOBE.ASSET_TYPE.CHECKOUT_ADDRESS,
      newAssetType: ADOBE.ASSET_TYPE.CHECKOUT_ADDRESS,
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
  };
}

export function adobeAddressSelectedClick() {
  (window as any).digitalData = {
    common: {
      assetType: "checkout",
      ctaName: "address select",
      linkName: "web|checkout address|select address",
      linkPageName: `web|checkout address`,
      newAssetType: "checkout",
      newLinkPageName: "checkout address",
      pageLocation: "",
      platform: "desktop website",
      subSection: "checkout address",
    },
    user: Adobe.getUserDetails(),
  };

  Adobe.Click();
}

export function adobeAddressPageLoad(isAddAddress: boolean) {
  const type = isAddAddress ? "add" : "edit";

  ADOBE_REDUCER.adobePageLoadData = {
    common: {
      pageName: `web|order checkout|${type} address`,
      newPageName: `order checkout - ${type} address`,
      subSection: "order checkout step2",
      assetType: ADOBE.ASSET_TYPE.CHECKOUT_ADDRESS,
      newAssetType: ADOBE.ASSET_TYPE.CHECKOUT_ADDRESS,
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
  };
}
