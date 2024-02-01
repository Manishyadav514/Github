import * as React from "react";
import Link from "next/link";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import WidgetLabel from "./WidgetLabel";
import { urlJoin } from "@libUtils/urlJoin";

const CustomMultimediaCarousel = ({ item, icid, style }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }
  return (
    <ErrorBoundary>
      <div className="mb-5" role="banner">
        <WidgetLabel title={item.commonDetails.title} />

        <div className="pl-3">
          <div className="w-full flex mx-auto overflow-x-scroll overflow-y-hidden">
            {item.multimediaDetails.map((media: any, index: number) => {
              const url = !icid ? media?.url : `${urlJoin(media.url)}icid=${icid}_${item.label.toLowerCase()}_${index + 1}`;
              const imgHeight = media?.assetDetails?.properties?.height
              const imgWidth = media?.assetDetails?.properties?.width  
              return (
                <div key={media.assetDetails.url} className="pr-4 flex-sliderChild" style={style}>
                  <Link
                    href={url}
                    key={media.assetDetails.url}
                    prefetch={false}
                    role="presentation"
                    className="leading-[0px] block"
                    aria-label={media.imageAltTitle || media.sliderText || media.assetDetails?.name}
                  >
                    <ImageComponent
                      className="mx-auto w-full rounded-md"
                      style={{aspectRatio:imgWidth/imgHeight}}
                      src={media.assetDetails?.url}
                      alt={media.imageAltTitle || media.sliderText || media.assetDetails?.name}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CustomMultimediaCarousel;
