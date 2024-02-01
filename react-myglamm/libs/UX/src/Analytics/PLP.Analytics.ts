import Adobe from "@libUtils/analytics/adobe";

import { ADOBE } from "@libConstants/Analytics.constant";

/**
 * Handle Analytics - Page Load and Click Event
 */
export const adobeClickEvent = (event: string, catName: string) => {
  (window as any).digitalData = {
    ...(window as any).digitalData,
    common: {
      assetType: "filters",
      ctaName: `filter ${event}`,
      linkName: `web|${catName.toLowerCase()}|filter ${event}`,
      linkPageName: `web|${catName.toLowerCase()}|filters`,
      newAssetType: "filters",
      newLinkPageName: "filters",
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      subSection: "filter",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

// Adobe Analytics[2.1] - Click Page Load - Category PLP and Webengage[4.1] - Category Viewed
export const adobePageLoadEvent = (event: string, catName: string) => {
  (window as any).digitalData = {
    ...(window as any).digitalData,
    common: {
      pageName: `web|${catName.toLowerCase()}|${event}`,
      newPageName: "product listing",
      subSection: catName.toLowerCase(),
      assetType: "category",
      newAssetType: "category",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    user: Adobe.getUserDetails(),
  };

  Adobe.PageLoad();
};
