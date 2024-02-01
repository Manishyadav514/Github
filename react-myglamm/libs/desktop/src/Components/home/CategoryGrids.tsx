import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { generateICIDlink } from "@libUtils/homeUtils";

import { SHOP } from "@libConstants/SHOP.constant";

import HomeWidgetLabel from "./HomeWidgetLabel";

const CategoryGrids = ({ data, icid }: any) => {
  if (data.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <section className="max-w-screen-xl my-14 mx-auto w-full">
      <HomeWidgetLabel title={data.commonDetails.title} />

      <div className="flex justify-center">
        <div className={`gridOne w-full flex justify-between ${SHOP.SITE_CODE === "bbc" ? "bbc" : ""}`}>
          {data.multimediaDetails.map((imgDetail: any, index: number) => {
            const { sliderText, targetLink, assetDetails } = imgDetail;

            return (
              <div key={sliderText}>
                <Link href={generateICIDlink(targetLink, icid, `${sliderText}_${index + 1}`)} className="text-black">
                  <LazyLoadImage
                    src={assetDetails?.url}
                    alt={sliderText}
                    className="w-32	rounded-full bg-white p-1	border border-solid border-gray-300"
                  />
                  <p className="categoryName font-bold text-center my-4">{sliderText}</p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrids;
