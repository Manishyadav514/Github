import uniq from "lodash.uniq";

import { APIActions, APIStates, PLPActions, PLPStates } from "@typesLib/PLP";

import { convertToTwoDimensional, getSelectedBrands } from "./filterHelperFunc";
import { PLP_STATE } from "@libStore/valtio/PLP.store";

export const handlePLPActions = (state: PLPStates, action: PLPActions) => {
  const { type, payload } = action;

  switch (type) {
    case "CHANGE_TAB":
      window.scrollTo(0, 0);

      return {
        ...state,
        skip: 10,
        priceBucket: [],
        selectedTags: {},
        hasNextPage: true,
        sorting: undefined,
        activeTab: payload.activeIndex,
        page: 1,
        appliedFilters: {
          pricesApplied: [],
          brandsApplied: [],
          categoriesApplied: [],
        },
      };

    case "APPLY_FILTER": {
      window.scrollTo(0, 0);
      let activeTabIndex = state.activeTab;
      const tagSlugs = Object.keys(payload.updatedTags);
      const indexOfSlug = state.navTabs.findIndex(x => x.url === tagSlugs[0]);

      // avoid redirection in new filter component
      if (PLP_STATE.newFilterVariant != "1") {
        /* multipleTags or only brands or tags and brands then reset === In-case of ALL-tab reset the Navtabs and Filter */
        const haveSelectedBrand = !!getSelectedBrands(payload.brandsList)?.length;
        if (tagSlugs.length > 1 || (haveSelectedBrand && !tagSlugs.length) || (tagSlugs.length === 1 && haveSelectedBrand)) {
          activeTabIndex = 0;
        } else if (tagSlugs.length === 1 && indexOfSlug !== -1) {
          /* In-case of single category tags redirect to that Tab if Available in DOM */
          activeTabIndex = indexOfSlug;
        }
      }
      return {
        ...state,
        skip: 10,
        hasNextPage: true,
        sorting: undefined,
        selectedTags: payload.updatedTags,
        activeTab: activeTabIndex,
        page: 1,
        priceBucket: payload.priceRange || [],
        selectedBrands: payload.selectedBrands || [],
        appliedFilters: {
          pricesApplied: payload.priceRange || [],
          brandsApplied: payload.selectedBrands || [],
          categoriesApplied: payload.categoriesSelected || [],
        },
      };
    }

    case "SORT_PRODUCTS":
      window.scrollTo(0, 0);
      return { ...state, skip: 10, sorting: payload };

    case "GET_MORE_PRODUCTS":
      if (payload) {
        /* Payload Available - then keep getmore Call Active */
        return { ...state, hasNextPage: true, skip: state.skip + 10 };
      }
      /* Stop Call for getmore products */
      return { ...state, skip: 10, hasNextPage: false };

    case "CHANGE_PAGE":
      return { ...state, page: payload };

    case "SSR_CHANGE":
      return payload;

    default:
      return state;
  }
};

export const handleAPIActions = (state: APIStates, action: APIActions): APIStates => {
  const { type, payload } = action;
  const { updatedProductData, count } = payload || {};

  PLP_STATE.products = updatedProductData?.length ? (uniq(updatedProductData) as []) : [];
  PLP_STATE.productCount = count;

  switch (type) {
    case "NORMAL_STORE_DATA":
      return {
        ...state,
        productCount: count,
        products: updatedProductData.length ? uniq(updatedProductData) : [],
      };

    case "MORE_PRODUCTS": {
      return {
        ...state,
        products: uniq([...updatedProductData]),
      };
    }
    case "SSR_CHANGE":
      //@ts-ignore
      return payload;

    default:
      return state;
  }
};
