import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import recommendationHelper from "@libUtils/recommendationHelper";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { SLUG } from "@libConstants/Slug.constant";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PDPLabel from "./PDPLabel";
import dynamic from "next/dynamic";
import useTranslation from "@libHooks/useTranslation";
import useDsAdobe from "@libHooks/useDsAdobe";
import { useRouter } from "next/router";
import PDPAvgRating from "./PDPAvgRating";
import { formatPrice } from "@libUtils/format/formatPrice";
import { useOptimize } from "@libHooks/useOptimize";
import { showAddedToBagOrWishlist } from "@libUtils/showToaster";
import useAddtoBag from "@libHooks/useAddToBag";
import TagsFlag from "@libComponents/TagsFlag";
import { filterProductsOnTag, setValueForAdobe } from "@libUtils/widgetUtils";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import PDPTagsFilters from "./PDPTagsFilters";
import { PDP_STATES, PDP_VARIANTS, RESET_PDP_STATES } from "@libStore/valtio/PDP.store";

const HomeMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "HomeMiniPDPModal" */ "@libComponents/PopupModal/HomeMiniPDP"),
  { ssr: false }
);

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

const CTAButton = dynamic(() => import("@libComponents/PDP/PDPCTAButton"), { ssr: false });

const PDPRecommendedProduct = ({ setIsSimilarProduct, icid, product, setShowSimilarProductModal, hideLoader }: any) => {
  // Variable declaration for miniPDP modal
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [productPosition, setProductPosition] = useState();
  const [productsData, setProductData] = useState<any[]>([]);
  const [recommendedProducts, setrecommendedProducts] = useState<any>();
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { addProductToCart } = useAddtoBag();
  const showToast = () => {
    showAddedToBagOrWishlist(t("addedToCart") || "Added To Cart", 2500);
  };

  //Set data and open miniPDP
  const openModal = (product: any, position: any) => {
    setMiniPDPProduct(product);
    setProductPosition(position);
    setShowMiniPDPModal(true);
    // setIsSimilarProduct(false);
  };

  // miniPDPProductModal call method
  const miniPDPProductData = (product: any, position: any) => {
    SOURCE_STATE.pdpSource = product?.widgetName;
    SOURCE_STATE.addToBagSource = product?.widgetName;
    if (product.isShades || product.shadeCount < 1) {
      openModal(product, position);
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
    SOURCE_STATE.pdpSource = product?.widgetName;
    if (!(product.isShades || product.shadeCount < 1)) return router.push(product.urlManager.url);
    openModal(product, position);
  };

  const { widgetTagsFlag } = t("abTestExperimentIds")?.[0] || {};
  const { similarProductsVariant, similiarProductsTagFilterVariant } = useSnapshot(PDP_VARIANTS);

  const [variantTagsFlag] = useOptimize([widgetTagsFlag]).variants;

  useEffect(() => {
    const getRecommendedProduct = async () => {
      const productRecommendedwhere: any = {
        where: {
          slugOrId: SLUG().PDP_PRODUCT_RECOMMENDATION_EN,
          name: "products",
          items: product.id,
        },
      };
      const widgetApi = new WidgetAPI();
      await widgetApi
        .getWidgets(productRecommendedwhere, 5, 0)
        .then(async (data: any) => {
          const selectIndexOnVariant: number =
            similiarProductsTagFilterVariant && similiarProductsTagFilterVariant !== "no-variant"
              ? parseInt(similiarProductsTagFilterVariant)
              : 0;
          const widgets = data?.data?.data?.data?.widget?.[selectIndexOnVariant];
          const dsPowered = widgets ? JSON.parse(widgets?.meta?.widgetMeta)?.dsPowered : false;
          let showDs = true;
          if (similarProductsVariant !== "no-variant") {
            /* Hide only in case A/B is running and gave 0 as variant */
            showDs = similarProductsVariant !== "0";
          } else if (typeof dsPowered === "boolean") {
            showDs = dsPowered;
          }
          if (widgets && widgets.customParam === "multiple-collection-carousel" && widgets.meta?.widgetMeta) {
            const widgetProducts = Object.values(widgets?.commonDetails?.descriptionData[0]?.relationalData?.products);
            // if (widgetProducts) {
            //   setIsSimilarProduct(true);
            // }
            recommendationHelper(widgets.meta?.widgetMeta, widgets.commonDetails, product.sku, showDs)
              .then((recommProducts: any) => {
                setrecommendedProducts({
                  title: widgets.commonDetails.title,
                  products: recommProducts?.products,
                  dsWidgetType: recommProducts.dsWidgetType,
                  variantValue: recommProducts?.variantValue,
                  globalTags: recommProducts?.globalTags,
                });

                setProductData(recommProducts?.products);
                if (recommProducts?.products) {
                  setIsSimilarProduct?.(true);
                }
                hideLoader?.();
              })
              .catch(() => {
                setrecommendedProducts({
                  title: widgets.commonDetails.title,
                  products: widgetProducts,
                  dsWidgetType: "none",
                });
                hideLoader?.();
              });
          }
        })
        .catch((error: any) => console.error(error.message));
    };
    if (similarProductsVariant) {
      window.requestIdleCallback(getRecommendedProduct);
    }
  }, [similarProductsVariant, product.id, similiarProductsTagFilterVariant]);

  /**
   * useDsAdobe hook calls the useInView hook with Ds Adobe Event with given parameters and returns the ref returned from useInView
   */
  const { dsWidgetRef } = useDsAdobe({
    title: recommendedProducts?.title,
    dsWidgetType: recommendedProducts?.dsWidgetType,
    products: recommendedProducts?.products,
    sku: product.sku,
    variantValue:
      similiarProductsTagFilterVariant && similiarProductsTagFilterVariant !== "no-variant"
        ? recommendedProducts?.globalTags?.length
          ? "1"
          : "0"
        : "",
    evarName: "evar93",
    threshold: 1,
  });

  useEffect(() => {
    setValueForAdobe(variantTagsFlag, recommendedProducts?.products?.[0]?.meta?.tags?.[0]?.name);
  }, [variantTagsFlag, recommendedProducts]);

  const handleFilterProduct = (tags: string) => {
    const filterProducts = filterProductsOnTag(recommendedProducts.products, tags);
    setProductData(filterProducts);
  };

  if (!(recommendedProducts?.products?.length > 0)) {
    return null;
  }
  return (
    <section className="RecentlyViewProduct mt-2 pt-3">
      <div className="recommended-products">
        <PDPLabel label={recommendedProducts?.title} />
        {recommendedProducts?.globalTags?.length > 0 && (
          <div className="-mt-1 mb-3">
            <PDPTagsFilters
              tags={recommendedProducts?.globalTags}
              handleFilterProduct={handleFilterProduct}
              dsKey={recommendedProducts?.products?.[0]?.key}
            />
          </div>
        )}
        <ul
          className={"px-4 overflow-x-auto flex list-none mb-0.5"}
          dir="ltr"
          style={{
            scrollSnapType: "x mandatory",
          }}
          ref={dsWidgetRef}
        >
          {productsData?.map((product: any, index: number) => (
            <li
              key={product.id}
              className={"mr-2 mb-2 h-full rounded-sm px-2 py-3 relative"}
              style={{
                width: "150px",
                minWidth: "150px",
                boxShadow: "0 0 3px 0 rgba(0,0,0,.12",
                border: "1px solid rgba(0,0,0,.1)",
              }}
            >
              <TagsFlag variant={variantTagsFlag} tagName={product?.meta?.tags?.[0]?.name} />
              <div
                className="flex justify-center"
                onClick={e => {
                  miniPDPOnImgClick(product, index + 1);
                }}
              >
                <ImageComponent
                  alt={product?.assets[0]?.name}
                  style={{ width: "120px", height: "120px" }}
                  src={product?.assets[0]?.imageUrl?.["400x400"] || DEFAULT_IMG_PATH()}
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
              <p className="text-xs h-8 line-clamp-2 capitalize  mb-1.5">{product.cms[0]?.content.name}</p>

              <span className="font-semibold text-13 mr-1">{formatPrice(product.offerPrice, true)}</span>

              {product.offerPrice !== product.price && (
                <>
                  {/* change text color text-gray-400 to text-gray-500 for sufficient color contrast */}
                  <del className="text-11 text-gray-500 mr-1">{formatPrice(product.price, true)}</del>
                  <span className="text-11 font-bold text-green-600 lowercase">
                    {t("priceOffPercentage", [
                      Math.round(((product.price - product.offerPrice) / product.price) * 100).toString(),
                    ])}
                  </span>

                  {/* {SHOP.SITE_CODE === "mgp" && (
                    <span className="text-xs text-red-500 font-semibold tracking-wider">
                      <span className="font-sans">- </span>
                      {formatPrice(product.price - product.offerPrice, true)}
                    </span>
                  )}

                  {SHOP.SITE_CODE.match(/stb|tmc|orh/) && (
                    //  change text color text-red-500 to text-red-600 for sufficient color contrast
                    <span className="text-xs text-red-600 tracking-wider">
                      (-{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%)
                    </span>
                  )} */}
                </>
              )}

              <CTAButton
                loading={loading && productPosition === index + 1}
                CTA={t("addToBag")}
                clickAction={() => {
                  miniPDPProductData(product, index + 1);
                }}
              />
            </li>
          ))}
        </ul>

        {/* MiniPDP modal  starts */}
        {showMiniPDPModal && (
          <HomeMiniPDPModal
            show={showMiniPDPModal}
            onRequestClose={() => {
              setShowMiniPDPModal(false);
              // setLoader(true);
              // setShowSimilarProductModal(false);
            }}
            product={miniPDPProduct}
            icid={`${icid}_multiple-collection-carousel_${recommendedProducts?.title?.toLowerCase()}_1`}
            productPosition={productPosition}
            t={t}
            themeColor={"#f88d8d"} //f88d8d
            setMiniPDPFreeProduct={(freeProd: any) => {
              setMiniPDPFreeProduct(freeProd);
              setShowPDPFreeProductModal(true);
            }}
            widgetName={recommendedProducts?.title}
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
  );
};
export default PDPRecommendedProduct;
