import React, { useEffect, useState } from "react";
import Link from "next/link";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import { NextImage } from "@libComponents/NextImage";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { check_webp_feature, getImgSize } from "@libUtils/webp";
import BannerTimer from "@libComponents/HomeWidgets/BannerTimer";
import SnapCarouselHome from "@libComponents/HomeWidgets/SnapCarouselHome-homewidget";
import { urlJoin } from "@libUtils/urlJoin";
import { useBannerPersonalization } from "@libHooks/useBannerPersonalization";

function MultimediaCarousel4({ item, icid, widgetIndex }: any) {
  // const [isOfferEnded, setIsOfferEnded] = useState<any>();
  const [disableImageComponent, setDisableImageComponent] = useState(false);
  const getCurrentDateTime = new Date().getTime();

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);

  const { personalisedBanners } = useBannerPersonalization(item);
  return (
    <ErrorBoundary>
      <section className="MultimediaCarousel4 mb-5 h-full" role="banner">
        {personalisedBanners.length > 1 ? (
          <SnapCarouselHome carouselSlides={personalisedBanners} icid={icid} widgetIndex={widgetIndex} />
        ) : (
          (() => {
            if (personalisedBanners.length === 0) {
              return null;
            }
            const { width, height } = getImgSize(personalisedBanners[0].assetDetails) || { width: 720, height: 750 };
            return (
              <div className="relative">
                <Link
                  href={
                    !icid || personalisedBanners[0]?.targetLink.startsWith("http")
                      ? personalisedBanners[0]?.targetLink
                      : `${urlJoin(
                          personalisedBanners[0]?.targetLink
                        )}icid=${icid}_${personalisedBanners[0]?.headerText.toLowerCase()}_1`
                  }
                  prefetch={false}
                  aria-label={personalisedBanners[0]?.assetDetails.name}
                  className="leading-[0px] block"
                >
                  {!disableImageComponent && [0, 1].indexOf(widgetIndex) > -1 ? (
                    <NextImage
                      priority
                      width={`${width}`}
                      height={`${height}`}
                      className="h-full rounded-md"
                      src={personalisedBanners[0]?.assetDetails.url}
                      alt={
                        personalisedBanners[0]?.imageAltTitle ||
                        personalisedBanners[0]?.sliderText ||
                        personalisedBanners[0]?.assetDetails.name
                      }
                    />
                  ) : (
                    <ImageComponent
                      className="rounded-md"
                      groupIndex={widgetIndex}
                      width={`${width}`}
                      height={`${height}`}
                      src={personalisedBanners[0]?.assetDetails.url}
                      alt={
                        personalisedBanners[0]?.imageAltTitle ||
                        personalisedBanners[0]?.sliderText ||
                        personalisedBanners[0]?.assetDetails.name
                      }
                    />
                  )}
                  <BannerTimer
                    expiryTimestamp={personalisedBanners[0]?.endDate && new Date(personalisedBanners[0]?.endDate).getTime()}
                    asset={personalisedBanners[0]}
                    getCurrentDateTime={getCurrentDateTime}
                    startDate={personalisedBanners[0]?.startDate && new Date(personalisedBanners[0].startDate).getTime()}
                  />
                </Link>
              </div>
            );
          })()
        )}
      </section>
    </ErrorBoundary>
  );
}

export default React.memo(MultimediaCarousel4);
