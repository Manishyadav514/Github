import React from "react";
import Link from "next/link";

import { urlJoin } from "@libUtils/urlJoin";

import GoodGlammSlider from "../../Components/GoodGlammSlider";

const MultipleBannerCarousel = ({ data, icid, tvc }: any) => {
  if (data.multimediaDetails.length === 0) {
    return null;
  }
  return (
    <div className={`${tvc ? "mb-6" : "mb-2"}`}>
      <GoodGlammSlider autoPlay dots>
        {data.multimediaDetails.map((imgDetail: any, index: number) => {
          const { sliderText, targetLink, assetDetails } = imgDetail;
          return (
            <Link
              prefetch={false}
              key={sliderText}
              className="w-full block"
              style={{ width: "100%" }}
              href={!icid ? targetLink : `${urlJoin(targetLink)}icid=${icid}_${sliderText.toLowerCase()}_${index + 1}`}
            >
              <img src={assetDetails?.url} alt={sliderText} className="w-full" />
            </Link>
          );
        })}
      </GoodGlammSlider>
    </div>
  );
};

export default MultipleBannerCarousel;
