import * as React from "react";
import Link from "next/link";

import { urlJoin } from "@libUtils/urlJoin";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

const MultimediaGrid5 = ({ item, icid }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="mb-5 px-3">
        <div className="flex flex-wrap justify-center" role="banner">
          {item.multimediaDetails.map((multimedia: any, index: number) => (
            <div className="max-w-[325px] w-3/6" key={multimedia.assetDetails.url}>
              <Link
                href={
                  !icid
                    ? `${multimedia.targetLink}`
                    : `${urlJoin(multimedia.targetLink)}icid=${icid}_${multimedia.headerText.toLowerCase()}_${index + 1}`
                }
                prefetch={false}
                role="presentation"
                aria-label={multimedia.imageAltTitle || multimedia.sliderText || multimedia.assetDetails?.name}
              >
                <ImageComponent src={multimedia.assetDetails?.url} alt={multimedia.assetDetails?.name} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MultimediaGrid5;
