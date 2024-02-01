import React from "react";

import { getImgSize } from "@libUtils/webp";
import { urlJoin } from "@libUtils/urlJoin";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import { Multimedia } from "@typesLib/Widgets";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import WidgetLabel from "@libComponents/HomeWidgets/WidgetLabel";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import HomeWidgetLabel from "@libDesktop/Components/home/HomeWidgetLabel";

const UpcomingEventsCard = ({ item, icid, widgetIndex }: any) => {
  return (
    <ErrorBoundary>
      <div className={IS_DESKTOP ? "my-6" : ""}>
        {IS_DESKTOP ? <HomeWidgetLabel title={item.commonDetails.title} /> : <WidgetLabel title={item.commonDetails.title} />}

        <div>
          {item.multimediaDetails.map((asset: Multimedia, index: number) => {
            const { width, height } = getImgSize(asset.assetDetails) || { width: 720, height: 750 };
            return (
              <div className="p-4">
                <ImageComponent
                  width={IS_DESKTOP ? 300 : width}
                  height={IS_DESKTOP ? 450 : height}
                  alt={asset.imageAltTitle || asset.sliderText || asset.assetDetails?.name}
                  src={asset.assetDetails.url || DEFAULT_IMG_PATH()}
                  className={IS_DESKTOP ? "mx-auto" : ""}
                />
                <a
                  href={
                    !icid || asset.targetLink?.startsWith("http")
                      ? asset.targetLink
                      : `${urlJoin(asset.targetLink)}icid=${icid}_${asset.sliderText.toLowerCase()}_${index + 1}`
                  }
                  aria-label={asset.assetDetails.name}
                  title={asset.assetDetails.name}
                  role="presentation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-color1 w-full text-white mt-3 uppercase rounded-md h-8 font-bold text-13">
                    Register Now
                  </button>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default UpcomingEventsCard;
