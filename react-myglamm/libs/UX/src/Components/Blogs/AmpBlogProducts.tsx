import React from "react";
import { formatPrice } from "@libUtils/format/formatPrice";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import useTranslation from "@libHooks/useTranslation";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const AmpBlogProducts = ({ descriptionData }: any) => {
  const { t } = useTranslation();

  return (
    <section>
      <div>
        {descriptionData[0]?.value.map((product: any) => {
          const img = product?.assets?.find((a: any) => a.type === "image");

          return (
            <div className="mb-6">
              <div className="product-card p-3">
                <div className="product-heading">
                  <div>
                    <amp-img width="65" height="65" src={img?.imageUrl["200x200"] || DEFAULT_IMG_PATH()} alt={img?.name} />
                  </div>

                  <div className="pl-2 flex flex-col justify-between">
                    <div>
                      <p className="text-custom  font-bold uppercase ">
                        {product?.cms[0]?.content?.name || product.productTag}
                      </p>

                      <p className="text-custom text-gray-700  mb-3">{product?.cms[0]?.content?.subtitle}</p>
                    </div>
                    <div>
                      <p className="text-custom text-gray-700 font-bold uppercase">
                        {product?.cms[0]?.content?.name.split("-")[1] || product.productTag.split("-")[1]}{" "}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pl-1">
                  {product?.rating?.avgRating > 0 && (
                    <div aria-hidden="true" className="flex  justify-start w-1/4 i-amphtml-sizer-intrinsic ">
                      <span
                        className={`${
                          product.rating?.avgRating > 0 ? "" : "opacity-0"
                        } h-5 w-11 border border-rating font-semibold  flex justify-center  text-rating p-1 items-center rounded  mb-1`}
                      >
                        {product?.rating?.avgRating}

                        <amp-img
                          src={getStaticUrl("/images/ico-star-filled.png")}
                          className="ml-2"
                          alt="ratings-icon"
                          width="12"
                          height="12"
                        />
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  {product.price > product.offerPrice && (
                    <div className="px-4 flex justify-between w-3/4 items-center">
                      <span className="font-bold text-base mr-1.5">{formatPrice(product.offerPrice, true)}</span>
                      <del className="text-sm text-gray-400 font-semibold mr-4">{formatPrice(product.price, true)}</del>
                      <span className="text-base  font-bold  text-color1">
                        {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% off
                      </span>
                    </div>
                  )}
                  {product?.shades?.length > 0 && (
                    <div className="px-2 py-1 flex items-center justify-between">
                      <div className="flex items-center mb-1 h-3.5 ml-2.5">
                        <>
                          {product.shades.slice(0, 2).map((shade: any, indexKey: number) => (
                            <div key={indexKey} className="relative mr-1">
                              {indexKey === 0 && <div className="h-1 w-1 rounded-full bg-white absolute m-auto inset-0" />}
                              <amp-img
                                src={shade.shadeImage}
                                alt={shade.shadeLabel}
                                className="w-5 h-5 rounded"
                                width="19"
                                height="19"
                              />
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

              <div className="bg-black mt-4">
                <a
                  href={`${product?.urlManager?.url}?click-action=add-to-bag`}
                  style={{
                    border: "solid 1px black",
                    borderRadius: "5px",
                    color: "white",
                    backgroundColor: "var(--color1)",
                  }}
                  className="mx-auto font-bold flex p-2 justify-center"
                  aria-label={t("addToBag")}
                >
                  {t("addToBag")}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AmpBlogProducts;
