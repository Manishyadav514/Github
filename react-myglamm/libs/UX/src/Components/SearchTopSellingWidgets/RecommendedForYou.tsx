import React, { useEffect, useState } from "react";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import recommendationHelper from "@libUtils/recommendationHelper";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import SearchLabel from "@libComponents/Search/SearchLabel";
import useTranslation from "@libHooks/useTranslation";
import { useRouter } from "next/router";

// import Adobe from "@libUtils/analytics/adobe";
import useDsAdobe from "@libHooks/useDsAdobe";
import dynamic from "next/dynamic";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import { formatPrice } from "@libUtils/format/formatPrice";
import TagsFlag from "@libComponents/TagsFlag";
import { useOptimize } from "@libHooks/useOptimize";
import { setValueForAdobe } from "@libUtils/widgetUtils";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";

const HomeMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "HomeMiniPDPModal" */ "@libComponents/PopupModal/HomeMiniPDP"),
  { ssr: false }
);

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

const RecommendedForYou = ({ key, item, widgetIndex, icid }: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [recommendedProducts, setrecommendedProducts] = useState<any>();
  const experimentIds = t("abTestExperimentIds");
  const { variant } = useOptimize(experimentIds[0]?.["widgetTagsFlag"]);

  useEffect(() => {
    recommendationHelper(item.meta?.widgetMeta, item.commonDetails).then((res: any) => setrecommendedProducts(res));
  }, []);

  const { dsWidgetRef } = useDsAdobe({
    title: item.commonDetails?.title,
    dsWidgetType: recommendedProducts?.dsWidgetType,
    products: recommendedProducts?.products,
  });

  useEffect(() => {
    setValueForAdobe(variant, recommendedProducts?.products?.[0]?.meta?.tags?.[0]?.name);
  }, [variant, recommendedProducts]);

  // Variable declaration for miniPDP modal
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [productPosition, setProductPosition] = useState();

  // on click product card event
  const miniPDPProductData = (product: any, productPosition: any) => {
    SOURCE_STATE.pdpSource = item?.commonDetails?.title || "other";
    SOURCE_STATE.addToBagSource = item?.commonDetails?.title || "other";
    // check if request from search page
    if (router.pathname === "/search") {
      setMiniPDPProduct(product);
      setProductPosition(productPosition);
      setShowMiniPDPModal(true);
    } else {
      const productUrl: string = !icid
        ? `${product.urlManager.url}`
        : `${product.urlManager.url}?icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_${productPosition}`;

      router.push(productUrl);
    }
  };

  return (
    <ErrorBoundary>
      {recommendedProducts?.products?.length > 0 && (
        <section className="RecommendedForYouWidget mt-9 mb-5">
          <SearchLabel label={item.commonDetails.title} />

          <div
            className=" overflow-x-auto flex list-none pl-3"
            dir="ltr"
            style={{
              scrollSnapType: "x mandatory",
            }}
            ref={dsWidgetRef}
          >
            {recommendedProducts?.products?.map((product: any, index: number) => (
              <div
                className="mr-3  ml-0.5 my-0.5 border  shadow rounded-md px-2.5 py-2 w-48 relative"
                style={{ height: "300px" }}
                key={product.id}
              >
                <TagsFlag variant={variant} tagName={product?.meta?.tags?.[0].name} />
                <a
                  aria-hidden
                  onClick={e => {
                    miniPDPProductData(product, index + 1);
                  }}
                  aria-label={product.cms[0]?.content.name}
                >
                  <div className="flex justify-center px-0.5" style={{ width: "158px" }}>
                    <ImageComponent
                      src={product?.assets[0]?.imageUrl?.["400x400"]}
                      alt={product?.assets[0]?.name}
                      className="w-40 h-40"
                    />
                  </div>
                  <div className="flex my-1 h-5">
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
                    <p className="text-11 font-bold line-clamp-2 mt-1">{product.cms[0]?.content.name}</p>
                    {/* <p className="text-xs truncate" style={{ color: "#949494" }}>
                    {product?.cms[0]?.metadata?.description?.substring(0, 30)}
                    {product?.cms[0]?.metadata?.description?.length > 31 &&
                      "..."}
                  </p> */}
                    <p className="truncate my-1 text-10 text-gray-500">{product.cms[0]?.content.subtitle}</p>
                  </div>

                  <div className="">
                    <div className="flex">
                      <p className="flex text-14 font-bold mr-2">{formatPrice(product.offerPrice, true)}</p>
                      {product.offerPrice < product.price && (
                        <del
                          className="flex items-center text-sm font-light text-left text-gray-600 opacity-60"
                          style={{ marginTop: "0.15rem" }}
                        >
                          {formatPrice(product.price, true)}
                        </del>
                      )}
                    </div>
                  </div>
                  {/* </li> */}
                </a>
              </div>
            ))}
          </div>
          {/* MiniPDP modal  starts */}
          {showMiniPDPModal && (
            <HomeMiniPDPModal
              show={showMiniPDPModal}
              onRequestClose={() => setShowMiniPDPModal(false)}
              product={miniPDPProduct}
              icid={icid}
              productPosition={productPosition}
              t={t}
              themeColor="#f88d8d" //f88d8d
              setMiniPDPFreeProduct={(freeProd: any) => {
                setMiniPDPFreeProduct(freeProd);
                setShowPDPFreeProductModal(true);
              }}
              widgetName={item.commonDetails.title}
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
        </section>
      )}
    </ErrorBoundary>
  );
};

export default RecommendedForYou;
