import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { formatPrice } from "@libUtils/format/formatPrice";
import { generateICIDlink, getImage } from "@libUtils/homeUtils";

import useTranslation from "@libHooks/useTranslation";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import HomeWidgetLabel from "./HomeWidgetLabel";

const BannerProductCarousel2 = (props: any) => {
  const { data, icid } = props;
  const { t } = useTranslation();

  const widgetMeta = data.meta.widgetMeta && JSON.parse(data.meta.widgetMeta);

  return (
    <section className="homeWidget max-w-screen-xl my-14 mx-auto w-full">
      <HomeWidgetLabel title={data.commonDetails.title} />
      <div className="flex relative bg-white w-full">
        <div className="w-2/5">
          <img src={widgetMeta?.bannerImage} alt="Collection" className="collectionImg w-full object-cover h-full" />
        </div>
        <div
          style={{
            background: widgetMeta.bgColor ? widgetMeta.bgColor : `url(${widgetMeta.bgImageUrl})`,
          }}
          className="w-3/5"
        >
          <GoodGlammSlider slidesPerView={3.5} className="SINGLE_COLLECTION">
            {data.commonDetails.descriptionData[0]?.value.map((product: any, index: number) => (
              <div className="p-4 pr-0">
                <div className="border bg-white flex my-auto p-2 justify-between rounded-sm" key={product.id}>
                  <Link
                    href={generateICIDlink(product.urlManager?.url, icid, `${product?.cms?.[0]?.content?.name}_${index + 1}`)}
                  >
                    <LazyLoadImage
                      alt={product?.assets?.[0]?.name}
                      src={getImage(product, "400x400")}
                      className="mx-auto flex items-center mb-4 productImg"
                    />

                    <span
                      className={`${
                        product.rating?.avgRating > 0 ? "" : "opacity-0"
                      } h-5 w-12 border border-gray-200 productRating items-center font-semibold text-sm p-1.5 flex justify-between  rounded mb-2`}
                    >
                      {product.rating?.avgRating} <i className="ico-star icon-star ml-1" style={{ color: "var(--color1)" }} />
                    </span>
                    <p className="text-sm h-10 line-clamp-2 productName mb-2">{product.cms?.[0]?.content.name}</p>

                    <div className="flex items-center mb-4 h-3.5">
                      {product.shades.length > 0 ? (
                        <>
                          {product.shades.slice(0, 2).map((shade: any, productIndex: number) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={`productIndex_${productIndex}`} className="relative mr-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-white absolute m-auto inset-0" />
                              <img src={shade.shadeImage} alt={shade.shadeLabel} className="w-5 h-5 rounded shadeImg" />
                            </div>
                          ))}
                          {product.shadeCount > 2 && (
                            <span className="text-sm opacity-80 flex justify-center items-center shadeLabel ml-0.5 uppercase">
                              +{product.shadeCount - 2}&nbsp;
                              {product.shadeCount - 2 === 1 ? t("shade") : t("shades")}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm opacity-80  uppercase">
                          {!product.shadeLabel && product.shadeLabel?.trim() === "" ? product.subCategory : product.shadeLabel}
                        </span>
                      )}
                    </div>
                    <div className="priceDetails mt-4 mb-2">
                      <span className="offerPrice text-xl font-bold">{formatPrice(product.offerPrice, true)}</span>
                      {product.offerPrice < product.price && (
                        <del className="actualPrice">{formatPrice(product.price, true)}</del>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </GoodGlammSlider>
        </div>
      </div>
    </section>
  );
};

export default BannerProductCarousel2;
