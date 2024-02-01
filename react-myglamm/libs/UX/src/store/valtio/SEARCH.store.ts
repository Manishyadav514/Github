import { proxy } from "valtio";

import { SHOP } from "@libConstants/SHOP.constant";

import { getLocalStorageValue } from "@libUtils/localStorage";

export const SEARCH_STATE = proxy({
  scrollPosition: 0,
  products: [],
  productsCount: 0,
  showOverlay: false,
  blurOverlay: false,
  suggestions: [],
  searchResultsFor: "",
  widgets: [],
  isRecentSearchesLoaded: false,
  isWidgetsLoaded: false,
  recentSearches: getLocalStorageValue("searchQueries", true) || [],
  input: {
    value: "",
  },
  noResults: {
    show: false,
    products: [],
    banner: <any>{},
  },
  searchType: "manual",
  variantName: SHOP.ENABLE_BOOSTING_ALGO ? "boosting" : "",
});

export const TOTAL_PRODUCTS_TO_FETCH_PER_CALL = 20;
