import React, { useEffect, ReactElement } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSnapshot } from "valtio";
import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";
import useTranslation from "@libHooks/useTranslation";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import NoResults from "@libComponents/Search/NoResults";
import Overlay from "@libComponents/Search/SearchOverlay";
import StickyInput from "@libComponents/Search/StickyInput";
import SearchResults from "@libComponents/Search/SearchResults";
import RecentSearches from "@libComponents/Search/RecentSearches";
import TrendingSearches from "@libComponents/Search/TrendingSearches";
import FilterSortSearch from "@libComponents/Search/FilterSortSearch";
import TopSellingWidgets from "@libComponents/SearchTopSellingWidgets/TopSellingWidgets";
import { SLUG } from "@libConstants/Slug.constant";
import { SHOP } from "@libConstants/SHOP.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { variantValueGenerator } from "@libUtils/searchUtils";
import { useSplit } from "@libHooks/useSplit";

const SearchPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const snap = useSnapshot(SEARCH_STATE);

  const { boostingVariantExperimentID: boostingVariant } =
    useSplit({
      experimentsList: [{ id: "boostingVariantExperimentID" }],
      deps: [],
    }) || {};

  useEffect(() => {
    if (boostingVariant && boostingVariant !== "no-variant") {
      SEARCH_STATE.variantName = variantValueGenerator(boostingVariant);
      (window as any).evars.evar91 = boostingVariant;
    } else if (SHOP.ENABLE_BOOSTING_ALGO) {
      SEARCH_STATE.variantName = "boosting";
    }
  }, [boostingVariant]);

  useEffect(() => {
    /* Trigger event on search page load */
    window.requestAnimationFrame(() => {
      if (!SEARCH_STATE.input.value) {
        ADOBE_REDUCER.adobePageLoadData = {
          common: {
            pageName: "web|search|search initiated",
            newPageName: "search initiated",
            subSection: "search",
            assetType: "search",
            newAssetType: "search",
            platform: ADOBE.PLATFORM,
            pageLocation: "",
            technology: ADOBE.TECHNOLOGY,
          },
        };
      }
    });
  }, []);

  useEffect(() => {
    const widgetApi = new WidgetAPI();
    widgetApi
      .getWidgets({
        where: {
          slugOrId: SLUG().TOP_SELLING_SEARCH_EN,
        },
      })
      .then((res: any) => {
        SEARCH_STATE.widgets = res?.data?.data?.data?.widget;
        SEARCH_STATE.isWidgetsLoaded = true;
      })
      .catch(() => {
        SEARCH_STATE.isWidgetsLoaded = true;
      });
  }, []);

  useEffect(() => {
    if (snap.scrollPosition) {
      window.scrollTo({
        top: snap.scrollPosition,
        left: 0,
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-themeGray relative">
      <Head>
        <title>{t("searchHere")}</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"`,
          }}
        />
      </Head>

      {snap.showOverlay && <Overlay />}

      <div className="flex flex-col h-full">
        <div className="sticky top-0 outline-none z-20 shadow-sm w-full">
          <StickyInput />
          {(snap.products.length > 0 || snap.noResults.show) && <FilterSortSearch />}
          {snap.products.length > 0 && (
            <div
              style={{ backgroundColor: "rgba(250,250,250,0.96)" }}
              className="text-center shadow text-gray-600 text-xs capitalize py-4 backdrop-blur-sm"
            >
              Showing {snap.productsCount} results for&nbsp;<span className="font-bold">"{snap.searchResultsFor}"</span>&nbsp;
            </div>
          )}
        </div>

        {snap.products.length > 0 && <SearchResults />}

        {!snap.noResults.show && snap.isWidgetsLoaded && snap.products.length === 0 && !router.query.q && (
          <>
            <RecentSearches />
            <TrendingSearches />

            <div className="bg-white">
              <TopSellingWidgets widgets={snap.widgets} />
            </div>
          </>
        )}

        {snap.noResults.show && <NoResults />}
      </div>
    </main>
  );
};

SearchPage.getLayout = (children: ReactElement) => children;

export default SearchPage;
