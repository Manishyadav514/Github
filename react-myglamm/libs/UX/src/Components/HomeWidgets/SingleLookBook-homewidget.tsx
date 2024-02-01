import * as React from "react";
import Link from "next/link";
// import Ripples from "@libUtils/Ripples";
import { GiForwardIco } from "@libComponents/GlammIcons";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import useTranslation from "@libHooks/useTranslation";
import WidgetLabel from "./WidgetLabel";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const SingleLookBook = ({ item, icid }: any) => {
  const lookbook = item.commonDetails.descriptionData[0]?.value[0];
  const relationalData = item?.commonDetails?.descriptionData[0]?.relationalData;
  const { t } = useTranslation();

  const onShareClick = () => {
    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: lookbook?.urlShortner?.shortUrl,
      productName: lookbook?.cms[0]?.content?.name,
      slug: lookbook?.urlShortner?.slug,
      module: "lookbook",
      image: lookbook?.assets[0].imageUrl["200x200"] || DEFAULT_IMG_PATH(),
      overrideRouterPath: "looks",
    };
  };

  return (
    <ErrorBoundary>
      <section className="SingleLookBookWidget my-5" role="banner">
        <WidgetLabel title={item.commonDetails.title} />
        <p className="text-sm -mt-3 mb-3 px-3" style={{ color: "#9b9b9b" }}>
          {item.commonDetails.shortDescription}
        </p>
        <Link
          href={
            !icid
              ? `${lookbook.urlManager.url}`
              : `${lookbook.urlManager.url}?icid=${icid}_${lookbook.cms[0]?.content?.name.toLowerCase()}_1`
          }
          prefetch={false}
          className="block"
          aria-label={lookbook.assets[0].name}
        >
          <div className="px-3">
            <ImageComponent
              className="mx-auto rounded-md"
              src={lookbook.assets[0].imageUrl["400x400"]}
              alt={lookbook.assets[0].name}
              style={{ width: "400px", height: "400px" }}
            />
          </div>
        </Link>
        <div className="relative bg-white mx-6 -mt-16 rounded overflow-hidden shadow-lg " style={{ padding: "18px 16px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#ff9797",
              textTransform: "uppercase",
              textAlign: "center",
              opacity: 0.2,
              lineHeight: "35px",
              letterSpacing: "1.85px",
              margin: "0 0 -14px",
            }}
          >
            {relationalData?.categoryId[lookbook?.categoryId]?.cms[0]?.content.name}
          </h1>
          <h1
            style={{
              fontSize: "16px",
              color: "#000",
              display: "block",
              textTransform: "capitalize",
              textAlign: "center",
              lineHeight: "20px",
            }}
          >
            {lookbook.cms[0]?.content.name}
          </h1>
          {/* Share Button */}
          <div
            aria-hidden
            onClick={onShareClick}
            style={{
              float: "right",
              margin: "7px -15px 0 0",
              width: "66px",
              height: "33px",
              fontSize: "10px",
              fontWeight: 600,
              borderLeft: "2px solid #f3eeee",
              opacity: 0.5,
              padding: "2px 10px 0",
            }}
          >
            {t("shareAnd")}
            <br /> {t("earn")}
            <GiForwardIco
              className="absolute right-0"
              style={{ right: "7px", marginTop: "-0.90rem" }}
              width="20"
              height="20"
              role="img"
              aria-labelledby="share & earn"
            />
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default SingleLookBook;
