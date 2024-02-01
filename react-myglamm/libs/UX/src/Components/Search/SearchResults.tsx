import React, { useEffect, useRef } from "react";

import { useSnapshot } from "valtio";
import { useRouter } from "next/router";
import { useThrottledCallback } from "use-debounce";

import SearchAPI from "@libAPI/apis/SearchAPI";

import { sortingType } from "@typesLib/PLP";

import { chunkIt, getNumbersSeriesRange } from "@libUtils/searchUtils";

import { SEARCH_STATE, TOTAL_PRODUCTS_TO_FETCH_PER_CALL } from "@libStore/valtio/SEARCH.store";

import { extractFilterDataFromQuery, generateWhereForProduct } from "@libServices/PLP/filterHelperFunc";

import SearchFooter from "./SearchFooter";
import VirtualListItemPair from "./VirtualListItemPair";
import { useInfiniteScrollGA4Event } from "@libHooks/useInfiniteScrollGA4Event";

const SearchResults = () => {
  const snap = useSnapshot(SEARCH_STATE);
  const ref: any = useRef({});

  const router = useRouter();
  const { category, priceRange, sort } = router.query;

  const updatePosition = () => {
    SEARCH_STATE.scrollPosition = window.pageYOffset;
  };

  const scrollHandler = useThrottledCallback(updatePosition, 100);

  // @ts-ignore TODO
  const productChunks: any = chunkIt(snap.products, 2);
  const _diff = snap.productsCount - snap.products.length;

  const emptyChunks = chunkIt(Array(_diff < 0 ? 0 : _diff).fill({ placeholder: true }), 2);
  const chunks = productChunks.concat(emptyChunks);

  const ranges = getNumbersSeriesRange(0, snap.productsCount, TOTAL_PRODUCTS_TO_FETCH_PER_CALL);
  useInfiniteScrollGA4Event(
    snap.products.filter((p: any) => !!p.SKU) // skip widgets
  );

  // fetch more search results - lazy
  const fetchMore = () => {
    /* InCase any filter is applied on search on load */
    let filterWhere: any = {};
    if (category || priceRange || sort) {
      const { selectedTags, priceBucket } = extractFilterDataFromQuery(router.query);
      filterWhere = generateWhereForProduct(selectedTags, "", undefined, sort as sortingType, priceBucket);
    }

    const searchApi = new SearchAPI();
    searchApi
      .getSearchProduct(
        snap.searchResultsFor,
        snap.products.length,
        TOTAL_PRODUCTS_TO_FETCH_PER_CALL,
        false,
        snap.variantName,
        filterWhere
      )
      .then(({ data: productres }) => {
        SEARCH_STATE.products = snap.products.concat(productres.data.data);
      });
  };

  const announceInView = (index: number) => {
    const activeRange = Math.max(
      ranges.map(i => index * 2 > i && index * 2 <= i + TOTAL_PRODUCTS_TO_FETCH_PER_CALL).indexOf(true),
      0
    );

    if (!ref.current[ranges[activeRange]]) {
      ref.current[ranges[activeRange]] = true;
      fetchMore();
    }
  };

  useEffect(() => ranges.forEach(r => (ref.current[r] = r === 0)), [ranges]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  if (!snap.products.length) return null;

  return (
    <div>
      {chunks.map((chunk: any, index: any) => {
        return <VirtualListItemPair announceInView={announceInView} key={`vlip - ${index} `} chunk={chunk} index={index} />;
      })}
      <SearchFooter />
    </div>
  );
};

export default SearchResults;
