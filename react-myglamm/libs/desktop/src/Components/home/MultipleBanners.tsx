import React from "react";
import Link from "next/link";

import { LazyLoadImage } from "react-lazy-load-image-component";

import { generateICIDlink } from "@libUtils/homeUtils";

import HomeWidgetLabel from "./HomeWidgetLabel";

const MultipleBanners = ({ data, icid }: any) => {
  if (data.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <section className="max-w-screen-xl my-14 mx-auto w-full">
      <HomeWidgetLabel title={data.commonDetails.title} />
      <div className="promotionalBanners flex justify-between">
        {data.multimediaDetails.map((imgDetail: any, index: number) => (
          <figure key={index} className="offersContainer relative w-1/3 rounded bg-white	shadow mr-7 last:mr-0">
            <Link
              href={generateICIDlink(imgDetail.targetLink, icid, `${encodeURIComponent(imgDetail.headerText)}_${index + 1}`)}
            >
              <LazyLoadImage src={imgDetail.assetDetails.url} alt={imgDetail.headerText} />
              {data.meta.widgetMeta === "Offers" ? (
                <div className="offerContent px-4 pb-5 text-center">
                  <h3 className="offerHeader mt-5 mb-2.5 text-base font-bold text-black">{imgDetail.headerText}</h3>
                  <p className="offerText text-sm h-11 mb-2.5">{imgDetail.sliderText} </p>
                </div>
              ) : (
                <div className="shopBySkin absolute bottom-0 left-0 right-0 text-center bg-white/75 overflow-hidden">
                  <h3 className="skinTone leading-none my-4 text-lg font-semibold text-black">{imgDetail.headerText}</h3>
                  <p className="shortDesc text-sm px-6 hidden text-black">{imgDetail.sliderText}</p>
                </div>
              )}
            </Link>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default MultipleBanners;
