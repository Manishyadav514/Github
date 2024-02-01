import React, { useState } from "react";

import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";
import useAppRedirection from "@libHooks/useAppRedirection";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { isWebview } from "@libUtils/isWebview";
import { formatPrice } from "@libUtils/format/formatPrice";

import StarIcon from "../../../../../libs/UX/public/svg/star-filled.svg";

const HomeMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "HomeMiniPDPModal" */ "@libComponents/PopupModal/HomeMiniPDP"),
  { ssr: false }
);

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

const BannerProductCarousel = ({ item, icid }: any) => {
  const { t } = useTranslation();
  const widgetMeta = item?.meta?.widgetMeta ? JSON.parse(item?.meta?.widgetMeta) : "";

  // Variable declaration for miniPDP modal
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [productPosition, setProductPosition] = useState();
  const { redirect } = useAppRedirection();

  // miniPDPProductModal call method
  const miniPDPProductData = (product: any, position: any) => {
    if (isWebview()) {
      redirect(`${product.urlManager?.url}?clickAction=add-to-bag&showMiniPdp=true`, true);
    } else {
      setMiniPDPProduct(product);
      setProductPosition(position);
      setShowMiniPDPModal(true);
    }
  };

  return (
    <ErrorBoundary>
      <section
        className="w-full"
        style={{
          background: widgetMeta.bgColor ? widgetMeta.bgColor : `url(${widgetMeta.bgImageUrl}) no-repeat 100% 100%`,
        }}
      >
        <div className="bestsellers pb-4 pl-6 pr-2">
          <div>
            <div dir="ltr" className="overflow-x-auto flex list-none">
              {item?.commonDetails?.descriptionData?.[0]?.value?.map((product: any, key: number) => (
                <React.Fragment key={product.id}>
                  <a
                    aria-hidden
                    onClick={e => {
                      miniPDPProductData(product, key + 1);
                    }}
                    className="mr-2"
                    aria-label={product?.assets[0]?.name}
                  >
                    <div className="w-[160px] h-60 borderrounded-md bg-white p-2 border-gray-200">
                      <ImageComponent
                        className="img-responsive mx-auto w-28 h-28"
                        src={product?.assets[0]?.imageUrl?.["400x400"]}
                        alt={product?.assets[0]?.name}
                      />

                      <span
                        className={`${
                          product?.rating?.avgRating > 0 ? "" : "opacity-0"
                        } h-5 w-10 border border-gray-200 font-semibold text-10 p-1.5 flex justify-between items-center rounded mt-2 mb-1`}
                      >
                        {product?.rating?.avgRating} <StarIcon className="w-2 h-2" />
                      </span>
                      <h2 className="text-11 font-bold mt-1  truncate">{product.cms[0]?.content.name}</h2>

                      <h3 className="text-10 truncate mb-2 text-gray-600">{product?.cms[0]?.content?.subtitle}</h3>
                      <div className="flex mb-1 h-3.5">
                        {product.shades.length > 0 ? (
                          <>
                            {product?.shades?.slice(0, 2)?.map((shade: any, index: number) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <div key={index} className="relative mr-1">
                                {index === 0 && <div className="h-1 w-1 rounded-full bg-white absolute m-auto inset-0 " />}
                                <img src={shade.shadeImage} alt={shade.shadeLabel} className="w-3.5 h-3.5 rounded" />
                              </div>
                            ))}
                            {product.shadeCount > 2 && (
                              <span className="text-xxs opacity-80 ml-0.5 uppercase">
                                +{product.shadeCount - 2}&nbsp;
                                {product.shadeCount - 2 === 1 ? t("shade") : t("shades")}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xxs opacity-80 uppercase">
                            {!product.shadeLabel && product.shadeLabel?.trim() === ""
                              ? product.subCategory
                              : product.shadeLabel}
                          </span>
                        )}
                      </div>
                      <span className="mr-1 text-base font-semibold">{formatPrice(product.offerPrice, true)}</span>

                      {product.offerPrice < product.price && (
                        <del className="text-base opacity-50 ml-1">{formatPrice(product.price, true)}</del>
                      )}
                    </div>
                    <span
                      className="text-11 flex justify-center mt-1 text-center"
                      dangerouslySetInnerHTML={{
                        __html: product?.cms[0]?.content?.insight,
                      }}
                    />
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
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

export default BannerProductCarousel;
