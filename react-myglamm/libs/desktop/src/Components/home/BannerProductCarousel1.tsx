import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import useTranslation from "@libHooks/useTranslation";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import { decodeHtml } from "@libUtils/decodeHtml";
import { formatPrice } from "@libUtils/format/formatPrice";
import { generateICIDlink, getImage } from "@libUtils/homeUtils";

const BannerProductCarousel1 = (props: any) => {
  const { data, icid } = props;
  const { t } = useTranslation();
  const widgetMeta = data.meta.widgetMeta && JSON.parse(data.meta.widgetMeta);

  return (
    <section
      className="mx-auto independentProductCarousel-1 max-w-screen-xl"
      style={{
        background: widgetMeta.bgColor || `url(${widgetMeta.bgImageUrl}) no-repeat`,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="w-full flex mx-auto productCarouselDiv">
        <GoodGlammSlider slidesPerView={4}>
          {data?.commonDetails?.descriptionData?.[0]?.value.map((product: any, index: number) => (
            <div key={product.id}>
              <Link href={generateICIDlink(product.urlManager?.url, icid, `${product?.cms?.[0]?.content?.name}_${index + 1}`)}>
                <figure className="rounded-sm px-4 pt-2 bg-white">
                  <LazyLoadImage
                    alt={product?.assets?.[0]?.name}
                    src={getImage(product, "400x400")}
                    className="text-center productImage mx-auto  flex justify-center"
                  />
                  <span
                    className={`${
                      product.rating?.avgRating > 0 ? "" : "opacity-0"
                    } productRating border border-gray-200 font-semibold text-sm p-1.5 flex justify-between items-center rounded mt-2 mb-2`}
                  >
                    {product.rating?.avgRating}

                    <i className="ico-star icon-star ml-1 mt-0.5" style={{ color: "var(--color1)" }} />
                  </span>
                  <p className="name mx-auto mb-1 font-bold truncate">{product.cms?.[0]?.content.name}</p>
                  <p className="subtitle truncate h-6 text-sm opacity-50 productSubtitle">
                    {product.cms?.[0].content.subtitle}
                  </p>
                  <div className="flex items-center mb-1 h-3.5">
                    {product.shades.length > 0 ? (
                      <>
                        {product.shades.slice(0, 2).map((shade: any, productShadeindex: number) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={productShadeindex} className="relative mr-1">
                            {productShadeindex === 0 && (
                              <div className="h-1.5 w-1.5 rounded-full bg-white absolute m-auto inset-x-0 top-3.5" />
                            )}
                            <img src={shade.shadeImage} alt={shade.shadeLabel} className="w-5 h-5 shadesImg rounded" />
                          </div>
                        ))}
                        {product.shadeCount > 2 && (
                          <span className="text-sm  productShadesLabel ml-1 uppercase">
                            +{product.shadeCount - 2}&nbsp;
                            {product.shadeCount - 2 === 1 ? t("shade") : t("shades") || "shades"}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm productShadesLabel uppercase">
                        {!product.shadeLabel && product.shadeLabel?.trim() === "" ? product.subCategory : product.shadeLabel}
                      </span>
                    )}
                  </div>
                  <div className="productDesc mt-4 text-center">
                    <div className="flex items-center justify-center  py-3">
                      <span className="offerPrice mr-2 font-bold">{formatPrice(product.offerPrice, true)}</span>
                      {product.offerPrice < product.price && (
                        <del className="actualPrice  opacity-50">{formatPrice(product.price, true)}</del>
                      )}
                    </div>
                  </div>
                </figure>
                <div
                  className="text-center pt-4 text-black insights text-xl"
                  dangerouslySetInnerHTML={{
                    __html: decodeHtml(product.cms?.[0].content?.insight, {
                      stripSlash: true,
                    }),
                  }}
                />
              </Link>
            </div>
          ))}
        </GoodGlammSlider>
      </div>
    </section>
  );
};

export default BannerProductCarousel1;
