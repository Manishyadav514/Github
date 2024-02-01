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
import BannerCapping from "./BannerCapping";
import BannerWidget from "@libComponents/BannerWidget";
import { useRouter } from "next/router";
import { isClient } from "@libUtils/isClient";
import { useSplit } from "@libHooks/useSplit";
import { bannerClickEvent } from "@libUtils/homeUtils";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import useTranslation from "@libHooks/useTranslation";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

function MultimediaCarousel4({ item, icid, widgetIndex }: any) {
  // const [isOfferEnded, setIsOfferEnded] = useState<any>();
  const [disableImageComponent, setDisableImageComponent] = useState(false);
  const [showWidget, setShowWidget] = useState<boolean | undefined>();
  const [bannerDetails, setBannerDetails] = useState<{ slug: string; header: string }>({ slug: "", header: "" });
  const [showBanner3D, setShowBanner3D] = useState(false);
  const getCurrentDateTime = new Date().getTime();
  const router = useRouter();

  const { bannerWidgetId } =
    useSplit({ experimentsList: [{ id: "bannerWidgetId", condition: router?.pathname === "/" }], deps: [] }) || {};

  const { slug } = useRouter().query;

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);

  const { personalisedBanners } = useBannerPersonalization(item);

  const widgetMeta = JSON.parse(item?.meta?.widgetMeta || "{}");

  useEffect(() => {
    try {
      setShowBanner3D(widgetMeta?.enableUIv2 || false);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, [item]);

  /* To show user level banner based on glamm club membership e.g. star, vip, legend */
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const userMemberShipLevel =
    userProfile && userProfile?.memberType?.typeName === "ambassador" ? userProfile?.memberType?.levelName : "Glamm Star";

  const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
    (membership: string) => membership === userMemberShipLevel
  );

  const singleFirstLevelBanner = widgetMeta?.userLevelBanners
    ? personalisedBanners[membershipLevelIndex || 0] || personalisedBanners[0]
    : widgetMeta?.userNextLevelBanners
    ? personalisedBanners[membershipLevelIndex || 0]
    : personalisedBanners[0];

  return (
    <ErrorBoundary>
      <section
        className={`MultimediaCarousel4 mb-2 h-full ${!showBanner3D && "px-3"}`}
        role="banner"
        aria-roledescription="carousel"
        aria-label={item?.commonDetails?.title || item?.commonDetails?.subTitle}
      >
        {personalisedBanners.length > 1 && !widgetMeta?.userLevelBanners && !widgetMeta?.userNextLevelBanners ? (
          <SnapCarouselHome
            carouselSlides={personalisedBanners}
            icid={icid}
            widgetIndex={widgetIndex}
            widgetData={item}
            enableBannerUIv2={showBanner3D}
            setClickLink={
              bannerWidgetId === "1" && isClient()
                ? (e: any, link: any) => {
                    e.preventDefault();
                    setBannerDetails(link);
                    setShowWidget(true);
                  }
                : null
            }
          />
        ) : (
          (() => {
            if (personalisedBanners?.length === 0 || singleFirstLevelBanner?.assetDetails?.url === undefined) {
              return null;
            }
            const { width, height } = getImgSize(singleFirstLevelBanner?.assetDetails) || { width: 720, height: 750 };

            return (
              <BannerCapping banner={singleFirstLevelBanner}>
                <div className="relative">
                  <Link
                    href={(!icid || singleFirstLevelBanner?.targetLink.startsWith("http")
                      ? singleFirstLevelBanner?.targetLink
                      : `${urlJoin(
                          singleFirstLevelBanner?.targetLink
                        )}icid=${icid}_${singleFirstLevelBanner?.headerText.toLowerCase()}_1`
                    ).replace("{slug}", slug as string)}
                    prefetch={false}
                    onClick={e => {
                      bannerClickEvent(singleFirstLevelBanner?.targetLink, widgetMeta, e);
                      if (bannerWidgetId === "1") {
                        e.preventDefault();
                        setBannerDetails({
                          slug: singleFirstLevelBanner?.targetLink,
                          header: singleFirstLevelBanner?.headerText,
                        });
                        setShowWidget(true);
                      }
                    }}
                    aria-label={
                      singleFirstLevelBanner?.imageAltTitle ||
                      singleFirstLevelBanner?.sliderText ||
                      singleFirstLevelBanner?.assetDetails.name
                    }
                    className="leading-[0px] block"
                  >
                    {!disableImageComponent && [0, 1].indexOf(widgetIndex) > -1 ? (
                      <NextImage
                        priority
                        width={`${width}`}
                        height={`${height}`}
                        className="h-full rounded-md"
                        src={singleFirstLevelBanner?.assetDetails.url}
                        alt={
                          singleFirstLevelBanner?.imageAltTitle ||
                          singleFirstLevelBanner?.sliderText ||
                          singleFirstLevelBanner?.assetDetails.name
                        }
                      />
                    ) : (
                      <ImageComponent
                        className="rounded-md"
                        groupIndex={widgetIndex}
                        width={`${width}`}
                        height={`${height}`}
                        src={singleFirstLevelBanner?.assetDetails.url}
                        alt={
                          singleFirstLevelBanner?.imageAltTitle ||
                          singleFirstLevelBanner?.sliderText ||
                          singleFirstLevelBanner?.assetDetails.name
                        }
                      />
                    )}
                    <BannerTimer
                      expiryTimestamp={singleFirstLevelBanner?.endDate && new Date(singleFirstLevelBanner?.endDate).getTime()}
                      asset={singleFirstLevelBanner}
                      getCurrentDateTime={getCurrentDateTime}
                      startDate={singleFirstLevelBanner?.startDate && new Date(singleFirstLevelBanner.startDate).getTime()}
                    />
                  </Link>
                </div>
              </BannerCapping>
            );
          })()
        )}
        {typeof showWidget === "boolean" && bannerDetails?.slug && (
          <BannerWidget icid={icid} showWidget={showWidget} bannerDetails={bannerDetails} setShowWidget={setShowWidget} />
        )}
      </section>
    </ErrorBoundary>
  );
}

export default React.memo(MultimediaCarousel4);
