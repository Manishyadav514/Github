import React, { useEffect, useState } from "react";
import Link from "next/link";

import { NextImage } from "@libComponents/NextImage";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import BannerTimer from "@libComponents/HomeWidgets/BannerTimer";
import { urlJoin } from "@libUtils/urlJoin";
import { check_webp_feature, getImgSize } from "@libUtils/webp";
import BannerCapping from "@libComponents/HomeWidgets/BannerCapping";

const ImgWithBanner = ({ item, widgetIndex, customClass }: any) => {
  const getCurrentDateTime = new Date().getTime();
  const [disableImageComponent, setDisableImageComponent] = useState(false);

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);
  const { width, height } = getImgSize(item.multimediaDetails[0].assetDetails) || { width: 720, height: 180 };
  return (
    <BannerCapping banner={item.multimediaDetails[0]}>
      <div className={`relative px-3 ${customClass || ""} `} role="banner">
        {!disableImageComponent && [0, 1, 2].indexOf(widgetIndex) > -1 ? (
          <NextImage
            priority
            width={`${width}`}
            height={`${height}`}
            className="w-full object-cover rounded-md"
            src={item.multimediaDetails[0].assetDetails.url}
            alt={
              item.multimediaDetails[0].imageAltTitle ||
              item.multimediaDetails[0].sliderText ||
              item.multimediaDetails[0].assetDetails.name
            }
          />
        ) : (
          <ImageComponent
            className="rounded-md"
            delay={0}
            width={`${width}`}
            height={`${height}`}
            src={item.multimediaDetails[0].assetDetails.url}
            alt={
              item.multimediaDetails[0].imageAltTitle ||
              item.multimediaDetails[0].sliderText ||
              item.multimediaDetails[0].assetDetails.name
            }
          />
        )}

        <BannerTimer
          expiryTimestamp={item.multimediaDetails[0].endDate && new Date(item.multimediaDetails[0].endDate).getTime()}
          asset={item.multimediaDetails[0]}
          getCurrentDateTime={getCurrentDateTime}
          startDate={item.multimediaDetails[0]?.startDate && new Date(item.multimediaDetails[0]?.startDate).getTime()}
        />
      </div>
    </BannerCapping>
  );
};

const MultimediaSingleBanner = ({ item, widgetIndex, icid, customClass }: any) => {
  if (!item?.multimediaDetails?.length) {
    return null;
  }

  if (item.multimediaDetails[0]?.url === "NoRedirection") {
    return <ImgWithBanner item={item} widgetIndex={widgetIndex} customClass={customClass} />;
  }

  return (
    <div className="" role="banner">
      <Link
        href={
          !icid
            ? item.multimediaDetails[0]?.url
            : `${urlJoin(item.multimediaDetails[0]?.url)}icid=${icid}_${item.multimediaDetails[0]?.headerText.toLowerCase()}_${
                widgetIndex + 1
              }`
        }
        prefetch={false}
        aria-label={
          item.multimediaDetails[0].imageAltTitle ||
          item.multimediaDetails[0].sliderText ||
          item.multimediaDetails[0].assetDetails.name
        }
        role="button"
        className="block leading-[0px]"
      >
        <ImgWithBanner item={item} widgetIndex={widgetIndex} customClass={customClass} />
      </Link>
    </div>
  );
};

export default MultimediaSingleBanner;
