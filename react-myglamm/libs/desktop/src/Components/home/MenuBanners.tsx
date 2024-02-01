import React from "react";
import Link from "next/link";

import { LazyLoadImage } from "react-lazy-load-image-component";

import { generateICIDlink } from "@libUtils/homeUtils";

const MenuBanners = ({ data, icid, closeMenu }: any) => {
  if (data.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <section className="px-1">
      <div className="promotionalBanners flex justify-start">
        {data.multimediaDetails.map((imgDetail: any, index: number) => (
          <figure
            key={index}
            className={`offerContent shadow	relative rounded bg-white ${index > 3 ? "w-1/4" : "w-1/3"} ml-3 mr-3`}
          >
            <Link prefetch={false} href={generateICIDlink(imgDetail.targetLink, icid, `${imgDetail.headerText}_${index + 1}`)}>
              <a onClick={closeMenu}>
                <LazyLoadImage src={imgDetail.assetDetails.url} alt={imgDetail.headerText} className="w-full" />

                <div className="text-left b-8 px-6">
                  <h3 className="offerHeader font-bold text-2xl">{imgDetail.headerText}</h3>
                  <p className="offerText text-xl w-full h-8 overflow-hidden">{imgDetail.sliderText}</p>
                </div>
              </a>
            </Link>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default MenuBanners;
