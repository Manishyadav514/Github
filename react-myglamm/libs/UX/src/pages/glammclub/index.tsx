import React, { ReactElement, useEffect, useState } from "react";
import Layout from "@libLayouts/Layout";
import { SLUG } from "@libConstants/Slug.constant";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import GlammClubAPI from "@libAPI/apis/GlammClubAPI";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import UserIcon from "../../../public/svg/user-icon.svg";
import { getUserNameEmail } from "@libUtils/getUserNameEmail";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import useAppRedirection from "@libHooks/useAppRedirection";
import { getGlammClubWidgets, getMembershipIcon, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

const GlammClub = ({ widgets }: { widgets: any[] }) => {
  const [glammClubMembershipData, setGlammClubMemberShipData] = useState<any>();
  const [name, setName] = useState("Guest");
  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  async function getGlammDetails() {
    if (profile) {
      const glammClubApi = new GlammClubAPI();
      const res = await glammClubApi.getGlammClubMembershipDetails(profile?.id);
      setGlammClubMemberShipData(res?.data?.data);
    }
  }

  useEffect(() => {
    if (profile) {
      getGlammDetails();
      setName(getUserNameEmail(profile));
    }
  }, [profile]);

  const currentMemberShip = glammClubMembershipData?.levelDetails?.find(
    (membership: any) => membership?.level === glammClubMembershipData?.currentMembershipLevelDetailLabel
  );

  const nextMembership = glammClubMembershipData?.levelDetails?.find(
    (membership: any) => membership?.level === glammClubMembershipData?.nextMembershipLevelDetailLabel
  );

  const currentMembershipBenefitCount = currentMemberShip?.benifits
    ?.filter((benefit: any) => benefit?.statusId === 1)
    ?.length?.toString();

  const nextMembershipBenefitCount = nextMembership?.benifits
    ?.filter((benefit: any) => benefit?.statusId === 1)
    ?.length?.toString();

  const getShopForMoreAmount = (personalSales: any, nextMembershipThreshold: any) => {
    if (nextMembershipThreshold >= personalSales) {
      const amountToShop = nextMembershipThreshold - personalSales;
      if (typeof amountToShop === "number") return nextMembershipThreshold - personalSales;
    }
  };

  const transitionAmount = getShopForMoreAmount(
    glammClubMembershipData?.currentMonth?.personal?.sales,
    nextMembership?.sales?.personalSales
  );

  /* ADOBE EVENT - PAGELOAD - Glamm Club Landing */
  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|Glammclub|Landing Page",
        newPageName: "Glammclub Landing Page",
        subSection: "Glammclub Landing Page",
        assetType: "Glammclub",
        newAssetType: "Glammclub",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  const adobeClickEventShopNow = (ctaName: string) => {
    // On Click - Cancel Subscription
    (window as any).digitalData = {
      common: {
        linkName: `web|Glammclub|Trial Catalog|Shop Now`,
        linkPageName: `Trial Catalog`,
        newLinkPageName: "Trial Catalog",
        assetType: "Glammclub",
        newAssetType: "Glammclub",
        subSection: "Trial Catalog",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const { redirect } = useAppRedirection();

  return (
    <div className="bg-white">
      {profile && (
        <div
          className="relative h-full w-full flex flex-col items-center mb-4 bg-size"
          style={{
            backgroundImage: `url(${glammClubConfig?.loggedInGlammClubBannerImgSrc})`,
            backgroundRepeat: "no-repeat",
          }}
        >
          {glammClubConfig?.loginModalLogoImgSrc && (
            <img
              className="absolute m-auto left-0 right-0 top-7 w-24"
              src={glammClubConfig?.loginModalLogoImgSrc}
              alt="Glamm Club"
            />
          )}
          <div className="flex items-center pt-24 space-x-4 w-full px-8">
            <div className="">
              {profile?.meta.profileImage?.original ? (
                <ImageComponent
                  alt="user avatar"
                  className={`object-cover rounded-full h-14 w-14`}
                  style={{
                    borderWidth: "4px",
                    borderColor: `${glammClubConfig?.customColor || "var(--color1)"}`,
                  }}
                  src={profile?.meta.profileImage?.original}
                />
              ) : (
                <UserIcon
                  className="bg-white rounded-full h-14 w-14"
                  role="img"
                  aria-labelledby="user profile image"
                  title="user profile"
                />
              )}
            </div>
            <div className="flex flex-col">
              <div className="text-white text-lg capitalize profile-name">
                {name !== "Guest" && <p className="pr-1 truncate">{name}</p>}
              </div>
              <div
                className={`flex w-max rounded-full pl-1 pr-1.5`}
                style={{
                  backgroundColor: `${glammClubConfig?.customColor || "var(--color1)"}`,
                }}
              >
                {typeof profile?.currentBalance === "number" && FEATURES.enableGPonPayment && (
                  <div className="flex text-xs text-white py-1 space-x-1 items-center">
                    <img src={glammClubConfig?.coinIconImgSrc} className="w-4" />
                    <span className="font-bold">{typeof profile?.currentBalance === "number" && profile?.currentBalance}</span>
                    <p>{t("glammCoinsText") || "Glamm Coins"}</p>
                  </div>
                )}
              </div>
            </div>

            {typeof glammClubMembershipData?.currentMembershipLevel === "number" &&
              glammClubMembershipData?.currentMembershipLevel === 3 && (
                <div className="flex">
                  <img
                    src={getMembershipIcon(glammClubMembershipData?.currentMembershipLevelDetailLabel, glammClubConfig)}
                    alt={glammClubMembershipData?.currentMembershipLevelDetailLabel}
                    className="h-5"
                  />
                  <div className="membership-sticker">
                    <svg
                      className="relative m-auto -left-1"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_6424_21612)">
                        <circle cx="6.00039" cy="5.99844" r="3.6" fill="white" />
                        <path
                          d="M6 0C2.69195 0 0 2.69195 0 6C0 9.30805 2.69195 12 6 12C9.30805 12 12 9.30805 12 6C12 2.69195 9.30805 0 6 0ZM8.98368 4.71901L5.52977 7.9947C5.43244 8.07586 5.31892 8.12439 5.18924 8.12439C5.05955 8.12439 4.92986 8.07586 4.8487 7.97853L3.03249 6.1138C2.83782 5.91912 2.85399 5.61122 3.04867 5.43272C3.24334 5.23805 3.55125 5.25422 3.72974 5.4489L5.20541 6.97309L8.31878 4.02176C8.51346 3.84326 8.82136 3.84326 8.99986 4.03793C9.17836 4.21643 9.17836 4.52462 8.98368 4.71901Z"
                          fill="#66C136"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6424_21612">
                          <rect width="12" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              )}
          </div>

          {glammClubMembershipData?.currentMembershipLevel < 3 ? (
            <div className="flex items-center pt-6 w-full px-8 justify-between ">
              <div className="flex flex-col items-center space-y-1">
                <div className="text-white text-xs">
                  <div className="flex">
                    <img
                      src={getMembershipIcon(glammClubMembershipData?.currentMembershipLevelDetailLabel, glammClubConfig)}
                      alt={glammClubMembershipData?.currentMembershipLevelDetailLabel}
                      className="h-5"
                    />
                    <div className="">
                      <svg
                        className="relative m-auto -left-1"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_6424_21612)">
                          <circle cx="6.00039" cy="5.99844" r="3.6" fill="white" />
                          <path
                            d="M6 0C2.69195 0 0 2.69195 0 6C0 9.30805 2.69195 12 6 12C9.30805 12 12 9.30805 12 6C12 2.69195 9.30805 0 6 0ZM8.98368 4.71901L5.52977 7.9947C5.43244 8.07586 5.31892 8.12439 5.18924 8.12439C5.05955 8.12439 4.92986 8.07586 4.8487 7.97853L3.03249 6.1138C2.83782 5.91912 2.85399 5.61122 3.04867 5.43272C3.24334 5.23805 3.55125 5.25422 3.72974 5.4489L5.20541 6.97309L8.31878 4.02176C8.51346 3.84326 8.82136 3.84326 8.99986 4.03793C9.17836 4.21643 9.17836 4.52462 8.98368 4.71901Z"
                            fill="#66C136"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_6424_21612">
                            <rect width="12" height="12" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white">
                  {currentMembershipBenefitCount &&
                    currentMembershipBenefitCount > 0 &&
                    currentMembershipBenefitCount.concat(" ", t("benefits") || "Benefits")}
                </div>
              </div>
              {glammClubMembershipData?.currentMembershipLevelDetailLabel !==
                glammClubMembershipData?.nextMembershipLevelDetailLabel && (
                <>
                  <div className="flex flex-col items-center">
                    <div className="">
                      <img src={glammClubConfig?.arrowIconImgSrc} alt="" className="w-28" />
                    </div>
                    <div className="flex text-10 space-x-1">
                      <span className="text-white">{t("shopFor") || "Shop for"}</span>
                      <span className="text-amber-200 font-bold">
                        {transitionAmount ? formatPrice((transitionAmount as number) * 100, true) : ""}
                      </span>
                      <span className="text-white">{t("more") || "More"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <div className="text-white text-xs">
                      {" "}
                      <img
                        src={getMembershipIcon(glammClubMembershipData?.nextMembershipLevelDetailLabel, glammClubConfig)}
                        alt={glammClubMembershipData?.nextMembershipLevelDetailLabel}
                        className="h-5"
                      />
                    </div>
                    <div className="text-xs text-white">
                      {nextMembershipBenefitCount &&
                        nextMembershipBenefitCount > 0 &&
                        nextMembershipBenefitCount.concat(" ", t("benefits") || "Benefits")}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            glammClubMembershipData?.currentMembershipLevel === 3 && (
              <>
                <div className="flex items-center pt-4">
                  <span className="text-amber-100 font-medium">{t("congratulationsNormal") || "Congratulations"}</span>
                </div>
                <div className="flex text-center">
                  <div
                    className="text-white text-sm"
                    dangerouslySetInnerHTML={{ __html: glammClubConfig?.legendWelcomeText }}
                  ></div>
                </div>
              </>
            )
          )}

          <div className="py-4">
            <button
              onClick={() => {
                adobeClickEventShopNow("Shop Now");
                redirect(glammClubConfig?.trialCatalogueSlug || "/glammclub/trial-catalogue");
              }}
              className={`bg-gray-900 w-20 p-2 text-sm text-white rounded font-semibold uppercase w-72 `}
            >
              {t("shopNow") || "Shop Now"}
            </button>
          </div>
        </div>
      )}

      <style jsx global>
        {`
          .glammClubFAQs summary:after {
            line-height: 1;
            margin: auto 0;
            margin-top: 8px;
            content: "";
            height: 10px;
            width: 10px;
            color: #000;
            border-bottom: 1.5px solid currentColor;
            border-right: 1.5px solid currentColor;
            -webkit-transition: all 0.3s ease;
            transition: all 0.3s ease;
            float: right;
            display: inline-block;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
            transform-origin: center;
            margin-right: 16px;
          }
          .glammClubFAQs details[open] summary:after {
            content: "";
            -moz-transform: rotate(-135deg);
            -ms-transform: rotate(-135deg);
            transform: rotate(-135deg);
          }
          .bg-size {
            background-size: cover;
          }
          @media only screen and (max-width: 360px) {
            .membership-sticker {
              width: 72px;
            }
            .profile-name {
              font-size: 15px;
            }
            .bg-size {
              background-size: contain;
            }
          }
        `}
      </style>

      <Widgets widgets={widgets} slugOrId={SLUG().G3_GLAMM_CLUB_WIDGETS} icidPrefix="glammclub_glammclub" />
    </div>
  );
};

GlammClub.getLayout = (children: ReactElement) => (
  <Layout footer={false} topBanner={false}>
    {children}
  </Layout>
);

GlammClub.getInitialProps = async () => {
  const widgets = await getGlammClubWidgets();
  return { widgets };
};

export default GlammClub;
