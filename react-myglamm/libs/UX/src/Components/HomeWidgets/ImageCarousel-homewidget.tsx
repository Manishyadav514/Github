import * as React from "react";
import Link from "next/link";

import { getMobileOperatingSystem } from "@libUtils/getDeviceOS";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import { SHOP } from "@libConstants/SHOP.constant";

import WidgetLabel from "./WidgetLabel";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

function ImageCarousel({ item, icid }: any) {
  const externalLinkRegex = /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i;

  if (item.multimediaDetails.length === 0) {
    return null;
  }

  // const generateExternalLink = (targetLink: string) => {
  //   if (targetLink.match(externalLinkRegex)) {
  //     const platform: any = getMobileOperatingSystem();
  //     // eslint-disable-next-line no-nested-ternary
  //     return platform === "iOS"
  //       ? `${targetLink}?$ios_url=${encodeURI(appUrls[platform][SHOP.SITE_CODE])}`
  //       : platform === "Android"
  //       ? `${targetLink}?$android_url=${encodeURI(appUrls[platform][SHOP.SITE_CODE])}`
  //       : targetLink;
  //   }
  //   return targetLink;
  // };

  return (
    <ErrorBoundary>
      <div
        className="MultipleImageCarousal my-5"
        role="banner"
        aria-roledescription="carousel"
        aria-label={item?.commonDetails?.title || item?.commonDetails?.subTitle}
      >
        <WidgetLabel title={item.commonDetails.title} />

        <div
          style={
            !SHOP.IS_MYGLAMM
              ? {
                  paddingBottom: "0px",
                }
              : {
                  backgroundColor: "var(--color3)",
                  padding: "18px 0 15px 0",
                }
          }
        >
          {item.multimediaDetails.length > 1 ? (
            <GoodGlammSlider slidesPerView={1.2} dots="full" className="pl-3" widgetName={item?.commonDetails?.title}>
              {item.multimediaDetails.map((banner: any, index: any) => {
                //    const isExternal = externalLinkRegex.test(banner.targetLink);

                const link = banner.targetLink;
                return (
                  <div
                    key={banner.assetDetails.name}
                    id={`${item?.commonDetails?.title?.toLowerCase()?.split(" ")?.join("-") || "carousel"}-item-${index + 1}`}
                    role="tabpanel"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${item.multimediaDetails.length}`}
                  >
                    {banner.targetLink.match(externalLinkRegex) ? (
                      <a
                        href={!icid ? `${link}` : `${link}?icid=${icid}_${banner.sliderText.toLowerCase()}_${index + 1}`}
                        aria-label={
                          banner.imageAltTitle ||
                          (banner?.sliderText?.trim().length > 0 && banner.sliderText) ||
                          banner.assetDetails.name
                        }
                        className="mr-3.5 block"
                      >
                        <ImageComponent
                          style={{
                            width: "100%",
                            height: "60vw",
                          }}
                          className="w-full h-[60vw] rounded-md"
                          alt={
                            banner.imageAltTitle ||
                            (banner?.sliderText?.trim().length > 0 && banner.sliderText) ||
                            banner.assetDetails.name
                          }
                          src={banner.assetDetails.url}
                        />
                      </a>
                    ) : (
                      <Link
                        href={!icid ? `${link}` : `${link}?icid=${icid}_${banner.sliderText.toLowerCase()}_${index + 1}`}
                        prefetch={false}
                        aria-label={
                          banner.imageAltTitle ||
                          (banner?.sliderText?.trim().length > 0 && banner.sliderText) ||
                          banner.assetDetails.name
                        }
                        className="mr-3.5 block"
                      >
                        <ImageComponent
                          className="w-full h-[60vw] rounded-md"
                          style={{
                            width: "100%",
                            height: "60vw",
                          }}
                          alt={
                            banner.imageAltTitle ||
                            (banner?.sliderText?.trim().length > 0 && banner.sliderText) ||
                            banner.assetDetails.name
                          }
                          src={banner.assetDetails.url}
                        />
                      </Link>
                    )}
                  </div>
                );
              })}
            </GoodGlammSlider>
          ) : (
            <div key={item.multimediaDetails[0].sliderText}>
              {item.multimediaDetails[0].targetLink.match(externalLinkRegex) ? (
                <a
                  href={
                    !icid
                      ? item.multimediaDetails[0].targetLink
                      : `${
                          item.multimediaDetails[0].targetLink
                        }?icid=${icid}_${item.multimediaDetails[0]?.headerText.toLowerCase()}_1`
                  }
                  aria-label={item.multimediaDetails[0].assetDetails.name}
                  className="block px-3"
                >
                  <img
                    className="w-full rounded-md"
                    alt={item.multimediaDetails[0].assetDetails.name}
                    src={item.multimediaDetails[0].assetDetails.url}
                  />
                </a>
              ) : (
                <Link
                  href={
                    !icid
                      ? item.multimediaDetails[0].targetLink
                      : `${
                          item.multimediaDetails[0].targetLink
                        }?icid=${icid}_${item.multimediaDetails[0]?.headerText.toLowerCase()}_1`
                  }
                  prefetch={false}
                  aria-label={item.multimediaDetails[0].assetDetails.name}
                  className="block px-3"
                >
                  <img
                    className="w-full rounded-md"
                    alt={item.multimediaDetails[0].assetDetails.name}
                    src={item.multimediaDetails[0].assetDetails.url}
                  />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ImageCarousel;
