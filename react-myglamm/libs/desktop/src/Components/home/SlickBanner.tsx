import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { generateICIDlink } from "@libUtils/homeUtils";

import HomeWidgetLabel from "./HomeWidgetLabel";

const SlickBanner = ({ data, icid }: any) => {
  if (data.multimediaDetails.length === 0) {
    return null;
  }

  const metaData = JSON.parse(data.meta.widgetMeta || "{}");

  return (
    <section className="max-w-screen-xl my-14 mx-auto w-full">
      {metaData?.title && <HomeWidgetLabel title={metaData.title} />}

      <div className="flex justify-between">
        {data.multimediaDetails.map((banner: any, index: number) => {
          const { headerText, targetLink, assetDetails } = banner;
          return (
            <div className="multipleBanners pr-7 last:pr-0" key={headerText}>
              <Link href={generateICIDlink(targetLink, icid, `${headerText}_${index + 1}`)}>
                <LazyLoadImage src={assetDetails?.url} alt={headerText} />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SlickBanner;
