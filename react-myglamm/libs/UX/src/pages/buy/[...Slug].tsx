import React, { useState, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Router from "next/router";
import format from "date-fns/format";
import debounce from "lodash.debounce";

import PLPSeo from "@libComponents/PLP/PLPSeo";
import PLPSchema from "@libComponents/PLP/PLPSchema";
import TABHeaders from "@libComponents/PLP/TABHeaders";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import Loader from "@libComponents/Common/PLPLoadingShimmer";
import FilterTagsSlider from "@libComponents/PLP/FilterTagsSlider";
import FindYourShadeFooter from "@libComponents/PLP/FindYourShadeFooter";
import PLPProductsContainer from "@libComponents/PLP/PLPProductsContainer";

import { SHOP } from "@libConstants/SHOP.constant";

import { handleAPIActions, handlePLPActions } from "@libServices/PLP/PLPReducer";
import {
  sortTags,
  generateWhereForProduct,
  getArrayOfTags,
  sortBrandsList,
  addWidgetDataInBetween,
} from "@libServices/PLP/filterHelperFunc";
import {
  callPLPFilterAPI,
  getBrandsData,
  getFilterTags,
  getMakeupCount,
  getPLPSSRResponse,
} from "@libServices/PLP/plpApiHelperFunc";

import PLPAPI from "@libAPI/apis/PLPAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";

import useTranslation from "@libHooks/useTranslation";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import { logURI } from "@libUtils/debug";
import { isClient } from "@libUtils/isClient";
import { isWebview } from "@libUtils/isWebview";
import { getUpdatedDate } from "@libUtils/getUpdatedDate";
import { GACategoryPageViewed } from "@libUtils/analytics/gtm";

import ErrorComponent from "@libPages/_error";

import {
  APIActions,
  APIStates,
  FilterParams,
  FilterRow,
  metaSEO,
  PLPActions,
  PlpProductWhere,
  PLPSSRStates,
  PLPStates,
  sortingType,
  TAB,
} from "@typesLib/PLP";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { adobePageLoadEvent } from "@libAnalytics/PLP.Analytics";

import SortIcon from "../../../public/svg/sort.svg";
import FilterIcon from "../../../public/svg/filter.svg";

import { PLP_STATE } from "@libStore/valtio/PLP.store";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { useInfiniteScrollGA4Event } from "@libHooks/useInfiniteScrollGA4Event";
import FilterModalV2 from "@libComponents/PopupModal/FilterModalV2";
import { useSplit } from "@libHooks/useSplit";

const FlashSaleTicker = dynamic(() => import(/* webpackChunkName: "FlashSaleTickerChunk" */ "@libComponents/FlashSaleTicker"), {
  ssr: false,
});

const SortModal = dynamic(() => import(/* webpackChunkName: "SortModal" */ "@libComponents/PopupModal/SortModal"), {
  ssr: false,
});
const FilterModal = dynamic(() => import(/* webpackChunkName: "FilterModal" */ "@libComponents/PopupModal/FilterModal"), {
  ssr: false,
});

function Category({
  products,
  navTabs,
  activeTab,
  priceBucket,
  appliedFilters,
  filterTags,
  selectedTags,
  brandsList,
  productCount,
  categoryMeta,
  page,
  skip,
  sort,
  campaignWidget,
  errorCode,
  isServer,
  widgetPLPData,
}: PLPSSRStates) {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeSlug, secondSlug, thirdSlug] = router.query.Slug || [];

  const [categoryFilterTags, setCategoryFilterTags] = useState(filterTags);

  const [isLoading, setIsLoading] = useState(false);
  const [sortModal, setSortModal] = useState<boolean | undefined>();
  const [filterModal, setFilterModal] = useState<boolean | undefined>();
  const [flashSaleWidgetData, setFlashSaleWidgetData] = useState<any>();
  const [catMetaData, setCatMetaData] = useState(categoryMeta);
  const [allBrandsData, setAllBrandsData] = useState<FilterRow[]>(brandsList);
  const [showFadeInAnimation, setShowFadeInAnimation] = useState<boolean>(false);
  const [categoryWidget, setCategoryWidget] = useState<any>(campaignWidget);
  const [isOverlay, setShowIsOverlay] = useState<boolean>(Boolean(PLP_STATE.products?.length > 0));

  const refTab = useRef(true);

  const initalPLPStates: PLPStates = {
    skip,
    page,
    navTabs,
    activeTab,
    priceBucket,
    selectedTags,
    hasNextPage: true,
    sorting: sort,
    appliedFilters,
  };

  const intialAPIStates: APIStates = { products, productCount };

  const [PLPSTATE, PLPDispatch] = useReducer(handlePLPActions, initalPLPStates);
  const [APISTATE, APIDispatch] = useReducer(handleAPIActions, intialAPIStates);
  const [isNewFilter, setIsNewFIlter] = useState(false);

  const isFiltersActive = Object.keys(PLPSTATE.selectedTags || "{}").length || PLPSTATE.priceBucket.length;

  const widgetApi = new WidgetAPI();

  const variantSKU = "variant-v3";
  const variantFilterAttr = useSplit({ experimentsList: [{ id: "filterAttrExp" }], deps: [] });

  useEffect(() => {
    PLP_STATE.historyUrl = Router.asPath?.split("?")[0];
  }, [router?.asPath]);

  const [onMount, setOnMount] = useState(false);
  /* ADOBE ANALYTICS - Category Page View Event on Mount */
  useEffect(() => {
    if (!errorCode) {
      categoryTabViewEvent();

      const getFlashSaleOffer = async () => {
        const getFlashSaleOfferWhere: any = {
          where: {
            slugOrId: "mobile-site-plp-flash-sale-ticker",
            name: "customPage",
            items: "/buy",
          },
        };
        await widgetApi.getWidgets(getFlashSaleOfferWhere, 5, 0).then(async (data: any) => {
          const widgets = data?.data?.data?.data?.widget[0];
          setFlashSaleWidgetData(widgets);
        });
      };
      getFlashSaleOffer();
    }

    setOnMount(true);
  }, []);

  useInfiniteScrollGA4Event(
    APISTATE?.products?.filter((p: any) => !!p.SKU) // skip widgets
  );

  const getWidgetData = async (categoryId: any) => {
    widgetApi
      .getWidgets({
        where: {
          slugOrId: "mobile-site-category-widgets",
          name: "productCategory",
          items: categoryId,
        },
      })
      .then(({ data: catWidget }) => setCategoryWidget(catWidget?.data?.data?.widget?.[0]))
      .catch(() => setCategoryWidget(null));
  };

  /* Running Below Use-effect only on CSR */
  useEffectAfterRender(() => {
    refTab.current = false;
    setTimeout(() => (refTab.current = true), 500);

    PLPDispatch({
      type: "SSR_CHANGE",
      payload: { skip, page, navTabs, activeTab, priceBucket, selectedTags, hasNextPage: true, sorting: sort },
    });
    APIDispatch({
      type: "SSR_CHANGE",
      //@ts-ignore
      payload: { products, productCount },
    });
    setCatMetaData(categoryMeta);
    setCategoryFilterTags(filterTags);
  }, [products]);

  useEffectAfterRender(() => {
    if (isServer || refTab.current) {
      if (activeSlug !== "all") {
        getFilterTags(TABS?.url, PLPSTATE.selectedTags).then(res => {
          setCategoryFilterTags(res);
        });
      } else {
        setCategoryFilterTags(getArrayOfTags(PLPSTATE.selectedTags));
      }
    }
  }, [activeSlug, secondSlug, thirdSlug]);

  /* Top Navigation - Scrollable Tabs Data */
  const TABS = navTabs?.[PLPSTATE.activeTab];

  /* TAB CHANGE with Page View Event */
  const onTabChange = (index: number) => {
    setIsLoading(true);

    let updatedBrands;
    /* if brands data not present on it's tab call api and populate otherwise simply remove filters */
    if (index === 0 && !allBrandsData?.length) {
      getBrandsData().then(brands => setAllBrandsData(brands));
    } else {
      updatedBrands = allBrandsData.map(x => ({ ...x, isSelected: false }));
      setAllBrandsData(updatedBrands);
    }

    const nextTAB = navTabs[index];

    /* Cleanup for SubCategory URL loaded on SSR */
    delete navTabs[index].subCatURL;

    categoryTabViewEvent(nextTAB);
    PLPDispatch({
      type: "CHANGE_TAB",
      payload: { activeIndex: index },
    });
    callFilterAPI({
      where: index ? { where: { "categories.slug": nextTAB.url } } : {},
      relatedData: { index, skipProd: 0, appliedTags: {}, brandsData: updatedBrands },
    });
  };

  const onFilterTagsClick = (action?: PLPActions, apiParam?: FilterParams) => {
    setIsLoading(true);

    /* If No Filters Tags are present reset the Tab to 0 */
    if (action && apiParam) {
      PLPDispatch({ ...action, payload: { ...action.payload, priceRage: PLPSTATE.priceBucket } });
      if (activeSlug === "all") {
        setCategoryFilterTags(getArrayOfTags(action.payload.updatedTags));
      } else {
        setCategoryFilterTags(sortTags(categoryFilterTags, action.payload.updatedTags));
      }

      setAllBrandsData(sortBrandsList(apiParam.relatedData.brandsData));

      return callFilterAPI(apiParam);
    }
    return onTabChange(0);
  };

  /* SORTING - Closing modal and sorting based on type */
  const sortProducts = (type: sortingType, APIAction: APIActions) => {
    setSortModal(false);
    PLPDispatch({ type: "SORT_PRODUCTS", payload: type });
    APIDispatch(APIAction);
  };

  /* APPLY FILTERS - On Click of apply in Filter Modal */
  const onApplyFilters = (plpAction: PLPActions, APIAction: APIActions) => {
    setFilterModal(false);
    setAllBrandsData(sortBrandsList(plpAction.payload.brandsData));
    setCategoryFilterTags(sortTags(categoryFilterTags, plpAction.payload.updatedTags));

    /* Storing States and making call for Products based on selected tags */
    PLPDispatch(plpAction);
    APIDispatch(APIAction);
  };

  const getMoreProducts = () => {
    /* Get More Products for a Category */
    if (APISTATE.productCount > PLPSTATE.skip && APISTATE.productCount > 10) {
      PLPDispatch({ type: "GET_MORE_PRODUCTS", payload: true });
      return callFilterAPI({
        where: generateWhereForProduct(
          PLPSTATE.selectedTags,
          TABS?.subCatURL || TABS?.url,
          allBrandsData,
          PLPSTATE.sorting,
          PLPSTATE.priceBucket
        ),
        relatedData: { skipProd: PLPSTATE.skip },
      });
    }
    /* No Products Available */
    return PLPDispatch({ type: "GET_MORE_PRODUCTS" });
  };

  /**
   * GET CALL
   * For PLP - Based on Filters Applied
   */
  const callFilterAPI = async ({ where, relatedData }: FilterParams) => {
    try {
      const filterData = await callPLPFilterAPI(
        {
          where,
          relatedData,
          navTabs,
          products: [...APISTATE.products],
          widgetPLPData,
        },
        variantSKU
      );
      filterData && APIDispatch(filterData);
    } catch {}

    setIsLoading(false);
  };

  /**
   * Product Listing Page(PLP) - Handle Analytics
   */
  const categoryTabViewEvent = async (tab?: TAB) => {
    /* Exception Case for Brands to Fire Analytics */
    if (tab?.isBrand || navTabs?.[activeTab]?.isBrand) {
      const categoryName = t("allProductstitle") || "All Products";

      (window as any).digitalData = {
        category: {
          numberOfProducts: APISTATE.productCount,
          category: categoryName.toLowerCase(),
        },
      };
      GACategoryPageViewed({
        categoryName,
        userType: checkUserLoginStatus() ? "Member" : "Guest",
      });
      setTimeout(() => {
        adobePageLoadEvent("product listing page", categoryName);
      }, 500);
      return;
    }

    let catMETA = catMetaData;
    /* Get New Selected Tab Category MetaData */
    if (tab) {
      catMETA = await getCategoryMetaData(tab);
    }

    /* ADOBE User Login and Guest Event */
    getMakeupCount([catMETA]).then((res: any) => {
      const categoryName = catMETA?.cms[0]?.content.name;
      (window as any).digitalData = {
        category: {
          numberOfProducts: res[0]?.count || 0,
          category: categoryName,
        },
      };

      let tagsArray: any = [];

      const categoryTags = catMETA?.meta?.tag || [];
      if (categoryTags.length > 0) {
        categoryTags.map((tag: any) => {
          tagsArray.push(`${tag}-${format(new Date(), "ddMMyy")}`);
        });
      }

      // #region  // *Webengage [3] - Category Viewed : Page Load
      const webengageDataLayer: any = {
        categoryName,
        userType: localStorage.getItem("memberId") ? "Member" : "Guest",
        tags: [...tagsArray, ...categoryTags],
      };

      GACategoryPageViewed(webengageDataLayer);

      setTimeout(() => {
        adobePageLoadEvent("product listing page", categoryName as string);
      }, 500);
    });
  };

  /* onTab Change Calling and retrieving and new metaData based on category slug */
  const getCategoryMetaData = (currentTab: TAB) => {
    const plpAPI = new PLPAPI();

    return plpAPI.getCategories(undefined, currentTab.url).then(({ data: res }) => {
      // const categoryMeta = res.data.data[0];
      const newCategoryMeta = getUpdatedDate(res.data.data[0]);
      setCatMetaData(newCategoryMeta);
      getWidgetData(res.data.data[0]?.id);
      return res.data.data[0];
    });
  };

  const handleScrollPosition = () => {
    const scrollPosition = sessionStorage.getItem(SESSIONSTORAGE.PLP_SCROLL_POS_Y);
    if (scrollPosition) {
      setShowFadeInAnimation(true);
      setTimeout(() => {
        window.scrollTo({ top: parseInt(scrollPosition), behavior: "auto" });
      }, 50);
      sessionStorage.removeItem(SESSIONSTORAGE.PLP_SCROLL_POS_Y);
    }
    setShowIsOverlay(false);
  };

  const handleScrollOnPLP = debounce(() => {
    sessionStorage.setItem(SESSIONSTORAGE.PLP_SCROLL_POS_Y, window.scrollY.toString());
  }, 100);

  // Filter Attribute exp
  useEffect(() => {
    if (variantFilterAttr?.filterAttrExp) {
      const filterVariant = variantFilterAttr.filterAttrExp;
      (window as any).evars.evar177 = filterVariant;
      PLP_STATE.newFilterVariant = filterVariant;
      setIsNewFIlter(filterVariant === "1");
    }
  }, [variantFilterAttr]);

  useEffect(() => {
    // handle scroll position after content load
    handleScrollPosition();

    window.addEventListener("scroll", handleScrollOnPLP);
    return () => {
      window.removeEventListener("scroll", handleScrollOnPLP);
    };
  }, []);

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  return (
    <>
      <style>
        {`
      .fadeAnimation{ 
        animation: fadeIn 1s;
       }

      @keyframes fadeIn {
         0% { opacity: 0; }
         18% {opacity: 0;}
        100% { opacity: 1; }
      }
      `}
      </style>

      <main className={`bg-white ${showFadeInAnimation && "fadeAnimation"} ${isOverlay ? "opacity-0" : "opacity-1"}`}>
        <Widgets
          additionalData={categoryWidget}
          slugOrId="mobile-site-category-page-top-banner"
          // expId={t("abTestExperimentIds")?.[0]?.["plpWidget"]}
          abExp="plpWidget"
        />

        {/* SCHEMA */}
        <PLPSchema products={APISTATE.products} />

        {flashSaleWidgetData && <FlashSaleTicker item={flashSaleWidgetData} source="PLP" />}

        {/* Sticky Header */}
        <section className={`sticky z-50 bg-white ${onMount && isWebview() ? "top-0" : "top-12"}`}>
          <TABHeaders
            navTabs={navTabs}
            onTabChange={onTabChange}
            activeTab={PLPSTATE.activeTab === -1 ? 0 : PLPSTATE.activeTab}
          />
        </section>
        {/* Filters */}
        <section className={`${!FEATURES?.plpFilterUnSticky && "sticky"} z-50 ${onMount && isWebview() ? "top-0" : "top-20"}`}>
          <div className="flex pb-2 px-2">
            <div className="flex w-1/2 justify-between">
              <button
                type="button"
                onClick={() => setFilterModal(true)}
                className="font-semibold p-2 bg-color2 flex rounded-md mr-2.5 h-8 text-10 w-24 uppercase outline-none truncate items-center justify-center"
              >
                <FilterIcon className="filter" role="img" aria-labelledby="filter" title="filter" />
                &nbsp; {t("filter")}
              </button>
              <button
                type="button"
                onClick={() => setSortModal(true)}
                className="font-semibold p-2 bg-color2 flex rounded-md mr-2.5 h-8 text-10 w-24 uppercase outline-none truncate items-center justify-center"
              >
                <SortIcon className="sort" role="img" aria-labelledby="sort" title="sort" /> &nbsp; {t("sort")}
              </button>
            </div>

            {/* Slider - List of Filter Tags */}
            <FilterTagsSlider
              onClick={onFilterTagsClick}
              allBrandsData={allBrandsData}
              filterTags={categoryFilterTags}
              selectedTags={PLPSTATE.selectedTags}
              activeCatData={{
                activeTab: PLPSTATE.activeTab,
                slug: TABS?.url,
              }}
            />
          </div>
        </section>
        <section className="bg-themeGray py-2">
          <h1 className="text-center text-sm capitalize font-semibold py-1 bg-white">
            {!router.asPath.match(/\/buy\/all|\/buy\/brands/) && catMetaData?.cms?.[0]?.content?.name}
          </h1>
        </section>
        {/* Category Products with Infinite Loading in Grid Format */}
        <div className="bg-themeGray">
          {/* Grid Skeleton Loader on any action or event */}
          {isLoading ? (
            <Loader />
          ) : (
            <PLPProductsContainer
              PLPSTATE={PLPSTATE}
              products={APISTATE.products}
              isFiltersActive={isFiltersActive}
              getMoreProducts={getMoreProducts}
              PLPDispatch={(action: PLPActions) => PLPDispatch(action)}
            />
          )}
          {SHOP.REGION !== "MIDDLE_EAST" && PLPSTATE.page * 10 <= productCount && (
            <div className="flex justify-center mt-3">
              <a
                href={`/buy/${(router.query.Slug as string[]).join("/")}?page=${PLPSTATE.page + 1}`}
                aria-label={t("next") || "Next"}
              >
                {t("next") || "Next"}
              </a>
            </div>
          )}
        </div>
        {/* Find your Shade redirection */}
        {!flashSaleWidgetData && <FindYourShadeFooter slug={navTabs[PLPSTATE?.activeTab]?.url} />}
        {/* SEO Footer */}
        <PLPSeo catMetaData={catMetaData} showMetaFooter={page < 2} pageNo={PLPSTATE.page} productCount={productCount} />
        {/* SORT MODAL */}
        {typeof sortModal === "boolean" &&
          (isNewFilter ? (
            <SortModal
              view={sortModal}
              relatedData={{
                priceRange: PLPSTATE.appliedFilters?.pricesApplied,
                allBrandsData: PLPSTATE.appliedFilters?.brandsApplied,
                categoryL3: PLPSTATE.appliedFilters?.categoriesApplied,
                sorting: PLPSTATE.sorting,
                selectedTags: PLPSTATE.selectedTags,
                tabUrl: TABS?.url,
                navTabs,
                index: PLPSTATE.activeTab,
              }}
              onSortFilter={sortProducts}
              hide={() => setSortModal(false)}
              products={[...APISTATE.products]}
              widgetPLPData={widgetPLPData}
            />
          ) : (
            <SortModal
              view={sortModal}
              relatedData={{
                allBrandsData,
                sorting: PLPSTATE.sorting,
                selectedTags: PLPSTATE.selectedTags,
                tabUrl: TABS?.url,
                navTabs,
              }}
              onSortFilter={sortProducts}
              hide={() => setSortModal(false)}
              products={[...APISTATE.products]}
              widgetPLPData={widgetPLPData}
            />
          ))}
        {/* Filter Modal */}
        {typeof filterModal === "boolean" &&
          (isNewFilter ? (
            <FilterModalV2
              view={filterModal}
              PLPSTATE={PLPSTATE}
              apply={onApplyFilters}
              hide={() => setFilterModal(false)}
              products={[...APISTATE.products]}
              widgetPLPData={widgetPLPData}
            />
          ) : (
            <FilterModal
              view={filterModal}
              PLPSTATE={PLPSTATE}
              apply={onApplyFilters}
              allBrandsData={allBrandsData}
              hide={() => setFilterModal(false)}
              products={[...APISTATE.products]}
              widgetPLPData={widgetPLPData}
              variantSKU={variantSKU}
            />
          ))}
      </main>
    </>
  );
}

