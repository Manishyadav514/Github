import React, { useState } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { APIActions, PLPActions, SearchPLPStates, sortingType } from "@typesLib/PLP";

import useTranslation from "@libHooks/useTranslation";

import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";

import { searchSuggestionWebengageEvent } from "@libAnalytics/Search.Analytics";

import { extractFilterDataFromQuery, generateFilterAnalytics, getArrayOfTags } from "@libServices/PLP/filterHelperFunc";

import SortIcon from "../../../public/svg/sort.svg";
import FilterIcon from "../../../public/svg/filter.svg";
import useFilter from "@libHooks/useFilter";

const SortModal = dynamic(() => import(/* webpackChunkName: "SortModal" */ "@libComponents/PopupModal/SortModal"), {
  ssr: false,
});
const FilterModal = dynamic(() => import(/* webpackChunkName: "FilterModal" */ "@libComponents/PopupModal/FilterModal"), {
  ssr: false,
});

const FilterSortSearch = () => {
  const { query } = useRouter();

  const { t } = useTranslation();

  const [sortModal, setSortModal] = useState<boolean | undefined>();
  const [filterModal, setFilterModal] = useState<boolean | undefined>();
  const { adobeEventFilterSort } = useFilter();
  const { selectedTags, priceBucket } = extractFilterDataFromQuery(query);

  const [searchPLPSTATE, setSearchPLPSTATE] = useState<SearchPLPStates>({
    selectedTags,
    priceBucket,
    sorting: query.sort as sortingType,
    appliedFilters: { pricesApplied: priceBucket, brandsApplied: [], categoriesApplied: [] },
  });

  const onSortFilter = (sorting: sortingType, APIAction: APIActions) => {
    setSearchPLPSTATE({ ...searchPLPSTATE, sorting });
    setSortModal(false);

    SEARCH_STATE.products = APIAction.payload.updatedProductData as any;
    SEARCH_STATE.productsCount = APIAction?.payload?.count;

    adobeEventFilterSort("sort", "applied", "search", sorting || t("relevance") || "Relevance");

    searchSuggestionWebengageEvent(query.q as string, APIAction.payload?.count);
  };

  const onApplyFilters = (plpAction: PLPActions, APIAction: APIActions) => {
    setFilterModal(false);
    setSearchPLPSTATE({
      ...searchPLPSTATE,
      selectedTags: plpAction.payload?.updatedTags,
      priceBucket: plpAction.payload?.priceRange,
    });

    SEARCH_STATE.products = APIAction.payload.updatedProductData as any;
    SEARCH_STATE.productsCount = APIAction.payload?.count;
    SEARCH_STATE.noResults.show = !APIAction.payload?.count;

    const filterTag = getArrayOfTags(plpAction.payload?.updatedTags).join(",");
    const filterAna: string[] = generateFilterAnalytics({
      brandsApply: [],
      pricesApply: plpAction.payload?.priceRange,
      categoriesApply: [],
    });

    adobeEventFilterSort("filter", "applied", "search", [...filterAna, filterTag]);

    searchSuggestionWebengageEvent(query.q as string, APIAction.payload?.count);
  };

  return (
    <section className="flex px-3 gap-2 py-2">
      <button
        type="button"
        onClick={() => {
          (window as any).evars.evar18 = query.q;
          setFilterModal(true);
        }}
        className={`flex items-center justify-center font-semibold text-10 rounded h-8 w-1/2 ${
          Object.keys(searchPLPSTATE.selectedTags)?.length ? "bg-color1" : "bg-color2"
        }`}
      >
        <FilterIcon className="filter mr-2 mb-0.5" />
        {t("filter")}
      </button>

      <button
        type="button"
        onClick={() => setSortModal(true)}
        className={`flex items-center justify-center font-semibold text-10 rounded h-8 w-1/2 ${
          searchPLPSTATE.sorting ? "bg-color1" : "bg-color2"
        }`}
      >
        <SortIcon className="sort mr-2 mb-0.5" />
        {t("sort")}
      </button>

      {/* SORT MODAL */}
      {typeof sortModal === "boolean" && (
        <SortModal view={sortModal} onSortFilter={onSortFilter} relatedData={searchPLPSTATE} hide={() => setSortModal(false)} />
      )}

      {/* Filter Modal */}
      {typeof filterModal === "boolean" && (
        <FilterModal view={filterModal} PLPSTATE={searchPLPSTATE} apply={onApplyFilters} hide={() => setFilterModal(false)} />
      )}
    </section>
  );
};

export default FilterSortSearch;
