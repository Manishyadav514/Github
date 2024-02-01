import Link from "next/link";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import SearchLabel from "@libComponents/Search/SearchLabel";
import * as React from "react";
import { getImgSize } from "@libUtils/webp";
import { urlJoin } from "@libUtils/urlJoin";

const ShopFromCategories = ({ item, icid }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <section className="ShopFromCategoriesWidget mt-2 mb-5" role="banner">
        <SearchLabel label={item.commonDetails.title} />
        <div className="grid w-full grid-cols-3 gap-y-3 gap-x-2 px-3">
          {item?.multimediaDetails?.map((multimedia: any, index: number) => {
            const { width, height } = getImgSize(multimedia.assetDetails) || { width: 100, height: 100 };
            return (
              <Link
                href={
                  !icid
                    ? `${multimedia.targetLink}`
                    : `${urlJoin(multimedia.targetLink)}icid=${icid}_${multimedia.headerText.toLowerCase()}_${index + 1}`
                }
                prefetch={false}
                key={multimedia.assetDetails.url}
                role="presentation"
                className="relative mx-auto "
                aria-label={multimedia.imageAltTitle || multimedia.sliderText || multimedia.assetDetails?.name}
              >
                <ImageComponent
                  height={height}
                  width={width}
                  src={multimedia.assetDetails.url}
                  alt={multimedia.imageAltTitle || multimedia.sliderText || multimedia.assetDetails?.name}
                  className="rounded-md w-28 h-auto !object-cover"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default ShopFromCategories;
