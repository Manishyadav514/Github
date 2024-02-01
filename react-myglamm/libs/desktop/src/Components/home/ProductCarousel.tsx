import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getImage, generateICIDlink } from "@libUtils/homeUtils";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import useTranslation from "@libHooks/useTranslation";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import HomeWidgetLabel from "./HomeWidgetLabel";

const ProductCarousel = ({ data, icid }: any) => {
  const { t } = useTranslation();

  return (
    <section className="max-w-screen-xl my-14 mx-auto w-full">
      <HomeWidgetLabel title={data.commonDetails.title} />
      <GoodGlammSlider slidesPerView={4} arrowClass={{ left: "-left-8", right: "-right-8" }}>
        {data.commonDetails.descriptionData[0].value.map((product: any, index: number) => (
          <div key={product.id} className="p-4">
            <Link href={generateICIDlink(product?.urlManager?.url, icid, `${product?.cms?.[0]?.content?.name}_${index + 1}`)}>
              <figure className="animateHomeDiv pt-2.5 px-2.5 bg-white rounded-md shadow-md hover:scale-105	">
                <LazyLoadImage
                  placeholderSrc={DEFAULT_IMG_PATH()}
                  style={{ minHeight: "250px" }}
                  alt={product.assets[0]?.name}
                  src={getImage(product, "400x400")}
                />
                <div className="productDesc mt-6 py-4 text-center">
                  <p className="name text-sm font-semibold mt-0 mb-1.5 truncate text-black">
                    {product.cms?.[0]?.content?.name}
                  </p>
                  <p className="subtitle text-xs mb-2.5 truncate text-black opacity-70">{product.cms?.[0].content.subtitle}</p>
                  {(data?.commonDetails?.title?.toLowerCase().replace(/ /g, "") === "bestseller" ||
                    data?.commonDetails?.title?.toLowerCase().replace(/ /g, "") === "bestsellers") && (
                    <div
                      className={`avg-rating-count my-2.5 w-full p-0 flex justify-center ${
                        product?.rating?.totalCount ? "" : "opacity-0"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="avg-rating pr-2 font-semibold text-lg">{product?.rating?.avgRating}</span>
                        <i className="ico-star icon-star text-color1 text-22 h-7" />
                        <span className="border-left pl-4 ml-2.5 text-base font-thin relative border-l border-gray-300">
                          {product?.rating?.totalCount} &nbsp;{t("ratings")}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="priceDetail inline-flex text-lg ">
                    <span className="offerPrice font-semibold mr-2.5">{formatPrice(product.offerPrice, true)}</span>
                    {product.offerPrice < product.price && (
                      <del className="actualPrice text-sm mt-1 text-stone-400">{formatPrice(product.price, true)}</del>
                    )}
                  </div>
                </div>
              </figure>
            </Link>
          </div>
        ))}
      </GoodGlammSlider>
    </section>
  );
};

export default ProductCarousel;
