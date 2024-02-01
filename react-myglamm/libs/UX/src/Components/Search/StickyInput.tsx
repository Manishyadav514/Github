import React, { Fragment, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
import { useSnapshot } from "valtio";
import useTranslation from "@libHooks/useTranslation";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";
import { SEARCH_STATE, TOTAL_PRODUCTS_TO_FETCH_PER_CALL } from "@libStore/valtio/SEARCH.store";
import SearchAPI from "@libAPI/apis/SearchAPI";
import { sortingType } from "@typesLib/PLP";
import { changeURL, convertPriceRange, scrollTop } from "@libUtils/searchUtils";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { autoCompleteAdobeEvent, searchSuggestionWebengageEvent } from "@libAnalytics/Search.Analytics";
import { extractFilterDataFromQuery, generateWhereForProduct } from "@libServices/PLP/filterHelperFunc";
import SearchSuggestion from "./SearchSuggestion";
import BackIcon from "../../../public/svg/backicon.svg";
import CloseIcon from "../../../public/svg/ic_close.svg";
import CartIcon from "../../../public/svg/carticon.svg";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import Link from "next/link";
import { GA4Event } from "@libUtils/analytics/gtm";

const StickyInput = () => {
  const { t } = useTranslation();

  const searchRef = useRef<any>();
  const snap = useSnapshot(SEARCH_STATE);

  const router = useRouter();

  let { q, category, priceRange, sort } = router.query;

  const productCount = useSelector((store: ValtioStore) => store.cartReducer.cart.productCount);

  useEffect(() => {
    if (searchRef.current.value !== snap.input.value) {
      searchRef.current.value = snap.input.value;
    }
  }, [snap.input.value]);

  useEffect(() => {
    if (SEARCH_STATE.products?.length === 0) {
      searchRef.current.focus();
    }

    /* On Mount load product only if search query is there */
    if ((SEARCH_STATE.products?.length === 0 && q) || (q && q !== snap.input.value)) {
      refreshSearch();
    }
  }, []);

  /* After first render only check if search query changes and manage accordingly */
  useEffectAfterRender(() => {
    // if any kind of filter is applied then don't refresh
    if (!category && !priceRange && !sort) {
      GA4Event([
        {
          event: "search",
          ecommerce: {
            search_term: q,
          },
        },
      ]);
      refreshSearch();
    }
  }, [router.asPath]);

  const handleSuggestionsResult = (suggestionResult: any) => {
    let suggestions: any = [];
    if (suggestionResult?.data?.data.length > 0) {
      suggestions = suggestionResult?.data?.data || [];
    }
    SEARCH_STATE.suggestions = suggestions;
    SEARCH_STATE.showOverlay = true;

    /* Call to auto search adobe event */
    autoCompleteAdobeEvent(q, suggestions.length);
  };

  const getSuggestions = (q: string) => {
    const searchApi = new SearchAPI();
    searchApi.searchAutocomplete(q).then(({ data: suggestionResult }) => {
      handleSuggestionsResult(suggestionResult);
    });
  };

  const handleSuggestions = (q: any) => {
    if (!q.length) {
      SEARCH_STATE.noResults.show = false;
    } else if (q.length > 2) {
      /* Based on Flag go for Autosuggest flow otherwise fallback to manual */
      if (SHOP.ENABLE_AUTOSUGGEST) getSuggestions(q);
      else onClickSuggestion(q, "manual");
    } else {
      SEARCH_STATE.suggestions = [];
    }
  };

  // used to refresh search results by router query updates
  const refreshSearch = () => {
    if (!q) return reset();

    let _q = q?.toString();
    if (_q && _q.trim()) {
      SEARCH_STATE.input.value = _q;
      search({
        q: _q,
        actualQuery: searchRef.current.value,
      });
    }
  };

  const reset = () => {
    SEARCH_STATE.noResults.show = false;
    SEARCH_STATE.input.value = "";
    SEARCH_STATE.suggestions = [];
    SEARCH_STATE.showOverlay = false;
    SEARCH_STATE.products = [];
    window.requestAnimationFrame(scrollTop);
  };

  // on search input change event with debounce.
  const onSearchInputChange = debounce((e: any) => {
    const text = e.target.value;
    SEARCH_STATE.input.value = text;
    if (e.key === "Enter") {
      SEARCH_STATE.searchType = "manual";
      changeURL(text);
      SEARCH_STATE.suggestions = [];
      SEARCH_STATE.showOverlay = false;
    } else {
      handleSuggestions(text.trim());
    }
  }, 300);

  // on click clear icon
  const onClearSearch = () => {
    reset();
    // update router URL.
    router.push(
      {
        pathname: "/search",
      },
      undefined,
      { shallow: true }
    );
    searchRef.current.focus();
  };

  const search = ({ q, actualQuery, successCallback }: any, searchData?: any) => {
    const searchApi = new SearchAPI();
    SEARCH_STATE.blurOverlay = true;
    SEARCH_STATE.suggestions = [];
    SEARCH_STATE.searchResultsFor = searchData?.userInputText || q;

    /* InCase any filter is applied on search on load */
    let filterWhere: any = {};
    if (category || priceRange || sort) {
      const { selectedTags, priceBucket } = extractFilterDataFromQuery(router.query);
      filterWhere = generateWhereForProduct(selectedTags, "", undefined, sort as sortingType, priceBucket);
    }

    const order = searchData?.order || searchData?.sort;

    if (searchData?.where || order) {
      const where = searchData?.where;
      filterWhere = { ...(where && { where }), ...(order && { order }) };
    }

    searchApi
      .getSearchProduct(q, 0, TOTAL_PRODUCTS_TO_FETCH_PER_CALL, false, snap.variantName, filterWhere)
      .then(({ data: searchResult }) => {
        if (searchResult.data.data.length > 0) {
          if (successCallback) successCallback();
          const searchInput = searchData?.userInputText || q;
          SEARCH_STATE.products = searchResult.data.data;
          SEARCH_STATE.productsCount = searchResult?.data?.count;
          SEARCH_STATE.searchResultsFor = searchInput;
          const searchQueriesLocal = getLocalStorageValue(LOCALSTORAGE.SEARCHQUERIES, true);
          if (Array.isArray(searchQueriesLocal) && searchQueriesLocal.length >= (t("searchConfig")?.recentSearchLimit || 6)) {
            searchQueriesLocal.pop();
          }
          let uniqueQuery = searchQueriesLocal;
          const updatedQuery = actualQuery?.trim()?.toLowerCase()?.split(/[, ]+/)?.join(" ");
          if (!uniqueQuery?.some((obj: any) => obj.query === updatedQuery)) {
            uniqueQuery = [{ imgURL: searchResult.data.data?.[0]?.imageURL, query: updatedQuery }, ...(uniqueQuery || [])];
          }
          SEARCH_STATE.recentSearches = Array.from(uniqueQuery).filter((obj: any) => Boolean(obj.imgURL) && Boolean(obj.query)); // remove items from array if imgURL or query have invalid data
          setLocalStorageValue(LOCALSTORAGE.SEARCHQUERIES, SEARCH_STATE.recentSearches, true);
          searchSuggestionWebengageEvent(searchInput, searchResult?.data?.count);
        } else {
          SEARCH_STATE.products = []; // clear previous search query products if exists.
          SEARCH_STATE.productsCount = 0;
          SEARCH_STATE.noResults.show = true;
        }
        SEARCH_STATE.showOverlay = false;
        SEARCH_STATE.blurOverlay = false;
        window.requestAnimationFrame(scrollTop);
      });
  };

  // on click of search suggestion text
  const onClickSuggestion = (s: string, type = "suggestions", searchData?: any) => {
    SEARCH_STATE.input.value = s;
    SEARCH_STATE.searchType = type;
    if (searchData?.action?.toLowerCase()) return handleSearchAction(searchData);
    changeURL(s);
    search({
      q: s,
      actualQuery: searchRef.current.value,
    });
  };

  // on click of search suggestions arrow click
  const onClickArrowIcon = (s: any) => {
    SEARCH_STATE.input.value = s;
    handleSuggestions(s.trim());
    searchRef.current.focus(); // get focus back on search input
  };

  const handleSearchAction = (searchData: any) => {
    if (searchData?.action?.toLowerCase() === "search") {
      const priceBucket = convertPriceRange(searchData?.where?.or);
      const sort = searchData?.order?.[0] || searchData?.sort?.[0];
      router.push(
        {
          pathname: "/search",
          query: {
            q: searchData?.searchText,
            tab: "PRODUCTS",
            ...(priceBucket && { priceRange: priceBucket }),
            ...(sort && { sort }),
          },
        },
        undefined,
        { shallow: true }
      );
      search(
        {
          q: searchData?.searchText,
          actualQuery: searchRef.current.value,
        },
        searchData
      );
    } else if (searchData?.action?.toLowerCase() === "products" || searchData?.action?.toLowerCase() === "collection") {
      router.push(searchData?.slug);
    } else if (searchData?.action?.toLowerCase() === "category") {
      const priceBucket = convertPriceRange(searchData?.where?.or);
      const sort = searchData?.order?.[0] || searchData?.sort?.[0];
      router.push({
        pathname: searchData?.slug,
        query: {
          ...(priceBucket && { priceRange: priceBucket }),
          ...(sort && { sort }),
        },
      });
    }
    return;
  };

  return (
    <Fragment>
      <div className="flex bg-white content-center justify-between px-1 py-2 border-b border-color1">
        <div className="flex items-center w-full relative">
          <button
            className="h-10 w-14 flex items-center justify-center outline-none"
            type="button"
            aria-label="Previous Page"
            onClick={router.back}
          >
            <BackIcon role="img" aria-labelledby="back" title="back" />
          </button>
          <input
            type="text"
            ref={searchRef}
            placeholder={t("searchHere")}
            onKeyDown={onSearchInputChange}
            style={{ caretColor: "var(--color1)" }}
            className="h-10 text w-full bg-transparent outline-none py-2 pl-1 pr-8"
            role="textbox"
            aria-label="search for your favourite products"
          />
          {SEARCH_STATE.input.value && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClearSearch}
              className={`p-2 absolute inset-y-0 my-auto ${productCount > 0 ? "right-10" : "right-1"}`}
            >
              <CloseIcon role="img" aria-labelledby="clear search" title="clear search" />
            </button>
          )}
          {productCount > 0 && (
            <Link href="/shopping-bag" legacyBehavior>
              <button type="button" aria-label="Close" className="p-3 inset-y-0 my-auto">
                <CartIcon role="img" aria-labelledby="cart" />
                <div className="absolute w-5 h-5 text-xs font-bold flex justify-center items-center rounded-full text-white bg-color1 top-1 right-2">
                  {productCount}
                </div>
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="z-20 absolute w-full">
        {snap.suggestions.map((searchData: any, i: number) => {
          if (!searchData?.userInputText) return null;
          const searchText = searchData?.userInputText;
          return (
            <SearchSuggestion
              value={searchText}
              key={`suggestion-${searchText}-${i}`}
              onClick={() => onClickSuggestion(searchText, "suggestions", searchData)}
              onClickArrowIcon={() => onClickArrowIcon(searchText)}
              imageUrl={searchData?.imageurl}
            />
          );
        })}
      </div>
    </Fragment>
  );
};

export default StickyInput;
