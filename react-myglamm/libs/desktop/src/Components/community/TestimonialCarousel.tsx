import React from "react";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import HomeWidgetLabel from "../../Components/home/HomeWidgetLabel";
import GoodGlammSlider from "../../Components/GoodGlammSlider";

const TestimonialCarousel = ({ data, icid, tvc }: any) => {
  if (data.multimediaDetails.length === 0) {
    return null;
  }
  return (
    <div className="my-10">
      <HomeWidgetLabel title={data.commonDetails.title} />
      <div className={`${tvc ? "mb-6" : "mb-10"}`}>
        <GoodGlammSlider dots autoPlay slidesPerView={1.4}>
          {data.multimediaDetails.map((imgDetail: any) => {
            const { sliderText, targetLink, assetDetails } = imgDetail;
            return (
              <div key={sliderText} className="keen-slider__slide px-4">
                <img src={assetDetails?.url || DEFAULT_IMG_PATH()} alt={sliderText} className="w-full" />
              </div>
            );
          })}
        </GoodGlammSlider>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
