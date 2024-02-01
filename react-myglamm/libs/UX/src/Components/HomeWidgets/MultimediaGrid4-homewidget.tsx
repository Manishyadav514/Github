import * as React from "react";
import Link from "next/link";

import { urlJoin } from "@libUtils/urlJoin";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import WidgetLabel from "./WidgetLabel";

const MultimediaGrid4 = ({ item, icid }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }

  const hasLabel = item?.commonDetails?.title?.length > 0;
  return (
    <ErrorBoundary>
      <div className="mt-5 mb-1" role="banner">
        {hasLabel && <WidgetLabel title={item.commonDetails.title} />}

        <div className="flex flex-wrap px-1 mx-auto">
          {item.multimediaDetails.map((multimedia: any, index: number) => (
            <div className="flex mx-auto w-1/2 px-2 pb-4" key={multimedia.assetDetails.url}>
              <Link
                href={
                  !icid
                    ? `${multimedia.targetLink}`
                    : `${urlJoin(multimedia.targetLink)}icid=${icid}_${encodeURIComponent(
                        multimedia.headerText.toLowerCase()
                      )}_${index + 1}`
                }
                prefetch={false}
                role="presentation"
                aria-label={multimedia.imageAltTitle || multimedia.sliderText || multimedia.assetDetails?.name}
              >
                <ImageComponent
                  className="mx-auto rounded-md"
                  src={multimedia.assetDetails?.url}
                  alt={multimedia.imageAltTitle || multimedia.sliderText || multimedia.assetDetails?.name}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MultimediaGrid4;
