import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import SearchLabel from "@libComponents/Search/SearchLabel";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import TagsFlag from "@libComponents/TagsFlag";

import { useOptimize } from "@libHooks/useOptimize";
import useDsAdobe from "@libHooks/useDsAdobe";
import useTranslation from "@libHooks/useTranslation";
import { useSplit } from "@libHooks/useSplit";

import recommendationHelper from "@libUtils/recommendationHelper";
import { formatPrice } from "@libUtils/format/formatPrice";
import { showAddedToBagOrWishlist, showError } from "@libUtils/showToaster";
import useAddtoBag from "@libHooks/useAddToBag";
import { ParseJSON, setValueForAdobe } from "@libUtils/widgetUtils";

import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";

const HomeMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "HomeMiniPDPModal" */ "@libComponents/PopupModal/HomeMiniPDP"),
  { ssr: false }
);

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

const CTAButton = dynamic(() => import("@libComponents/PDP/PDPCTAButton"), { ssr: false });

const ModuleCarousel4 = ({ item, widgetIndex, icid }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const experimentIds = t("abTestExperimentIds");

  const [showDSBestSeller, setShowDSBestSeller] = useState(!!router.query.layout);
  const [widgetData, setWidgetData] = useState<any>();

  const { experimentName, evarName, title, newDesign, showShadesText } = ParseJSON(item?.meta?.widgetMeta);
  const { variant: variantTagsFlag } = useOptimize(experimentIds[0]?.["widgetTagsFlag"]);
  const splitVariants =
    useSplit({
      experimentsList: [{ id: experimentIds[0]?.[experimentName] || "dsBestSellerSearchVariant" }],
      deps: [],
    }) || {};
  const variant = splitVariants[experimentIds[0]?.[experimentName] || "dsBestSellerSearchVariant"];
  const widgetTitle = item.commonDetails?.title?.trim();

  //A/B test for DS BestSeller
  // Will hide the DS BestSeller only when the variant is "0"
  useEffect(() => {
    if (variant) {
      setShowDSBestSeller(variant !== "0");
    }
  }, [variant]);

  useEffect(() => {
    setValueForAdobe(variantTagsFlag, widgetData?.products?.[0]?.meta?.tags?.[0]?.name);
  }, [variantTagsFlag, widgetData]);

  useEffect(() => {
    recommendationHelper(
      item.meta?.widgetMeta,
      item.commonDetails,
      item?.productSKU ? item?.productSKU : "",
      showDSBestSeller
    ).then((res: any) => {
      setWidgetData(res);
    });
  }, [showDSBestSeller]);

  const { dsWidgetRef } = useDsAdobe({
    title: widgetTitle,
    dsWidgetType: widgetData?.dsWidgetType,
    products: widgetData?.products,
    variantValue: showDSBestSeller ? widgetData?.variantValue : "Default",
    evarName: evarName || "evar92", //widgetData?.evarName
  });

  // Variable declaration for miniPDP modal
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [productPosition, setProductPosition] = useState();

  const [loading, setLoading] = useState<boolean>(false);

  const { addProductToCart } = useAddtoBag();

  // miniPDPProductModal call method
  const miniPDPProductData = (product: any, productPosition: any) => {
    SOURCE_STATE.pdpSource = widgetTitle;
    setMiniPDPProduct(product);
    setProductPosition(productPosition);
    if (router.pathname === "/") {
      router.push(`?icid=${icid}`);
    }
    setShowMiniPDPModal(true);
  };

  if (widgetData?.products?.length === 0) {
    return <div />;
  }

  const showToast = () => {
    showAddedToBagOrWishlist("Added To Cart", 2500);
  };

  // miniPDPProductModal call method
  const handleAddToBag = (product: any, position: any) => {
    SOURCE_STATE.addToBagSource = widgetTitle;
    if (product?.hasShade || product?.isShades || product?.shade?.length > 1 || product?.shades?.length > 1) {
      miniPDPProductData(product, position);
    } else {
      setProductPosition(position);
      setLoading(true);
      const productWithMeta = product.meta || product.productMeta ? product : { ...product, meta: { isPreProduct: false } };
      addProductToCart(productWithMeta, 1).then(res => {
        setLoading(false);
        if (res) showToast();
      });
    }
  };

  //Open minPDP or redirect to PDP page if product shades not found
  const miniPDPOnImgClick = (product: any, position: any) => {
    SOURCE_STATE.pdpSource = widgetTitle;
    SOURCE_STATE.addToBagSource = widgetTitle;
    if (!(product.hasShade || product.shadeCount > 1 || product?.shades?.length > 1))
      return router.push(product.urlManager.url);
    miniPDPProductData(product, position);
  };

  const isProductPage = router.pathname?.includes("/product");
  const updatedColor = isProductPage ? "color1" : "color2";
  const updatedText = isProductPage ? "text-base" : "";

  return (
    <ErrorBoundary>
      <section className={`RecentlyViewProduct pt-2 ${newDesign && "bg-color2 pt-2"} rounded-md`} role="banner">
        <div className="recommended-products pb-2">
          {widgetTitle && (
            <SearchLabel label={item.commonDetails.title} color={newDesign ? "color1" : updatedColor} textSize={updatedText} />
          )}
          {newDesign && item.commonDetails?.subTitle && (
            <p className="pl-3 -mt-2 pb-2 text-sm"> {item.commonDetails?.subTitle} </p>
          )}
          <ul
            className="overflow-x-auto flex list-none mb-0.5 px-4"
            dir="ltr"
            style={{
              scrollSnapType: "x mandatory",
            }}
            ref={dsWidgetRef}
          >
            {widgetData?.products?.map((product: any, index: number) => (
              <li
                key={product.id}
                className={`mr-2 mb-2 h-full rounded-sm bg-white relative ${newDesign ? "p-1.5" : "px-2 py-3"}`}
                style={{
                  width: newDesign ? "136px" : "150px",
                  minWidth: newDesign ? "136px" : "150px",
                  boxShadow: "0 0 3px 0 rgba(0,0,0,.12",
                  border: "1px solid rgba(0,0,0,.1)",
                }}
              >
                <TagsFlag variant={variantTagsFlag} tagName={product?.meta?.tags?.[0].name} />
                <div
                  className="flex justify-center"
                  onClick={e => {
                    miniPDPOnImgClick(product, index + 1);
                  }}
                >
                  <ImageComponent
                    style={{ width: "120px", height: "120px" }}
                    src={product?.assets[0]?.imageUrl?.["400x400"]}
                    alt={product.cms[0]?.content.name || product?.assets[0]?.title || product?.assets[0]?.name}
                  />
                </div>
                <div className="flex h-5 my-1">
                  {product?.rating?.avgRating > 0 && (
                    <PDPAvgRating
                      size={9}
                      avgRating={
                        product?.rating?.avgRating % 1 != 0
                          ? product?.rating?.avgRating.toFixed(1)
                          : product?.rating?.avgRating + ".0"
                      }
                      totalCount={product?.rating?.totalCount}
                    />
                  )}
                </div>
                <div className="text-sm">
                  <p className="text-11 font-bold truncate">{product.cms[0]?.content.name}</p>
                  <p className="truncate mb-1 text-10 h-2.5 text-gray-500 leading-none">{product.cms[0]?.content.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center">
                  <p className="font-semibold text-13 mr-1.5">{formatPrice(product.offerPrice, true)}</p>
                  {product.offerPrice !== product.price && (
                    // change text color text-gray-400 to text-gray-500 for sufficient color contrast
                    <>
                      <del className="text-11 text-gray-500 mr-1">{formatPrice(product.price, true)}</del>
                      <span className="text-11 font-bold text-green-600 lowercase">
                        {t("priceOffPercentage", [
                          Math.round(((product.price - product.offerPrice) / product.price) * 100).toString(),
                        ])}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-1">
                  {product?.isPreOrder ? (
                    <CTAButton
                      loading={loading && productPosition === index + 1}
                      CTA={t("preOrderNow")}
                      clickAction={() => {
                        handleAddToBag(product, index + 1);
                      }}
                    />
                  ) : (
                    <CTAButton
                      loading={loading && productPosition === index + 1}
                      CTA={showShadesText ? (product.hasShade ? `Show ${t("shade")}` : t("addToBag")) : t("addToBag")}
                      clickAction={() => {
                        handleAddToBag(product, index + 1);
                      }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* MiniPDP modal  starts */}
          {showMiniPDPModal && (
            <HomeMiniPDPModal
              show={showMiniPDPModal}
              onRequestClose={() => setShowMiniPDPModal(false)}
              product={miniPDPProduct}
              icid={icid}
              productPosition={productPosition}
              t={t}
              themeColor={"#f88d8d"} //f88d8d
              setMiniPDPFreeProduct={(freeProd: any) => {
                setMiniPDPFreeProduct(freeProd);
                setShowPDPFreeProductModal(true);
              }}
              widgetName={title || widgetTitle}
            />
          )}

          {showPDPFreeProductModal && miniPDPFreeProduct && (
            <PDPFreeProductModal
              show={showPDPFreeProductModal}
              hide={() => setShowPDPFreeProductModal(false)}
              freeProduct={miniPDPFreeProduct}
              product={{ id: miniPDPFreeProduct?.parentId || 0 }}
              t={t}
            />
          )}
          {/* MiniPDP modal ends */}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default ModuleCarousel4;
