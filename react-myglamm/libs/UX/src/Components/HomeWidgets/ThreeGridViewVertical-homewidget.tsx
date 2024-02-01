import * as React from "react";
import Link from "next/link";
import Ripples from "@libUtils/Ripples";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import WidgetLabel from "./WidgetLabel";

function ThreeGridViewVertical({ item, icid }: any) {
  if (item.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <section className="ThreeGridViewVertical my-5" role="banner">
        <WidgetLabel title={item.commonDetails.title} />
        <div className="flex flex-wrap px-2 mx-auto">
          {item.multimediaDetails.map((category: any, index: number) => (
            <Ripples className="flex p-1 w-1/3 mx-auto" key={category?.assetDetails?.name}>
              <Link
                href={
                  !icid
                    ? category.targetLink
                    : `${category.targetLink}?icid=${icid}_${category.headerText.toLowerCase()}_${index + 1}`
                }
                prefetch={false}
                aria-label={category.assetDetails.name}
              >
                <ImageComponent
                  className="rounded-md"
                  style={{ width: "120px", height: "120px" }}
                  src={category.assetDetails.url}
                  alt={category.assetDetails.name}
                />
              </Link>
            </Ripples>
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
}

export default ThreeGridViewVertical;
