import * as React from "react";

import BannerTimer from "@libComponents/HomeWidgets/BannerTimer";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

function MultimediaCarousel3({ item }: any) {
  const widgetMeta = item?.meta?.widgetMeta ? JSON.parse(item?.meta?.widgetMeta) : "";

  if (item.multimediaDetails.length === 0) {
    return null;
  }

  const getCurrentDateTime = new Date().getTime();

  return (
    <ErrorBoundary>
      <div
        className="MultipleImageCarousal bg-white mx-auto pb-4"
        style={{
          background: widgetMeta.bgColor ? widgetMeta.bgColor : `url(${widgetMeta.bgImageUrl})`,
        }}
      >
        <h2 className="font-bold text-lg text-center py-6">{item.commonDetails.title}</h2>

        <ul className="overflow-auto overflow-x-auto ml-6" style={{ whiteSpace: "nowrap" }}>
          {item.multimediaDetails?.map((media: any, index: number) => {
            return (
              <React.Fragment key={index}>
                <li className="inline-block mr-3">
                  <div className="h-40 relative">
                    <img src={media.assetDetails?.url || DEFAULT_IMG_PATH()} alt={media.assetDetails?.name} />

                    <BannerTimer
                      expiryTimestamp={media?.endDate && new Date(media?.endDate).getTime()}
                      asset={media}
                      getCurrentDateTime={getCurrentDateTime}
                      startDate={media?.startDate && new Date(media.startDate).getTime()}
                    />
                  </div>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </ErrorBoundary>
  );
}

export default MultimediaCarousel3;