Category.getInitialProps = async (ctx: any) => {
  if (!isClient()) {
    if (ctx.req.method !== "HEAD" && process.env.NEXT_PUBLIC_ENABLE_HIT_LOGS === "true") {
      console.error("HIT:", ctx.req.method, ctx.req.url);
    }
  }
  const { Slug } = ctx.query;

  try {
    const {
      productCount,
      navTabs,
      products,
      brandsList,
      selectedTags,
      filterTags,
      activeTab,
      priceBucket,
      appliedFilters,
      skip,
      page,
      sort,
    } = await getPLPSSRResponse(ctx);

    /* In Case a slug is passed who's tab is not present in DOM or isBrandstab */
    let categoryMeta: metaSEO | undefined;
    if (Slug[0] !== "all" && activeTab) {
      const plpAPI = new PLPAPI();
      const { data } = await plpAPI.getCategories(undefined, `/buy/${Slug?.join("/")}`);
      categoryMeta = data.data?.data?.[0];

      /* In Case Parent Cat Present but not the child return 404 */
      if (!categoryMeta) {
        if (ctx.res) ctx.res.statusCode = 404;

        return { errorCode: 404 };
      }
    }
    const newCategoryMeta = getUpdatedDate(categoryMeta);
    const widgetApi = new WidgetAPI();
    const { data: categoryWidget } = await widgetApi
      .getWidgets({
        where: {
          slugOrId: "mobile-site-category-widgets",
          name: "productCategory",
          items: categoryMeta?.id,
        },
      })
      .catch(() => ({ data: {} }));

    const { data: widgetOnPLP } = await widgetApi
      .getWidgets({
        where: {
          slugOrId: "mobile-site-widget-between-products",
        },
      })
      .catch(() => ({ data: {} }));

    const widgetData = widgetOnPLP?.data?.data?.widget;
    const productWithWidget = addWidgetDataInBetween(products, widgetData);

    if (ctx.res && !productWithWidget?.length) {
      ctx.res.statusCode = 404;
      return ctx.res.end("Not Found");
    }

    return {
      productCount,
      navTabs,
      products: productWithWidget,
      brandsList,
      selectedTags,
      filterTags,
      activeTab,
      priceBucket,
      appliedFilters,
      skip,
      page,
      sort,
      categoryMeta: newCategoryMeta,
      campaignWidget: categoryWidget?.data?.data?.widget?.[0],
      isServer: ctx.isServer,
      widgetPLPData: widgetData,
    };
  } catch (error: any) {
    // log URI for help with debugging using cloudwatch logs
    // not able to get source-maps to work with console.log on the server
    // ideally we should we using something like Sentry
    // or use newrelic to log with proper tracebacks etc.
    logURI(ctx.asPath);
    if (ctx.res) {
      console.error(error, ctx.asPath);
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }

    return {
      errorCode: 404,
    };
  }
};

export default Category;
