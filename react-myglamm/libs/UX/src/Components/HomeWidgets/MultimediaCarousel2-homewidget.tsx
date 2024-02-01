import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { urlJoin } from "@libUtils/urlJoin";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import WidgetLabel from "./WidgetLabel";

const TypeFormWidget = dynamic(() => import(/* webpackChunkName: "TypeFormModal" */ "@libComponents/TypeForm/TypeFormModal"), {
  ssr: false,
});

function MultimediaCarousel2({ item, icid, widgetIndex }: any) {
  const width = 720;
  const height = 250;
  const metaData = item?.meta?.widgetMeta ? JSON.parse(item?.meta?.widgetMeta) : "";

  if (item.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <WidgetLabel title={item.commonDetails.title} />
      {metaData?.typeform === "true" && metaData.url ? (
        <TypeFormWidget multimediaDetails={item.multimediaDetails[0]} typeFormURL={metaData.url} />
      ) : (
        <div className="mb-1" role="banner">
          <Link
            href={
              !icid
                ? `${item.multimediaDetails[0].targetLink}`
                : `${urlJoin(item.multimediaDetails[0].targetLink)}icid=${icid}_${item.label.toLowerCase()}_1`
            }
            prefetch={false}
            aria-label={item.multimediaDetails[0].assetDetails.name}
          >
            <ImageComponent
              width={width}
              height={height}
              alt={item.multimediaDetails[0].assetDetails.name}
              src={item.multimediaDetails[0].assetDetails.url}
            />
          </Link>
        </div>
      )}
    </ErrorBoundary>
  );
}

export default React.memo(MultimediaCarousel2);
