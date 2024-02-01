import React from "react";
import Link from "next/link";

import { getImage, generateICIDlink } from "@libUtils/homeUtils";

import { LazyLoadImage } from "react-lazy-load-image-component";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import HomeWidgetLabel from "./HomeWidgetLabel";

const MultipleLooksCarousel = ({ data, icid }: any) => (
  <section className="max-w-screen-xl my-14 mx-auto w-full homeWidget">
    <HomeWidgetLabel title={data.commonDetails.title} />

    <GoodGlammSlider slidesPerView={4} arrowClass={{ left: "-left-8", right: "-right-8" }}>
      {data.commonDetails.descriptionData?.[0]?.value.map((looks: any, index: number) => (
        <figure className="hover:scale-105 p-4 pb-16" key={looks.id}>
          <Link
            href={generateICIDlink(looks.urlManager?.url, icid, `${looks.cms?.[0]?.content?.name}_${index + 1}`)}
            className="relative"
          >
            <LazyLoadImage src={getImage(looks, "400x400")} alt={looks.assets?.[0]?.name} className="rounded-md" />
            <div className="absolute -bottom-12 text-sm mx-auto w-4/5 inset-x-0 bg-white rounded-lg h-20 text-center pt-4 px-4">
              {looks.cms?.[0]?.content?.name}
              <span className="opacity-20 absolute inset-x-0 mx-auto top-2 text-4xl" style={{ letterSpacing: "16px" }}>
                STYLE
              </span>
            </div>
          </Link>
        </figure>
      ))}
    </GoodGlammSlider>
  </section>
);

export default MultipleLooksCarousel;
