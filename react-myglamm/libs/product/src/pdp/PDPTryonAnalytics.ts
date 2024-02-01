import Adobe from "@libUtils/analytics/adobe";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

/* Onload events /*

/*  On Tryon page load - event49*/
export const adobeTryonPageLoad = (category: string, subCategory: string, pageLocation: string) => {
  const digitalData = {
    common: {
      pageName: "web|product-tryon",
      newPageName: "tryon",
      subSection: `${category} - ${subCategory}`,
      assetType: "",
      newAssetType: "product-tryon",
      platform: ADOBE.PLATFORM,
      pageLocation: pageLocation,
      technology: ADOBE.TECHNOLOGY,
    },
    user: Adobe.getUserDetails(),
  };
  ADOBE_REDUCER.adobePageLoadData = digitalData;
};

/* _______ */

/* Onclick events */

/* Add a trigger on click of try on - event41*/
export const adobeOnTryonBtnClick = (category: string, subCategory: string, pageLocation: string) => {
  let newLinkPageName;
  if (pageLocation === "category") {
    newLinkPageName = "product listing page";
  } else if (pageLocation === "pdp") {
    newLinkPageName = "product description page";
  } else if (pageLocation === "collection") {
    newLinkPageName = "collection page";
  }

  (window as any).digitalData = {
    common: {
      linkName: "web|try on",
      linkPageName: "web|try on",
      ctaName: "tryon",
      newLinkPageName,
      subSection: `${category} - ${subCategory}`,
      assetType: "",
      newAssetType: "tryon",
      pageLocation: pageLocation,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

/* Add trigger when error occured while using tryon - event51 */
export const adobeOnTryonError = (category: string, subCategory: string, pageLocation: string) => {
  let newLinkPageName;
  if (pageLocation === "plp") {
    newLinkPageName = "product listing page";
  } else if (pageLocation === "pdp") {
    newLinkPageName = "product description page";
  } else if (pageLocation === "collection") {
    newLinkPageName = "collection page";
  }

  (window as any).digitalData = {
    common: {
      linkName: "",
      linkPageName: "",
      ctaName: "error-tryon",
      newLinkPageName: "product-tryon",
      subSection: `${category} - ${subCategory}`,
      assetType: "",
      newAssetType: "tryon",
      pageLocation: pageLocation,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

/* Add trigger when users clicks on upload image */
export const adobeUploadImageonTryon = (pageLocation: string) => {
  (window as any).digitalData = {
    common: {
      linkName: "web|product-tryon|upload image",
      linkPageName: "upload image",
      ctaName: "upload image",
      newLinkPageName: "product-tryon",
      assetType: "product-tryon",
      newAssetType: "product-tryon",
      subSection: "product-tryon",
      pageLocation: pageLocation,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

/* Add trigger when users clicks on download icon */
export const adobeTryonDownloadClick = (pageLocation: string) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|product-tryon|download image`,
      linkPageName: "download image",
      ctaName: `download image`,
      newLinkPageName: "product-tryon",
      subSection: "product-tryon",
      assetType: "product-tryon",
      newAssetType: "product-tryon",
      pageLocation: pageLocation,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

/* Add trigger when users clicks on split view */
export const adobeTryonSplitViewClick = (pageLocation: string) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|product-tryon|split view`,
      linkPageName: "split-view",
      ctaName: `split-view`,
      newLinkPageName: "product-tryon",
      subSection: "product-tryon",
      assetType: "product-tryon",
      newAssetType: "product-tryon",
      pageLocation: pageLocation,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

/* Add trigger when users clicks on shade change */
export const adobeTriggerOnShadeChange = (pageLocation: string) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|product-tryon|shade change`,
      linkPageName: "shade change",
      ctaName: `shade change`,
      newLinkPageName: "product-tryon",
      subSection: "product-tryon",
      assetType: "product-tryon",
      newAssetType: "product-tryon",
      pageLocation: pageLocation,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

/* Add trigger on click of buy now button - tryon page - scAdd,event41 */
// export const adobeOnBuyNowClick = (categoryDetails: any, pageLocation: string) => {
//   const category = categoryDetails?.ddlChildCategory;
//   const subCategory = categoryDetails?.ddlSubChildCategory;
//   (window as any).digitalData = {
//     common: {
//       linkName: "",
//       linkPageName: "",
//       ctaName: "buy now-tryon",
//       newLinkPageName: "product-tryon",
//       subSection: `${category} - ${subCategory}`,
//       assetType: "",
//       newAssetType: "tryon",
//       pageLocation: pageLocation,
//     },
//     user: Adobe.getUserDetails(),
//   };
//   Adobe.Click();
// };
