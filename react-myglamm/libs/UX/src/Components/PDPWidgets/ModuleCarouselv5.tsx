import React, { useEffect, useState } from "react";
import useTranslation from "@libHooks/useTranslation";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import recommendationHelper from "@libUtils/recommendationHelper";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import useDsAdobe from "@libHooks/useDsAdobe";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import { formatPrice } from "@libUtils/format/formatPrice";
import { showAddedToBagOrWishlist, showError } from "@libUtils/showToaster";
import useAddtoBag from "@libHooks/useAddToBag";
import { ParseJSON, filterProductsOnTag } from "@libUtils/widgetUtils";
import TagsFlag from "@libComponents/TagsFlag";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import PDPTagsFilters from "@libComponents/PDP/PDPTagsFilters";
import PDPRatingV2 from "./PDPRatingV2";

const HomeMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "HomeMiniPDPModal" */ "@libComponents/PopupModal/HomeMiniPDP"),
  { ssr: false }
);

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

const CTAButton = dynamic(() => import("@libComponents/PDP/PDPCTAButton"), { ssr: false });

const ModuleCarousel5 = ({ item, icid, productSKU, dsDataLoaded = () => {}, disableTitle = false }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [widgetData, setWidgetData] = useState<any>();
  const [productsData, setProductData] = useState<any[]>([]);
  const [isBestPrice, setIsBestPrice] = useState<boolean>(false);
  const { evarName, title, showShadesText } = ParseJSON(item.meta?.widgetMeta);
  const widgetTitle = item.commonDetails?.title?.trim();

  useEffect(() => {
    recommendationHelper(item.meta?.widgetMeta, item.commonDetails, productSKU || "").then((res: any) => {
      setWidgetData(res);
      setIsBestPrice(res?.isBestPrice);
      setProductData(res?.products);
      dsDataLoaded();
    });
  }, []);

  const { dsWidgetRef } = useDsAdobe({
    title: widgetData?.dsTitle || widgetTitle,
    dsWidgetType: widgetData?.dsWidgetType,
    products: widgetData?.products,
    variantValue: widgetData?.variantValue || "Default",
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

  const handleFilterProduct = (tags: string) => {
    const filterProducts = filterProductsOnTag(widgetData.products, tags);
    setProductData(filterProducts);
  };

  return (
    <ErrorBoundary>
      <section className="Module-carousel-5 py-5 rounded-3 border-b-4 border-themeGray" role="banner">
        <div>
          <p className={`text-15 font-bold pb-4 px-4 capitalize ${disableTitle && "hidden"}`}>
            {widgetData?.dsTitle || item?.commonDetails?.title || t("similarProducts") || "Similar Products"}
          </p>
          {widgetData?.globalTags?.length > 0 && (
            <div className="-mt-1 mb-3">
              <PDPTagsFilters
                tags={widgetData?.globalTags}
                handleFilterProduct={handleFilterProduct}
                dsKey={widgetData?.products?.[0]?.key}
              />
            </div>
          )}
          <ul
            className="overflow-x-auto flex list-none px-3"
            dir="ltr"
            style={{
              scrollSnapType: "x mandatory",
            }}
            ref={dsWidgetRef}
          >
            {productsData?.map((product: any, index: number) => (
              <li
                key={product.id}
                className="mr-2 h-full rounded-3 bg-white overflow-hidden"
                style={{
                  width: "125px",
                  minWidth: "125px",
                  boxShadow: "0 0 1px 0 rgba(0,0,0,.12)",
                  border: "0.745px solid #EFEFEF",
                }}
              >
                <div
                  className="flex justify-center"
                  onClick={e => {
                    miniPDPOnImgClick(product, index + 1);
                  }}
                >
                  <ImageComponent
                    style={{ width: "124px", height: "124px" }}
                    src={product?.assets[0]?.imageUrl?.["400x400"]}
                    alt={product.cms[0]?.content.name || product?.assets[0]?.title || product?.assets[0]?.name}
                    className="rounded-t-3"
                  />
                </div>
                <div className="p-1.5">
                  <div className="h-5 -mt-4">
                    <PDPRatingV2 avgRating={product?.rating?.avgRating} fontSize={10} svgSize={9} />
                  </div>
                  <div className="text-sm">
                    <p className="text-11 leading-tight line-clamp-2 my-1 h-7">{product.cms[0]?.content.name}</p>
                    {/* <p className="truncate mb-4 text-10 text-gray-500 leading-none">{product.cms[0]?.content.subtitle}</p> */}
                  </div>
                  <div className="flex line-clamp-1 h-4 overflow-hidden ">
                    <p className="font-semibold text-13 mr-1.5">{formatPrice(product.offerPrice, true)}</p>
                    {product.offerPrice < product.price && (
                      // change text color text-gray-400 to text-gray-500 for sufficient color contrast
                      <>
                        <del className="text-11 text-gray-500 mr-1 mt-0.5">{formatPrice(product.price, true)}</del>
                        <span className="text-11 font-bold text-green-600 lowercase mt-0.5">
                          {t("priceOffPercentage", [
                            Math.round(((product.price - product.offerPrice) / product.price) * 100).toString(),
                          ])}
                        </span>
                      </>
                    )}
                  </div>
                  {isBestPrice && (
                    <div className="flex flex-col h-6 mb-2 mt-1">
                      {(() => {
                        const sortedCouponList = [...(product?.couponList || [])].sort(
                          (a, b) => a.payableAmount - b.payableAmount
                        );
                        const lowestPayableAmount = sortedCouponList[0]?.payableAmount;

                        return (
                          <>
                            {lowestPayableAmount && (
                              <>
                                <p className="line-clamp-1 text-green-600 font-semibold mr-1.5 text-[10px]">
                                  Best Price {formatPrice(lowestPayableAmount, true)}
                                </p>
                                <p className="line-clamp-1 font-normal mr-1 text-[10px]">with coupon</p>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}

                  <div className="mt-1">
                    {product?.isPreOrder ? (
                      <CTAButton
                        loading={loading && productPosition === index + 1}
                        CTA={t("preOrderNow")}
                        clickAction={() => {
                          handleAddToBag(product, index + 1);
                        }}
                        isNewDesign={true}
                      />
                    ) : (
                      <CTAButton
                        loading={loading && productPosition === index + 1}
                        CTA={showShadesText ? (product.hasShade ? `Show ${t("shade")}` : t("addToBag")) : t("addToBag")}
                        clickAction={() => {
                          handleAddToBag(product, index + 1);
                        }}
                        isNewDesign={true}
                      />
                    )}
                  </div>
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

export default ModuleCarousel5;
