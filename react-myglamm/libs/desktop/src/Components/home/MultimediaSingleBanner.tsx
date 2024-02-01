import React from "react";
import Link from "next/link";
import { generateICIDlink } from "@libUtils/homeUtils";

const MultimediaSingleBanner = (props: any) => {
  const { data, icid, index } = props;
  const widgetMeta = data.meta.widgetMeta && JSON.parse(data.meta.widgetMeta);
  let classNames = "w-full ";
  if (widgetMeta?.cssClass) {
    classNames = `mt-12 mx-auto ${widgetMeta?.cssClass}`;
  }

  if (data.multimediaDetails?.length === 0) {
    return null;
  }

  if (data.multimediaDetails?.[0]?.url === "NoRedirection") {
    return (
      <div className={`${classNames} w-full flex justify-center`}>
        <img
          className={`w-full mb-5 ${index !== 0 ? "max-w-screen-xl mx-auto" : ""}`}
          alt={data.multimediaDetails?.[0]?.headerText}
          src={data.multimediaDetails?.[0]?.assetDetails.url}
        />
      </div>
    );
  }

  const { targetLink, assetDetails, headerText } = data.multimediaDetails?.[0];
  return (
    <div className={classNames}>
      <Link
        href={generateICIDlink(targetLink, icid, `${headerText}_${index + 1}`)}
        prefetch={false}
        className="w-full flex justify-center"
      >
        <img
          className={`w-full mb-5 ${index !== 0 ? "max-w-screen-xl mx-auto" : ""}`}
          src={assetDetails.url}
          alt={headerText}
        />
      </Link>
    </div>
  );
};

export default MultimediaSingleBanner;
