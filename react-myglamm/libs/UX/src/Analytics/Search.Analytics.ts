import { ADOBE } from "@libConstants/Analytics.constant";

import Adobe from "@libUtils/analytics/adobe";
import { GASearched } from "@libUtils/analytics/gtm";

import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";

/* Trigger on load of auto complete suggestion */
export const autoCompleteAdobeEvent = (searchTerm: any, count: number) => {
  (window as any).evars.evar86 = searchTerm;
  // count = event 113
  (window as any).digitalData = {
    common: {
      pageName: "web|search|search auto complete suggestion",
      newPageName: "search auto complete suggestion",
      subSection: "search",
      assetType: "search",
      newAssetType: "search",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
      count,
    },

    user: Adobe.getUserDetails(),
  };
  Adobe.PageLoad();
};

/* Trigger on load of search results  */
export const searchSuggestionAdobeEvent = (searchWord = "", count: any) => {
  /** searchType - manual/suggestions/selection
   * suggestion - user clicked on auto suggestion
   * selection - user clicked on recent or trending search button
   * manual - user manually entered search term
   */
  (window as any).digitalData = {
    common: {
      pageName: "web|search|search suggestion",
      newPageName: "search suggestion",
      subSection: ADOBE.ASSET_TYPE.SEARCH,
      assetType: ADOBE.ASSET_TYPE.SEARCH,
      newAssetType: ADOBE.ASSET_TYPE.SEARCH,
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    search: {
      searchTerm: searchWord,
      searchResult: `product-${count}`,
      searchType: SEARCH_STATE.searchType,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.PageLoad();
};

// #region // *WebEngage [23] - Searched : Prepare Function - Trigger on load of search results
export const searchSuggestionWebengageEvent = (searchWord = "", count: any) => {
  let boolResult = false;
  if (count > 0) {
    boolResult = true;
  }
  const isLoggedIn = localStorage.getItem("memberId");

  const webengageDataLayer = {
    keyword: searchWord || "",
    blogMatches: false,
    categoryMatches: false,
    lookMatches: false,
    productMatches: !!count,
    result: boolResult,
    userType: isLoggedIn ? "Member" : "Guest",
  };
  GASearched(webengageDataLayer);
  searchSuggestionAdobeEvent(searchWord, count);
};
// #endregion // WebEngage [23] - Searched : Prepare Function
