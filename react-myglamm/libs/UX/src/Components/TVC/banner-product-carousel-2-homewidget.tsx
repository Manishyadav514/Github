import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";
import useAppRedirection from "@libHooks/useAppRedirection";

import { isWebview } from "@libUtils/isWebview";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import StarIcon from "../../../../../libs/UX/public/svg/star-filled.svg";
import { formatPrice } from "@libUtils/format/formatPrice";

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
  const router = useRouter();
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
        <div className="bestsellers pb-8 pl-4">
          {/* <SearchLabel label={item.commonDetails.title} /> */}
          <div>
            <div dir="ltr" className="overflow-x-auto flex list-none">
              {item.commonDetails.descriptionData[0]?.value.map((product: any, key: number) => (
                <React.Fragment key={product.id}>
                  {/* <Link href={product.urlManager.url} prefetch={false}> */}
                  <a
                    aria-hidden
                    onClick={e => {
                      miniPDPProductData(product, key + 1);
                    }}
                    aria-label={product?.assets[0]?.name}
                  >
                    <div className=" border rounded-md bg-white p-2 mr-2  border-gray-200 h-[290px] w-[180px]">
                      <div className="flex justify-center">
                        <ImageComponent
                          className="w-40 h-40 mx-auto"
                          src={product?.assets[0]?.imageUrl?.["400x400"]}
                          alt={product?.assets[0]?.name}
                        />
                      </div>

                      <span
                        className={`${
                          product?.rating?.avgRating > 0 ? "" : "opacity-0"
                        } h-5 w-10 border border-gray-200 font-semibold text-10 p-1.5 flex justify-between items-center rounded mt-2 mb-1`}
                      >
                        {product.rating?.avgRating} <StarIcon className="w-2 h-2" />
                      </span>
                      <p className="text-xs h-9 overflow-hidden capitalize mb-1.5">{product.cms[0]?.content.name}</p>

                      <div className="flex mb-1 h-3.5">
                        {product.shades.length > 0 ? (
                          <>
                            {product.shades.slice(0, 2).map((shade: any, index: number) => (
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
                      <span className="font-semibold mr-1.5">{formatPrice(product.offerPrice, true)}</span>

                      {product.offerPrice < product.price && (
                        <>
                          {/* change text color text-gray-400 to text-gray-500 for sufficient color contrast */}
                          <del className="text-xs text-gray-500 mr-2">{formatPrice(product.price, true)}</del>
                          <span className="text-xs text-red-500 font-semibold tracking-wider">
                            {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </a>
                  {/* </Link> */}
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
    </ErrorBoundary>
  );
};

export default BannerProductCarousel;
