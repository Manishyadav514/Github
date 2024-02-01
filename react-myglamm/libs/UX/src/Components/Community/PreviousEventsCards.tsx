import * as React from "react";

import Image from "next/legacy/image";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import WidgetLabel from "@libComponents/HomeWidgets/WidgetLabel";

import { urlJoin } from "@libUtils/urlJoin";

import HomeWidgetLabel from "@libDesktop/Components/home/HomeWidgetLabel";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

const PreviousEventCards = ({ item, icid, size = 55 }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }
  return (
    <ErrorBoundary>
      {IS_DESKTOP ? <HomeWidgetLabel title="Previous Events" /> : <WidgetLabel title={"Previous Events"} />}

      <div
        className={`w-full pl-4 py-3 flex ${
          IS_DESKTOP ? "overflow-x-scroll hide-scrollbar-css cursor-pointer" : "overflow-x-auto"
        }`}
      >
        {item?.multimediaDetails
          ?.sort((a: any, b: any) => a.position - b.position)
          .map((multimedia: any, index: any) => (
            <a
              href={
                !icid
                  ? `${multimedia.url}`
                  : `${urlJoin(multimedia.url)}icid=${icid}_${multimedia.headerText.toLowerCase()}_${index + 1}`
              }
              key={multimedia.assetDetails.url}
              role="presentation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={multimedia.imageAltTitle || multimedia.sliderText || multimedia.assetDetails.name}
              className={!IS_DESKTOP ? "flex-sliderChild mr-3 text-center" : ""}
            >
              <div className={IS_DESKTOP ? " mr-3 text-center" : ""}>
                <Image
                  className="w-full h-full"
                  src={multimedia.assetDetails.url}
                  alt={multimedia.imageAltTitle || multimedia.sliderText || multimedia.assetDetails.name}
                  height={size}
                  width={size}
                />
                <p className={IS_DESKTOP ? "text-left text-xs line-clamp-1 w-32" : "text-left text-11 w-32 line-clamp-1"}>
                  {multimedia.sliderText}
                </p>
              </div>
            </a>
          ))}
      </div>
      {IS_DESKTOP ? (
        <style jsx global>
          {`
            .hide-scrollbar-css::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar-css {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
          `}
        </style>
      ) : null}
    </ErrorBoundary>
  );
};

export default PreviousEventCards;
