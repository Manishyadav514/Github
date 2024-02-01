import React, { useState, useEffect, Fragment, useReducer } from "react";
import dynamic from "next/dynamic";
import uniqby from "lodash.uniqby";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useInView } from "react-intersection-observer";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import MiniPDPGrid from "@libComponents/ProductGrid/MiniPDPGrid";
import PLPProdCell from "@libComponents/ProductGrid/PLPProdCell";
import PLPSeoDescritpion from "@libComponents/PLP/PLPSEODescription";
import PLPAPI from "@libAPI/apis/PLPAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { ADOBE } from "@libConstants/Analytics.constant";
import useTranslation from "@libHooks/useTranslation";
import { logURI } from "@libUtils/debug";
import { decodeHtml, stripSlashes } from "@libUtils/decodeHtml";
import { GACollectionPageViewed } from "@libUtils/analytics/gtm";
import format from "date-fns/format";
import CollectionFilterModal from "@libComponents/PopupModal/CollectionFilterModal";
import { SHOP } from "@libConstants/SHOP.constant";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import {
  VariantSKUGenerator,
  addWidgetDataInBetween,
  extractFilterDataFromQuery,
  generateWhereForProductV2,
} from "@libServices/PLP/filterHelperFunc";
import { getClientQueryParam } from "@libUtils/_apputils";
import { useRouter } from "next/router";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import CollectionHead from "@libComponents/Collection/CollectionHead";
import { handlePLPActions } from "@libServices/PLP/PLPReducer";
import { APIActions, FilterRow, PLPActions, PLPStates, sortingType } from "@typesLib/PLP";
import { isWebview } from "@libUtils/isWebview";
import FilterModalV2 from "@libComponents/PopupModal/FilterModalV2";
import { patchCollectionProductRes, patchDsCollectionRes } from "@PLPLib/collection/patchProductRes";
import { handleProductDiscountCode } from "@productLib/pdp/HelperFunc";

const PartnershipCoupon = dynamic(
  () => import(/* webpackChunkName: "PartnershipModal" */ "@libComponents/PDP/PartnershipCoupon"),
  { ssr: false }
);
import { useSplit } from "@libHooks/useSplit";
import { getCTPData } from "@productLib/pdp/HelperFunc";
import LoginModal from "@libComponents/Auth/Login.Modal";

import { handlePartnershipData } from "@libUtils/getDiscountPartnership";
import useDiscountPartnership from "@libHooks/useDiscountPartnership";
import { isClient } from "@libUtils/isClient";
import { urlJoin } from "@libUtils/urlJoin";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { removeKeyFromObject } from "@productLib/pdp/pdpUtils";
import SortModal from "@libComponents/PopupModal/SortModal";
import { FilterIcon, SortIcon } from "@libComponents/GlammIcons";
import FilterNoProducts from "@libComponents/PLP/FilterNoProducts";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import ErrorComponent from "@libPages/_error";

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

const MultimediaSingleBanner = dynamic(() => import("@libComponents/TVC/multimedia-single-banner-homewidget"));

type CollectionProps = {
  collection?: any;
  productsRes?: Array<any>;
  errorCode?: number;
  widgets?: any;
  collectionCategories?: any;
  widgetPLPData?: any;
  productIds?: any;
  plpTagsFlag?: boolean;
  partnerShipData?: any;
  appliedFilters?: any;
  sort?: sortingType;
};

