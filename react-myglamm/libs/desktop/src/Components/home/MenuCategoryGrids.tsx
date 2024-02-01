import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { generateICIDlink } from "@libUtils/homeUtils";

const MenuCategoryGrids = ({ data, icid, closeMenu }: any) => {
  if (data.multimediaDetails.length === 0) {
    return null;
  }

  const widgetMeta = JSON.parse(data?.meta?.widgetMeta || "{}");
  return (
    <section className={`px-0.5  mt-2 ${widgetMeta?.positionClass || ""}`}>
      <h3
        className="text-sm text-uppercase font-bold text-left mb-6 mx-auto mt-auto"
        style={{ fontSize: "14px", color: "var(--color1)" }}
      >
        {data.commonDetails.title}
      </h3>
      <div className="gridOne flex justify-between mt-auto mb-2 mr-auto w-full">
        {data.multimediaDetails.map((imgDetail: any, index: number) => {
          const { sliderText, targetLink, assetDetails } = imgDetail;

          return (
            <div key={sliderText}>
              <Link href={generateICIDlink(targetLink, icid, `${sliderText}_${index + 1}`)}>
                <a onClick={closeMenu}>
                  <LazyLoadImage
                    src={assetDetails?.url}
                    alt={sliderText}
                    className="bg-white rounded-full p-0.5"
                    style={{
                      width: "85px",
                      border: "1px solid #c9c9c9",
                    }}
                  />
                  <p className="categoryName text-center text-sm mt-4 mb-4">{sliderText}</p>
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MenuCategoryGrids;
