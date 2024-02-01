import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";
import { useOptimize } from "@libHooks/useOptimize";
import useDsAdobe from "@libHooks/useDsAdobe";
import { useSplit } from "@libHooks/useSplit";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import SearchLabel from "@libComponents/Search/SearchLabel";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import TagsFlag from "@libComponents/TagsFlag";

import recommendationHelper from "@libUtils/recommendationHelper";
import { formatPrice } from "@libUtils/format/formatPrice";
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

const BestSellers = ({ item, widgetIndex, icid }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { widgetTagsFlag } = t("abTestExperimentIds")?.[0] || {};
  const [variantTagsFlag] = useOptimize([widgetTagsFlag]).variants;
  const { dsBestSellerSearchVariant } =
    useSplit({
      experimentsList: [{ id: "dsBestSellerSearchVariant" }],
      deps: [],
    }) || {};

  const [showDSBestSeller, setShowDSBestSeller] = useState<undefined | boolean>(undefined);
  const [widgetData, setWidgetData] = useState<any>();

  //A/B test for DS BestSeller
  // Will hide the DS BestSeller only when the variant is "0"
  useEffect(() => {
    if (dsBestSellerSearchVariant !== undefined) {
      setShowDSBestSeller(dsBestSellerSearchVariant !== "0");
    }
  }, [dsBestSellerSearchVariant]);

  useEffect(() => {
    setValueForAdobe(variantTagsFlag, widgetData?.products?.[0]?.meta?.tags?.[0]?.name);
  }, [variantTagsFlag, widgetData]);

  useEffect(() => {
    if (showDSBestSeller !== undefined) {
      recommendationHelper(item.meta?.widgetMeta, item.commonDetails, "", showDSBestSeller).then((res: any) => {
        setWidgetData(res);
      });
    }
  }, [showDSBestSeller]);

  const { dsWidgetRef } = useDsAdobe({
    title: item.commonDetails?.title,
    dsWidgetType: widgetData?.dsWidgetType,
    products: widgetData?.products,
    variantValue: widgetData?.variantValue,
    evarName: "evar92",
  });

  // Variable declaration for miniPDP modal
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [productPosition, setProductPosition] = useState();

  // miniPDPProductModal call method
  const miniPDPProductData = (product: any, productPosition: any) => {
    SOURCE_STATE.pdpSource = item?.commonDetails?.title || "other";
    SOURCE_STATE.addToBagSource = item?.commonDetails?.title || "other";
    setMiniPDPProduct(product);
    setProductPosition(productPosition);
    setShowMiniPDPModal(true);
  };

  if (widgetData?.products?.length === 0) {
    return <div />;
  }

  return (
    <ErrorBoundary>
      <section>
        <div className="bestsellers mt-9 mb-5">
          <SearchLabel label={item.commonDetails.title} />
          {widgetData?.products?.length > 0 && (
            <div dir="ltr" className="overflow-x-auto flex list-none pl-3" ref={dsWidgetRef}>
              {widgetData.products?.map((product: any, index: number) => (
                <React.Fragment key={product.id}>
                  <a
                    aria-hidden
                    onClick={e => {
                      miniPDPProductData(product, index + 1);
                    }}
                    aria-label={product.cms[0]?.content.name}
                  >
                    <div className="w-36 h-56 ml-0.5 my-0.5 border rounded-md bg-white p-2 mr-3.5  border-gray-200 shadow-sm relative">
                      <TagsFlag variant={variantTagsFlag} tagName={product?.meta?.tags?.[0].name} />
                      <div className="flex justify-center">
                        <ImageComponent
                          className="img-responsive text-center w-24 h-24"
                          src={product?.assets[0]?.imageUrl?.["400x400"]}
                          alt={product?.assets[0]?.name}
                        />
                      </div>
                      <div className="flex mt-2 mb-1 h-5">
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
                      <h2 className="text-xs font-bold mt-1 mb-0.5 truncate">{product.cms[0]?.content.name}</h2>
                      <h3 className="text-xs truncate mb-3 text-gray-600">{product?.cms[0]?.content?.subtitle}</h3>
                      <span className="text-lg mr-1">{formatPrice(product.offerPrice, true)}</span>

                      {product.offerPrice < product.price && (
                        <del className="text-base opacity-50 ml-1">{formatPrice(product.price, true)}</del>
                      )}
                    </div>
                  </a>
                </React.Fragment>
              ))}
            </div>
          )}
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
            widgetName={item.commonDetails?.title}
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
    </ErrorBoundary>
  );
};

export default BestSellers;
