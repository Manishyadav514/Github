import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getImage, generateICIDlink } from "@libUtils/homeUtils";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import HomeWidgetLabel from "./HomeWidgetLabel";

const SingleCollectionCarousel = ({ data, icid }: any) => {
  const products =
    data.commonDetails.descriptionData?.[0]?.relationalData?.products &&
    Object.values(data.commonDetails.descriptionData?.[0]?.relationalData.products);

  return (
    <section className="max-w-screen-xl my-14 mx-auto w-full homeWidget">
      <HomeWidgetLabel title={data.commonDetails.title} />

      <div className="flex w-full">
        <div style={{ width: "30%" }}>
          <Link href={data.commonDetails.descriptionData?.[0]?.value[0]?.urlManager?.url}>
            <LazyLoadImage
              alt="Collection"
              className="object-cover w-full h-full"
              src={getImage(data.commonDetails.descriptionData?.[0]?.value[0], "600x600")}
            />
          </Link>
        </div>

        <div style={{ width: "70%" }}>
          <GoodGlammSlider slidesPerView={3} className="SINGLE_COLLECTION">
            {products?.map((product: any, index: number) => (
              <div className="border text-center border-transparent bg-white p-4 hover:border-color1" key={product.id}>
                <Link href={generateICIDlink(product.urlManager?.url, icid, `${product.cms?.[0]?.content?.name}_${index + 1}`)}>
                  <LazyLoadImage src={getImage(product, "400x400")} alt={product.assets?.[0]?.name} className="mb-4" />
                  <p className="text-sm font-bold mb-2 truncate">{product.cms?.[0].content?.name}</p>
                  <p className="text-xs opacity-70 mb-2 truncate">{product.cms?.[0].content.subtitle}</p>
                  <div className="flex justify-center items-center">
                    <span className="font-bold mr-2">{formatPrice(product.offerPrice, true)}</span>
                    {product.offerPrice < product.price && (
                      <del className="text-xs text-gray-400">{formatPrice(product.price, true)}</del>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </GoodGlammSlider>
        </div>
      </div>
    </section>
  );
};

export default SingleCollectionCarousel;
