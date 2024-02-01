import React, { useState } from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import AddToBagButton from "@libComponents/Buttons/AddToBagButton";

import StarIcon from "../../../public/svg/star-filled.svg";
import { formatPrice } from "@libUtils/format/formatPrice";

const HomeMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "HomeMiniPDPModal" */ "@libComponents/PopupModal/HomeMiniPDP"),
  { ssr: false }
);

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

const BlogProducts = ({ descriptionData }: any) => {
  const { t } = useTranslation();

  // Variable declaration for miniPDP modal
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [productPosition, setProductPosition] = useState();

  // miniPDPProductModal call method
  const callMiniPDP = (product: any) => {
    setMiniPDPProduct(product);
    setShowMiniPDPModal(true);
  };

  return (
    <section>
      <div className="blog-products">
        {descriptionData[0]?.value.map((product: any) => {
          const img = product?.assets.find((a: any) => a.type === "image");

          return (
            <>
              <div className="mx-2 mt-2 py-1 bg-white border" key={product.id}>
                <a
                  className="flex  px-4 pt-3 pb-2 relative"
                  href={product.urlManager.url}
                  //  prefetch={false}
                  aria-label={product?.cms[0]?.content?.name || product.productTag}
                >
                  <div className="w-1/4">
                    <ImageComponent alt={img?.name} style={{ maxHeight: "130px" }} src={img?.imageUrl["200x200"]} />
                  </div>
                  <div className="w-3/4">
                    <h3 className="text-xs font-bold uppercase leading-tight mb-1" style={{ padding: "0px 15px" }}>
                      {product?.cms[0]?.content?.name || product.productTag}
                    </h3>
                    <p className="mx-4 text-11 font-semibold truncate  mb-4 text-gray-400">
                      {product?.cms[0]?.content?.subtitle}
                    </p>
                    {product?.shadeLabel && (
                      <span className="text-xs font-semibold mx-4 text-gray-400 uppercase">{product.shadeLabel}</span>
                    )}{" "}
                  </div>
                </a>

                <div className="flex justify-between  px-4 items-center">
                  {product?.rating?.avgRating > 0 && (
                    <div aria-hidden="true" className="flex  justify-start w-1/4">
                      <span
                        className={`${
                          product.rating?.avgRating > 0 ? "" : "opacity-0"
                        } h-5 w-11 border border-gray-200 font-semibold text-xs p-1.5 flex justify-between items-center rounded  mb-1`}
                      >
                        {product?.rating?.avgRating}
                        <StarIcon className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                  {product.price > product.offerPrice && (
                    <div className="px-4 flex justify-between w-3/4 items-center">
                      <span className="font-bold text-base mr-1.5">{formatPrice(product.offerPrice, true)}</span>
                      <del className="text-sm text-gray-400 font-semibold mr-4">{formatPrice(product.price, true)}</del>
                      <span className="text-base  font-bold  text-color1">
                        {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% off
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  {product?.shades?.length > 0 && (
                    <div className="px-2 py-1 flex items-center justify-between">
                      <div className="flex items-center mb-1 h-3.5 ml-2.5">
                        <>
                          {product.shades.slice(0, 2).map((shade: any, indexKey: number) => (
                            <div key={indexKey} className="relative mr-1">
                              {indexKey === 0 && <div className="h-1 w-1 rounded-full bg-white absolute m-auto inset-0" />}
                              <img src={shade.shadeImage} alt={shade.shadeLabel} className="w-5 h-5 rounded" />
                            </div>
                          ))}
                          {product?.shadeCount > 2 && (
                            <span className="text-xxs opacity-80 ml-0.5 uppercase">
                              +{product.shadeCount - 2}&nbsp;
                              {product.shadeCount - 2 === 1 ? t("shade") : t("shades")}
                            </span>
                          )}
                        </>
                      </div>
                    </div>
                  )}
                  {product.price <= product.offerPrice && (
                    <div className="flex pr-4">
                      <span className="font-bold text-base mr-1.5">{formatPrice(product.price, true)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div aria-hidden="true" className="flex flex-col justify-center items-center px-2 py-2 w-full">
                <AddToBagButton product={product} callMiniPDP={callMiniPDP} showMiniPDP instoryProduct />
              </div>
            </>
          );
        })}
      </div>

      {/* MiniPDP modal  starts */}
      {showMiniPDPModal && (
        <HomeMiniPDPModal
          show={showMiniPDPModal}
          onRequestClose={() => setShowMiniPDPModal(false)}
          product={miniPDPProduct}
          icid=""
          productPosition={productPosition}
          t={t}
          themeColor="var(--color1)" //f88d8d
          setMiniPDPFreeProduct={(freeProd: any) => {
            setMiniPDPFreeProduct(freeProd);
            setShowPDPFreeProductModal(true);
          }}
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
  );
};

export default BlogProducts;