function CollectionPage({
  collection,
  productsRes,
  errorCode,
  widgets,
  collectionCategories,
  widgetPLPData,
  productIds,
  plpTagsFlag,
  partnerShipData,
  appliedFilters,
  sort,
}: CollectionProps) {
  const { t } = useTranslation();
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const plpAPI = new PLPAPI();
  const { ref, inView } = useInView({ triggerOnce: true });
  const { asPath } = useRouter();
  const ROUTE = asPath.split("?")[0];
  const [showFilterModal, setShowFilterModal] = useState<boolean | undefined>();
  const router = useRouter();
  const { pathname, query } = router;
  const collectionName = router.query?.collection;
  const collectionBanner = collection?.assets?.[0]?.url;
  const { content } = collection?.cms?.[0] || {};
  const [skip, setSkip] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState(uniqby(productsRes, "id") || []);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [isGridView, setIsGridView] = useState(collection?.meta?.template === "doubleGrid");
  const shortDescription = decodeHtml(stripSlashes(content?.shortDescription));
  const [showMore, setShowMore] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [showCouponForm, setShowCouponForm] = useState<boolean | undefined>();
  const [showCouponToaster, setShowCouponToaster] = useState<boolean>(false);
  const [ctpData, setCTPData] = useState<any>({});
  const [sortModal, setSortModal] = useState<boolean>(false);
  const [filterModal, setFilterModal] = useState<any>(false);
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [collProductIds, setCollProductIds] = useState<Array<any>>(productIds);
  const [dsDataLoaded, setDsDataLoaded] = useState(false);

  const optype = getClientQueryParam("optype");
  const sourceSlug = getClientQueryParam("sourceSlug");
  const categories = collectionCategories?.slice(0, 5) || [];
  const regex = /(<([^>]+)>)/gi;
  const isCTPSlug = userProfile?.id && true && (t("ctpSlugs") || ["cut-the-price-collection"])?.includes(collectionName);
  const initalPLPStates: PLPStates = {
    activeTab: 0,
    navTabs: [{ url: `/collection/${collectionName}`, label: `${collectionName}` }],
    priceBucket: [],
    selectedTags: {},
    skip: skip,
    sorting: sort,
    hasNextPage: false,
    page: 0,
    appliedFilters: {
      pricesApplied: appliedFilters?.pricesApplied || [],
      brandsApplied: appliedFilters?.brandsApplied || [],
      categoriesApplied: appliedFilters?.categoriesApplied || [],
    },
  };
  const [PLPSTATE, PLPDispatch] = useReducer(handlePLPActions, initalPLPStates);

  const { partnershipData: getLocalPartnershipData } = useDiscountPartnership({
    products: productIds,
    SSRPartnerShipData: partnerShipData,
  });
  const getSessionPartnerShipData = getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true);

  const splitVariants =
    useSplit({
      experimentsList: [
        { id: "quickFilterCollection", condition: collectionCategories?.length > 0 ? true : false },
        { id: "collectionFilterExp" },
        { id: "collectionProdRankExp" },
        { id: "widgetOnPLP" },
        { id: "plpTagID" },
      ],
      deps: [],
    }) || {};
  const {
    quickFilterCollection: variant,
    collectionFilterExp,
    collectionProdRankExp,
    widgetOnPLP: variantPLPWidget,
    plpTagID: variantPLPTag,
  } = splitVariants || {};

  const showPartnershipModal = FEATURES.partnershipExp; // partnership modal
  const collectionProdRankVar =
    collectionProdRankExp && collectionProdRankExp !== "no-variant" ? VariantSKUGenerator(collectionProdRankExp) : "default";
  const checkSeoFaq = content?.seoFaq?.[0]?.question;
  const productsWithTag: number = t("tagsLimitPLP") || 4;
  const handleProductWithWidget = (productsData: any) => {
    const productWithWidget = addWidgetDataInBetween(productsData, widgetPLPData);
    setProducts(productWithWidget);
  };

  const isPartnershipQuery = t("partnershipSource").includes(getClientQueryParam("utm_source")?.toLowerCase());

  const isDiscountCode = getClientQueryParam("discountCode");

  const isCTP = products[0]?.meta?.cutThePrice && userProfile?.id;

  let filterWhere: { where: any; order: [sortingType] } = generateWhereForProductV2({
    slug: PLPSTATE?.navtab?.[0]?.url,
    pricesApply: PLPSTATE.appliedFilters?.pricesApplied,
    brandsApply: PLPSTATE.appliedFilters?.brandsApplied,
    categoriesApply: PLPSTATE.appliedFilters?.categoriesApplied,
    sort: PLPSTATE.sorting,
    isCollection: true,
  });

  useEffect(() => {
    if (showPartnershipModal && isPartnershipQuery && !getSessionPartnerShipData) {
      setShowCouponForm(true);
    }
  }, [showPartnershipModal]);

  useEffect(() => {
    filterWhere = generateWhereForProductV2({
      slug: PLPSTATE?.navtab?.[0]?.url,
      pricesApply: PLPSTATE.appliedFilters?.pricesApplied,
      brandsApply: PLPSTATE.appliedFilters?.brandsApplied,
      categoriesApply: PLPSTATE.appliedFilters?.categoriesApplied,
      sort: PLPSTATE.sorting,
      isCollection: true,
    });
  }, [PLPSTATE]);

  useEffect(() => {
    if (variantPLPTag !== "no-variant") {
      (window as any).evars.evar122 = variantPLPTag === "1" ? `true|${plpTagsFlag ? "visible" : "not visible"}` : "false";
    }
  }, [variantPLPTag]);

  useEffect(() => {
    if (SHOP.ENABLE_QUICK_FILTER) {
      (window as any).evars.evar126 = collectionCategories?.length > 0 ? "true" : "false";
    }
  }, []);

  useEffect(() => {
    const handleScrollPartnerShip = async () => {
      await handlePartnershipData({ products: collProductIds, skip });
    };
    if (dsDataLoaded) {
      handleScrollPartnerShip();
    }
  }, [skip, dsDataLoaded]);

  useEffect(() => {
    if (collectionProdRankExp && !["no-variant", "0"].includes(collectionProdRankExp)) {
      plpAPI
        .getCollectionV2(
          { "urlShortner.slug": `/collection/${collectionName}`, ...filterWhere?.where },
          0,
          true,
          collectionProdRankVar,
          10,
          filterWhere?.order?.[0]
        )
        .then(async ({ data: res }) => {
          // RESET_PARTNERSHIP_STATE();
          handleProductWithWidget(res?.data?.products || []);
          setCollProductIds(res.data.data.products);
          await handlePartnershipData({ products: res.data.data.products });
          setSkip(10);
          setDsDataLoaded(true);
          if (!res?.data?.products || res?.data?.products.length < 10) {
            setHasMore(false);
          }
        });
    } else if (collectionProdRankExp) {
      setDsDataLoaded(true);
    }
  }, [collectionProdRankExp]);

  // Adobe Analytics[3] - Page Load - Collection PLP
  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|${content?.name}|product listing page`,
        newPageName: "product listing",
        subSection: content?.name,
        assetType: "collection",
        newAssetType: "collection",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      collection: {
        numberOfProducts: collection?.products?.length || 0,
        collection: content?.name,
      },
    };

    let tagsArray: any = [];

    const collectiontTags = collection?.meta?.tag || [];

    if (collectiontTags.length > 0) {
      collectiontTags.map((tag: any) => {
        tagsArray.push(`${tag}-${format(new Date(), "ddMMyy")}`);
      });
    }

    // #region  // *Webengage [6] - Collection Viewed : function call
    const webengageDataLayer = {
      collectionName: content?.name,
      userType: localStorage.getItem("memberId") ? "Member" : "Guest",
      tags: [...tagsArray, ...collectiontTags],
    };
    GACollectionPageViewed(webengageDataLayer);
  }, []);

  useEffect(() => {
    if (variantPLPWidget !== "no-variant") {
      (window as any).evars.evar138 = isPartnershipQuery ? "0" : variantPLPWidget;
    }
  }, [variantPLPWidget]);

  useEffect(() => {
    if (isCTPSlug) {
      const skus = products.map(data => data.sku);
      getCTPData(skus.join(), userProfile?.id).then((resp: any) => {
        setCTPData(resp?.data?.data?.data);
      });
    }
  }, [products, userProfile]);

  useEffect(() => {
    if (optype === "ctp" && !userProfile?.id) {
      setLoginModal(true);
    }
  }, [optype]);

  // const toggleViewAdobeEvent = () => {
  //   (window as any).digitalData = {
  //     common: {
  //       linkName: `web|${content?.name}|Viewtoggle`,
  //       linkPageName: `web|${content?.name}`,
  //       ctaName: "Viewtoggle",
  //       newLinkPageName: `Collection page - ${content?.name}`,
  //       subSection: `Collection page - ${content?.name}`,
  //       assetType: "Collection",
  //       newAssetType: "Collection",
  //       platform: ADOBE.PLATFORM,
  //     },
  //     user: Adobe.getUserDetails(),
  //   };
  //   Adobe.Click();
  // };

  useEffect(() => {
    if (inView && hasMore && dsDataLoaded) {
      if (skip >= collection?.products?.length) {
        setHasMore(false);
      } else {
        plpAPI
          .getCollectionV2(
            { "urlShortner.slug": `/collection/${collectionName}`, ...filterWhere?.where },
            skip,
            false,
            collectionProdRankVar,
            10,
            filterWhere?.order?.[0]
          )
          .then(({ data: res }) => {
            setSkip(skip + 10);
            handleProductWithWidget(products.concat(res.data?.products || []));
            if (!res.data?.products.length) {
              setHasMore(false);
            }
          });
      }
    }
  }, [inView, dsDataLoaded]);

  /**
   * Collection filter modal starts
   */

  const triggerEvent38 = () => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|${content?.name}|product listing page`,
        newPageName: isCTP ? ADOBE.CTP_PLP : "product listing",
        subSection: isCTP ? ADOBE.CTP_PLP : content?.name,
        assetType: isCTP ? ADOBE.CTP_PLP : "collection",
        newAssetType: isCTP ? ADOBE.CTP_PLP : "collection",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      collection: {
        numberOfProducts: collection?.products?.length || 0,
        collection: content?.name,
      },
    };
  };

  useEffect(() => {
    if (selectedCategories?.length > 0) {
      plpAPI
        .getCollectionV2(
          {
            "urlShortner.slug": `/collection/${collectionName}`,
            "categories.id": {
              inq: selectedCategories,
            },
            ...filterWhere?.where,
          },
          0,
          false,
          collectionProdRankVar,
          10,
          filterWhere?.order?.[0]
        )
        .then(({ data: res }) => {
          handleProductWithWidget(res.data?.products || []);
        });
      const result = collectionCategories?.filter((cc: any) => selectedCategories.includes(cc.id));
      let categoryNames: any = [];
      if (result?.length) {
        result.map((cat: any) => {
          categoryNames.push(cat?.cms[0]?.content?.name);
        });
      }
      if (categoryNames?.length) {
        (window as any).evars.evar114 = categoryNames;
        (window as any).evars.evar113 = "filter applied";
        triggerEvent38();
      }
    } else {
      handleProductWithWidget(uniqby(productsRes, "id") || []);
    }
  }, [selectedCategories]);

  const handleCategorySelection = (id: any) => {
    if (selectedCategories.includes(id)) {
      const current = [...selectedCategories];
      current.splice(current.indexOf(id), 1);
      setSelectedCategories(current);
    } else {
      setSelectedCategories(current => [...current, id]);
    }
  };

  const applyFilter = () => {
    if (selectedCategories?.length) {
      plpAPI
        .getCollectionV2(
          {
            "urlShortner.slug": `/collection/${collectionName}`,
            "categories.id": {
              inq: selectedCategories,
            },
            ...filterWhere?.where,
          },
          0,
          false,
          collectionProdRankVar,
          10,
          filterWhere?.order?.[0]
        )
        .then(({ data: res }) => {
          handleProductWithWidget(res.data?.products);
          if (!res.data?.products || res.data?.products.length < 10) {
            setHasMore(false);
          }
        });

      (window as any).evars.evar113 = "filter applied";
      triggerEvent38();
    }
  };

  const onApplyFilters = (plpAction: PLPActions, APIAction: APIActions) => {
    PLPDispatch(plpAction);
    setSkip(10);
    setProducts(APIAction.payload.updatedProductData);
    setFilterModal(false);
  };

  const sortProducts = (type: sortingType, APIAction: APIActions) => {
    setSortModal(false);
    PLPDispatch({ type: "SORT_PRODUCTS", payload: type });
    setSkip(10);
    setProducts(APIAction.payload.updatedProductData);
  };

  /**
   * Collection filter modal end
   */

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  const shortDesc = shortDescription?.replace(regex, "");

  return (
    <>
      <CollectionHead collection={collection} products={products} />
      {collectionFilterExp === "1" &&
        !ROUTE.match(
          `/$|good-points$|test|learn|category|baby-name|ovulation-calculator|live-doctor-chat|become-a-creator|toxins-to-avoid|change-makers|community/`
        ) && (
          <>
            <section className="fixed z-50 bottom-0 right-0 left-0 bg-white">
              <div className="flex h-[48px] px-3 border-t bg-gradient-to-b from-white to-themeGray">
                <div className="flex w-full">
                  <button
                    type="button"
                    onClick={() => setFilterModal(true)}
                    className="flex items-center justify-center text-sm font-normal capitalize w-1/2 border-r"
                  >
                    <FilterIcon />
                    &nbsp; {t("filterCollection") || "Filter"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortModal(true)}
                    className="flex items-center justify-center text-sm font-normal capitalize w-1/2"
                  >
                    <SortIcon /> &nbsp; {t("sortCollection") || "sort"}
                  </button>
                </div>
              </div>
            </section>
            <FilterModalV2
              view={filterModal}
              apply={onApplyFilters}
              hide={() => setFilterModal(false)}
              widgetPLPData={widgetPLPData}
              isCollection={true}
              PLPSTATE={PLPSTATE}
              variant={collectionProdRankVar}
            />
            <SortModal
              view={sortModal}
              relatedData={{
                priceRange: PLPSTATE.appliedFilters?.pricesApplied,
                allBrandsData: PLPSTATE.appliedFilters?.brandsApplied,
                categoryL3: PLPSTATE.appliedFilters?.categoriesApplied,
                sorting: PLPSTATE.sorting,
                selectedTags: PLPSTATE.selectedTags,
                navTabs: PLPSTATE.navTabs,
                index: PLPSTATE.activeTab,
              }}
              onSortFilter={sortProducts}
              hide={() => setSortModal(false)}
              widgetPLPData={widgetPLPData}
              isCollection={true}
              variant={collectionProdRankVar}
            />
          </>
        )}
      {widgets?.length > 0 ? (
        widgets?.map((widget: any, index: number) => (
          <div className="relative bg-white shadow" key={index}>
            <MultimediaSingleBanner item={widget} widgetIndex={index} customClass="mb-0" />
          </div>
        ))
      ) : collectionBanner ? (
        <ImageComponent forceLoad className="w-full" src={collectionBanner} alt={collection?.assets[0]?.name} />
      ) : (
        <div className="" />
      )}
      {shortDesc?.length > 140 && !showMore ? (
        <div>
          <p className="px-4 text-sm py-2 opacity-70 bg-white border-gray-200 shadow border-b italic">
            {shortDesc.substring(0, 140) + "..."}
            <span onClick={() => setShowMore(true)} className="text-black px-1 text-13 font-semibold">
              {t("seeMore") || "See More"}
            </span>
          </p>
        </div>
      ) : (
        <>
          {!!shortDesc && (
            <p className="px-4 text-sm py-2 opacity-70 bg-white border-gray-200 shadow border-b italic">{shortDesc}</p>
          )}
        </>
      )}
      {(SHOP.ENABLE_QUICK_FILTER || variant === "1") && collectionCategories?.length && (
        <Fragment>
          <div className="px-4 py-2 bg-white flex overflow-x-auto">
            {/**Map for selected categories */}
            {selectedCategories?.length > 0 &&
              collectionCategories?.map((category: any, index: React.Key) => {
                if (selectedCategories.includes(category.id)) {
                  return (
                    <div key={index} className="flex flex-row">
                      <button
                        key={index}
                        type="button"
                        className="text-sm w-max py-0.5 px-2 rounded-lg mr-2 mb-2 text-white bg-color1 shadow-sm"
                        onClick={() => handleCategorySelection(category.id)}
                      >
                        {category?.cms[0]?.content?.name}
                      </button>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            {/**Map for default categories */}
            {selectedCategories?.length < 5 &&
              categories?.map((category: any, index: React.Key) => {
                return (
                  <div key={index} className="flex flex-row">
                    {!selectedCategories.includes(category.id) && (
                      <button
                        key={index}
                        type="button"
                        className="text-sm w-max py-0.5 px-2 rounded-lg mr-2 mb-2 text-gray-800 bg-color2 shadow-sm"
                        onClick={() => handleCategorySelection(category.id)}
                      >
                        {category?.cms[0]?.content?.name}
                      </button>
                    )}
                  </div>
                );
              })}
            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              className="flex justify-center items-center text-sm font-semibold px-2 rounded-lg mr-2 mb-2 bg-color2 shadow-sm text-color1"
            >
              {t("more")}
              <p className="text-xl ml-0.5">{">"}</p>
            </button>
          </div>
          {typeof showFilterModal === "boolean" && (
            <CollectionFilterModal
              show={showFilterModal}
              hide={() => setShowFilterModal(false)}
              collectionCategories={collectionCategories}
              selectedCategories={selectedCategories}
              applyFilter={applyFilter}
              setSelectedCategories={setSelectedCategories}
            />
          )}
        </Fragment>
      )}
      <div className={isGridView ? "py-b pl-2 flex flex-wrap" : "p-5 pt-2"} role="list">
        {products?.length ? (
          <>
            {products.map((productRes: any, index: number) => {
              if (productRes?.customParam) {
                if (variantPLPWidget === "1" && !isPartnershipQuery && !isDiscountCode) {
                  return (
                    <div
                      className="w-full overflow-hidden mt-2 mr-2 rounded"
                      ref={index === products.length - 5 ? ref : null}
                      key={index}
                    >
                      <Widgets widgets={[productRes]} />
                    </div>
                  );
                }
                return <div key={index}></div>;
              }

              const partnershipData = (isClient() ? getLocalPartnershipData?.couponList : partnerShipData?.couponList)?.find(
                (data: any) => {
                  return data.productId === productRes.id;
                }
              );

              const productURL = partnershipData?.payableAmount
                ? `${urlJoin(productRes.urlManager?.url)}discountCode=${
                    getLocalPartnershipData?.partnershipCoupon || partnerShipData?.partnershipCoupon
                  }`
                : productRes.urlManager?.url;

              const product = patchCollectionProductRes(productRes, partnershipData, productURL);

              return (
                <React.Fragment key={`${product.productId}${index}`}>
                  {isGridView ? (
                    <div className="w-1/2 pr-2 pt-2" role="listitem">
                      <PLPProdCell
                        showTags={productsWithTag > index ? true : false}
                        product={product}
                        ctpData={ctpData[product?.SKU]}
                        forceload={index < 2}
                        productRef={index === products.length - 5 ? ref : null}
                        indexProd={index}
                        variantPLPTag={variantPLPTag}
                      />
                    </div>
                  ) : (
                    <>
                      <MiniPDPGrid
                        product={product}
                        forceLoad={index === 0}
                        productRef={index === products.length - 3 ? ref : null}
                        setMiniPDPFreeProduct={(freeProd: any) => {
                          setMiniPDPFreeProduct(freeProd);
                          setShowPDPFreeProductModal(true);
                        }}
                      />
                      {showPDPFreeProductModal && miniPDPFreeProduct && (
                        <PDPFreeProductModal
                          show={showPDPFreeProductModal}
                          hide={() => setShowPDPFreeProductModal(false)}
                          freeProduct={miniPDPFreeProduct}
                          product={{ id: miniPDPFreeProduct?.parentId || 0 }}
                          t={t}
                        />
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <FilterNoProducts t={t} price={PLPSTATE.priceBucket} />
        )}
      </div>

      {typeof showCouponForm === "boolean" && (
        <PartnershipCoupon
          partnerShipModal={showCouponForm}
          hide={() => setShowCouponForm(false)}
          productIds={collProductIds}
        />
      )}

      <div className="bg-white mt-4">
        {/* SEO Footer */}
        <PLPSeoDescritpion desc={content?.longDescription} />
        {/* {faq and seoFaq} */}
        <PLPSeoDescritpion desc={checkSeoFaq ? content?.seoFaq : content?.faq} faq={true} type={checkSeoFaq && "seoFaq"} />
      </div>
      {loginModal && (
        <LoginModal
          show={loginModal}
          onRequestClose={() => {
            setLoginModal(false);
          }}
          hasGuestCheckout={false}
          onSuccess={() => {
            router.replace({ pathname, query: removeKeyFromObject(router.query as any, ["sourceSlug", "ottype"]) }, undefined, {
              shallow: true,
            });
          }}
          otpMetaData={{
            cutThePrice: true,
            source: "ctp",
            sourceSlug: decodeURIComponent(sourceSlug as string),
          }}
        />
      )}
    </>
  );
}

export default CollectionPage;
