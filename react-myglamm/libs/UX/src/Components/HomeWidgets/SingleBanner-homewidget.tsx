import { useState } from "react";

import Link from "next/link";
import dynamic from "next/dynamic";

import { urlJoin } from "@libUtils/urlJoin";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { TCommunityPopup } from "@libComponents/Community/DownloadAppModal";

const TypeFormWidget = dynamic(() => import(/* webpackChunkName: "TypeFormModal" */ "@libComponents/TypeForm/TypeFormModal"), {
  ssr: false,
});

const DownloadAppModal = dynamic(
  () => import(/* webpackChunkName: "TypeFormModal" */ "@libComponents/Community/DownloadAppModal"),
  { ssr: false }
);

function SingleBanner({ item, icid }: any) {
  const metaData = item?.meta?.widgetMeta ? JSON.parse(item?.meta?.widgetMeta) : "";
  const [activeModal, setActiveModal] = useState<TCommunityPopup>("");

  if (item.multimediaDetails.length === 0) {
    return null;
  }

  const getBannerImage = () => {
    return (
      <ImageComponent
        className="rounded-md"
        width={720}
        height={250}
        alt={item.multimediaDetails[0].assetDetails.name}
        src={item.multimediaDetails[0].assetDetails.url}
      />
    );
  };

  return (
    <ErrorBoundary>
      {metaData?.typeform === "true" && metaData.url ? (
        <TypeFormWidget multimediaDetails={item.multimediaDetails[0]} typeFormURL={metaData.url} />
      ) : (
        <div className="SingleBannerWidget mb-5 px-3" role="banner">
          {metaData?.showDownloadPopup ? (
            <div onClick={() => setActiveModal("selectInterest")}>{getBannerImage()}</div>
          ) : (
            <Link
              href={
                !icid
                  ? `${item.multimediaDetails[0].targetLink}`
                  : `${urlJoin(item.multimediaDetails[0].targetLink)}icid=${icid}_${item.label.toLowerCase()}_1`
              }
              prefetch={false}
              aria-label={item.multimediaDetails[0].assetDetails.name}
              className="block leading-[0px]"
            >
              {getBannerImage()}
            </Link>
          )}
        </div>
      )}
      <DownloadAppModal activeModal={activeModal} setActiveModal={setActiveModal} />
    </ErrorBoundary>
  );
}

export default SingleBanner;
