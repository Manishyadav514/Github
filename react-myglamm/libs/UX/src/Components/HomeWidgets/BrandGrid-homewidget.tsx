import * as React from "react";
import Ripples from "@libUtils/Ripples";

import Link from "next/link";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import WidgetLabel from "./WidgetLabel";

const BrandGrid = ({ item, icid }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <section className="BrandGrid py-4">
      <WidgetLabel title={item.commonDetails.title} />
      <div className="flex flex-wrap items-center mx-2">
        {item.multimediaDetails.map((image: any, index: number) => (
          <Ripples className="w-1/2 h-full" key={image.assetDetails.name}>
            <Link
              href={
                !icid ? image.targetLink : `${image.targetLink}?icid=${icid}_${image.headerText.toLowerCase()}_${index + 1}`
              }
              prefetch={false}
              className="border border-gray-400 m-2 h-16 w-full flex justify-center items-center"
              aria-label={image.assetDetails.name}
            >
              <ImageComponent
                className="mx-auto"
                style={{ maxHeight: "40px" }}
                src={image.assetDetails.url}
                alt={image.assetDetails.name}
              />
            </Link>
          </Ripples>
        ))}
      </div>
    </section>
  );
};

export default BrandGrid;
