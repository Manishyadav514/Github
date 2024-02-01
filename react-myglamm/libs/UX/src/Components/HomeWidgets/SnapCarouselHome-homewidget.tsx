import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";

import BannerTimer from "@libComponents/HomeWidgets/BannerTimer";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import { urlJoin } from "@libUtils/urlJoin";
import { check_webp_feature, getImgSize } from "@libUtils/webp";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import { Multimedia } from "@typesLib/Widgets";

import BannerCapping, { handleCappedBanners } from "./BannerCapping";
import { bannerClickEvent } from "@libUtils/homeUtils";
import { useRouter } from "next/router";
import Link from "next/link";

const CarouselImage = (props: any) => {
  return <Image {...props} />;
};

const SnapCarouselHome = ({ carouselSlides, icid, widgetData, enableBannerUIv2 = false, setClickLink }: any) => {
  const getCurrentDateTime = new Date().getTime();

  const { slug } = useRouter().query;

  const widgetName = widgetData?.commonDetails?.title || "carousel";

  const widgetMeta = widgetData?.meta?.widgetMeta ? JSON.parse(widgetData?.meta?.widgetMeta || "{}") : {};

  const [updatedSlides, setUpdatedSlides] = useState<Multimedia[]>();

  const [disableImageComponent, setDisableImageComponent] = useState(false);
  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);

  return (
    <GoodGlammSlider dots="dots" autoPlay widgetName={widgetName} enableBannerUIv2={enableBannerUIv2}>
      {/* First priority to newly updated slides based on capping - fallback to default */}
      {(updatedSlides || carouselSlides).map((asset: Multimedia, index: number) => {
        const { width, height } = getImgSize(asset.assetDetails) || { width: 720, height: 750 };
        return (
          <BannerCapping
            banner={asset}
            key={asset.assetDetails.url}
            callback={data => {
              if ((updatedSlides || (carouselSlides as Multimedia[]))?.find(x => data.includes(x.id))) {
                setUpdatedSlides(handleCappedBanners(data, carouselSlides));
              }
            }}
          >
            <div
              className="flex relative justify-center items-center w-full h-full shrink-0"
              id={`${widgetName?.toLowerCase()?.split(" ")?.join("-")}-item-${index + 1}`}
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${updatedSlides?.length || carouselSlides?.length}`}
            >
              {asset.assetDetails && (
                <Link
                  href={(!icid || asset.targetLink?.startsWith("http")
                    ? asset.targetLink
                    : `${urlJoin(asset.targetLink)}icid=${icid}_${asset.sliderText.toLowerCase()}_${index + 1}`
                  ).replace("{slug}", slug as string)}
                  onClick={e => {
                    if (setClickLink) {
                      setClickLink(e, { slug: asset?.targetLink, header: asset?.headerText });
                    }
                    bannerClickEvent(asset.targetLink, widgetMeta, e);
                  }}
                  prefetch={false}
                  aria-label={asset.imageAltTitle || asset.sliderText || asset.assetDetails?.name}
                  role="button"
                  className="leading-[0px] block"
                >
                  <CarouselImage
                    className="rounded-md"
                    unoptimized={disableImageComponent}
                    priority={index === 0}
                    width={width}
                    height={height}
                    src={asset.assetDetails.url || DEFAULT_IMG_PATH()}
                    alt={asset.imageAltTitle || asset.sliderText || asset.assetDetails?.name}
                  />

                  <BannerTimer
                    expiryTimestamp={asset.endDate && new Date(asset.endDate).getTime()}
                    asset={asset}
                    getCurrentDateTime={getCurrentDateTime}
                    startDate={asset.startDate && new Date(asset.startDate).getTime()}
                  />
                </Link>
              )}
            </div>
          </BannerCapping>
        );
      })}
    </GoodGlammSlider>
  );
};
export default SnapCarouselHome;
