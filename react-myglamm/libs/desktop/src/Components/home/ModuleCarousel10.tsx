import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import { generateICIDlink, getImage } from "@libUtils/homeUtils";

const ModuleCarousel10 = (props: any) => {
  const { data, icid } = props;
  const widgetMeta = data.meta.widgetMeta && JSON.parse(data.meta.widgetMeta);

  const products = data.commonDetails?.descriptionData?.[0]?.value;

  return (
    <section className="w-full flex mx-auto max-w-screen-xl mb-8">
      <div className="relative moduleCarouselBanner-10">
        {/* <a href="/collection/tlc-co-created-with-you"> */}
        <img src={widgetMeta?.bgBanner} alt="Collection" className="collectionImg h-full w-full" />
        {/* </a> */}
      </div>
      <div
        className={`flex pt-44 items-center mx-auto flex-col justify-around moduleCarouselDiv-10 relative pb-8 ${
          products?.length > 3 ? "px-10" : "px-16"
        }`}
        style={{
          background: widgetMeta.bgColor || `url(${widgetMeta.bgImageUrl}) no-repeat`,
          backgroundSize: "100% 100%",
        }}
      >
        <GoodGlammSlider
          slidesPerView={products?.length > 3 ? 3.5 : products.length}
          slidesToScroll={products?.length > 3 ? 3.5 : products.length}
        >
          {products?.map((product: any, index: number) => (
            <figure
              className="border bg-white rounded-lg"
              key={product.id}
              style={{
                width: "150px",
              }}
            >
              <Link href={generateICIDlink(product.urlManager?.url, icid, `${product.cms?.[0]?.content?.name}_${index + 1}`)}>
                <LazyLoadImage
                  src={getImage(product, "400x400")}
                  alt={product.assets?.[0]?.name}
                  style={{ width: "150px", height: "150x" }}
                  className="p-2 relative"
                />
              </Link>
            </figure>
          ))}
        </GoodGlammSlider>
        <div className="flex justify-center mx-auto mt-6 items-center">
          <a
            href={widgetMeta.ctaClick}
            className=" text-base text-center mb-6 tracking-widest uppercase flex justify-center items-center px-6 py-4"
            style={{
              color: widgetMeta.btnTextColor,
              width: "150px",
              backgroundColor: widgetMeta.btnBgColor,
            }}
          >
            {widgetMeta.ctaName}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ModuleCarousel10;
