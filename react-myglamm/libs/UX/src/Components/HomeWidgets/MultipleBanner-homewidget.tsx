import React, { useEffect, useState } from "react";
import Link from "next/link";

import { NextImage } from "@libComponents/NextImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import { urlJoin } from "@libUtils/urlJoin";
import { check_webp_feature, getImgSize } from "@libUtils/webp";
import { useBannerPersonalization } from "@libHooks/useBannerPersonalization";
import BannerCapping, { handleCappedBanners } from "./BannerCapping";
import { Multimedia } from "@typesLib/Widgets";

function MultipleBanner({ item, icid, widgetIndex }: any) {
  const [disableImageComponent, setDisableImageComponent] = useState(false);
  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);

  const { personalisedBanners } = useBannerPersonalization(item);

  const [updatedBanners, setUpdatedBanners] = useState<Multimedia[]>();

  return (
    <ErrorBoundary>
      <section
        className="MultipleBannerWidget mb-5 px-3 border-b-4 border-themeGray"
        role="banner"
        aria-roledescription="carousel"
        aria-label={item?.commonDetails?.title || item?.commonDetails?.subTitle}
      >
        {(updatedBanners || personalisedBanners)?.length > 1 ? (
          <GoodGlammSlider autoPlay autoPlayDelay={12000} dots="dots" widgetName={item?.commonDetails?.title}>
            {personalisedBanners.map((banner: Multimedia, index: number) => {
              const { width, height } = getImgSize(banner.assetDetails) || { width: 720, height: 750 };
              return (
                <BannerCapping
                  key={index}
                  banner={banner}
                  callback={data => {
                    if ((updatedBanners || (personalisedBanners as Multimedia[]))?.find(x => data.includes(x.id))) {
                      setUpdatedBanners(handleCappedBanners(data, personalisedBanners));
                    }
                  }}
                >
                  <div key={banner.assetDetails.url}>
                    {banner?.url?.toLowerCase() === "noredirection" ? (
                      <NextImage
                        priority={[0, 1].indexOf(widgetIndex) > -1}
                        unoptimized={disableImageComponent || [0, 1].indexOf(widgetIndex) > -1}
                        width={`${width || 720}`}
                        height={`${height || 300}`}
                        src={banner.assetDetails.url}
                        alt={banner.imageAltTitle || banner.sliderText || banner.assetDetails.name}
                        className="rounded-md"
                      />
                    ) : (
                      <Link
                        href={
                          !icid || banner.targetLink.includes("https")
                            ? banner.targetLink
                            : `${urlJoin(banner.targetLink)}icid=${icid}_${banner.headerText.toLowerCase()}_${index + 1}`
                        }
                        prefetch={false}
                        className="block leading-[0px]"
                        id={`${item?.commonDetails?.title?.toLowerCase()?.split(" ")?.join("-") || "carousel"}-item-${
                          index + 1
                        }`}
                        role="tabpanel"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} of ${personalisedBanners.length}`}
                      >
                        <NextImage
                          priority={[0, 1].indexOf(widgetIndex) > -1}
                          unoptimized={disableImageComponent || [0, 1].indexOf(widgetIndex) > -1}
                          width={`${width || 720}`}
                          height={`${height || 300}`}
                          src={banner.assetDetails.url}
                          alt={banner.imageAltTitle || banner.sliderText || banner.assetDetails.name}
                          className="rounded-md"
                        />
                      </Link>
                    )}
                  </div>
                </BannerCapping>
              );
            })}
          </GoodGlammSlider>
        ) : (
          (() => {
            if (personalisedBanners?.length === 0) {
              return null;
            }
            return (
              <div>
                {personalisedBanners && personalisedBanners[0] && (
                  <BannerCapping banner={personalisedBanners[0]}>
                    {personalisedBanners[0].url?.toLowerCase() === "noredirection" ? (
                      (() => {
                        const { width, height } = getImgSize(personalisedBanners[0].assetDetails) || {};
                        return (
                          <NextImage
                            priority={[0, 1].indexOf(widgetIndex) > -1}
                            unoptimized={disableImageComponent || [0, 1].indexOf(widgetIndex) > -1}
                            width={`${width || 720}`}
                            height={`${height || 300}`}
                            src={personalisedBanners[0].assetDetails.url}
                            alt={
                              personalisedBanners[0].imageAltTitle ||
                              personalisedBanners[0].sliderText ||
                              personalisedBanners[0].assetDetails.name
                            }
                            className="rounded-md"
                          />
                        );
                      })()
                    ) : (
                      <Link
                        href={
                          !icid || personalisedBanners[0].targetLink.includes("https")
                            ? personalisedBanners[0].targetLink
                            : `${urlJoin(
                                personalisedBanners[0].targetLink
                              )}icid=${icid}_${personalisedBanners[0].headerText.toLowerCase()}_1`
                        }
                        prefetch={false}
                        legacyBehavior
                      >
                        {(() => {
                          const { width, height } = getImgSize(personalisedBanners[0].assetDetails) || {};
                          return (
                            <a aria-label={personalisedBanners[0].assetDetails.name} className="block leading-[0px]">
                              <NextImage
                                priority={[0, 1].indexOf(widgetIndex) > -1}
                                unoptimized={disableImageComponent || [0, 1].indexOf(widgetIndex) > -1}
                                width={`${width || 720}`}
                                height={`${height || 300}`}
                                src={personalisedBanners[0].assetDetails.url}
                                alt={
                                  personalisedBanners[0].imageAltTitle ||
                                  personalisedBanners[0].sliderText ||
                                  personalisedBanners[0].assetDetails.name
                                }
                                className="rounded-md"
                              />
                            </a>
                          );
                        })()}
                      </Link>
                    )}
                  </BannerCapping>
                )}
              </div>
            );
          })()
        )}
      </section>
    </ErrorBoundary>
  );
}

export default MultipleBanner;
