import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { generateICIDlink } from "@libUtils/homeUtils";

const MenuSingleBanner = ({ data, icid, cssClass, closeMenu }: any) => {
  if (data.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <section
      className={`menuSection flex justify-start ${
        cssClass.class === "makeup-grid-view" ? "w-full" : "ml-2.5 mr-1 menuProducts"
      }`}
    >
      {data.multimediaDetails.map((banner: any, index: number) => {
        const { headerText, targetLink, assetDetails } = banner;

        return (
          <div className="text-center" key={headerText}>
            <Link href={generateICIDlink(targetLink, icid, `${headerText}_${index + 1}`)} onClick={closeMenu}>
              <LazyLoadImage
                alt={headerText}
                src={assetDetails?.url}
                className={`${cssClass.class === "makeup-grid-view" ? "w-full" : "menuProducts"}`}
              />
            </Link>
          </div>
        );
      })}
    </section>
  );
};

export default MenuSingleBanner;
