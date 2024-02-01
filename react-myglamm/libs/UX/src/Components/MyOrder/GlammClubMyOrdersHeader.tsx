import React, { useState, useEffect } from "react";
import GlammClubAPI from "@libAPI/apis/GlammClubAPI";
import { v4 as uuid4 } from "uuid";
import { getMembershipIcon, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import useAppRedirection from "@libHooks/useAppRedirection";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { formatPrice } from "@libUtils/format/formatPrice";
import useTranslation from "@libHooks/useTranslation";

const GlammClubMyOrdersHeader = ({ glammClubConfig }: any) => {
  const { t } = useTranslation();
  const [glammClubMembershipData, setGlammClubMemberShipData] = useState<any>();
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const glammPercentage =
    (100 * glammClubMembershipData?.currentMonth?.personal?.salesNeeded) /
    glammClubMembershipData?.currentMonth?.personal?.maxSales;

  useEffect(() => {
    if (profile) {
      getGlammDetails();
    }
  }, [profile]);

  async function getGlammDetails() {
    if (profile) {
      const glammClubApi = new GlammClubAPI();
      const res = await glammClubApi.getGlammClubMembershipDetails(profile?.id);
      setGlammClubMemberShipData(res?.data?.data);
    }
  }

  const { redirect } = useAppRedirection();

  const getBenefitsArray = (benefitsArray: any, position?: any) => {
    const middleIndex = Math.ceil(benefitsArray?.length / 2);

    if (position === "start") {
      return benefitsArray?.slice(0, middleIndex);
    }
    return benefitsArray?.slice(-middleIndex);
  };

  const adobeClickEventShopNow = (ctaName: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|My Orders|Glammclub|Shop Now`,
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

  return (
    <>
      {glammClubConfig?.enableMyOrdersPersonalisation && profile && glammClubMembershipData?.currentMembershipLevel < 3 && (
        <div
          className="relative h-40 w-full flex flex-col items-center mb-4"
          style={{
            backgroundImage: `url(${glammClubConfig?.myOrdersGlammClubBannerImgSrc})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-center px-4 py-3 space-x-5 w-full">
            {glammClubConfig?.loginModalLogoImgSrc && (
              <img className="w-[70px] h-11" src={glammClubConfig?.loginModalLogoImgSrc} alt="Glamm Club" />
            )}
            <div className="flex flex-col text-xs text-white custom-font-size">
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    t("myOrdersOneOrderText", [`<strong>ONE</strong>`]) || `You're Just <strong>ONE</strong> Order away from`,
                }}
              ></p>
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    t("myOrdersMembershipLevelText", [
                      `<strong>${glammClubMembershipData?.nextMembershipLevelDetailLabel.replace("Glamm", "")}</strong>`,
                    ]) ||
                    `becoming a <strong>${glammClubMembershipData?.nextMembershipLevelDetailLabel.replace(
                      "Glamm",
                      ""
                    )}</strong> Member. Unlock more`,
                }}
              ></p>
              <p>{t("myOrdersUpgradeText") || "benefits by upgrading your membership."}</p>
            </div>
          </div>

          <div className="flex items-center w-full px-4 justify-between">
            <div className="flex flex-col items-center space-y-1">
              <div className="text-white text-xs">
                <div className="flex">
                  <img
                    src={getMembershipIcon(glammClubMembershipData?.currentMembershipLevelDetailLabel, glammClubConfig)}
                    alt={glammClubMembershipData?.currentMembershipLevelDetailLabel}
                    className="h-3.5"
                  />
                </div>
              </div>
              <div className="text-xs font-semibold text-white custom-font-size">{t("member") || "Member"}</div>
            </div>
            {glammClubMembershipData?.currentMembershipLevelDetailLabel !==
              glammClubMembershipData?.nextMembershipLevelDetailLabel && (
              <>
                <div className="flex flex-col items-center">
                  <div
                    className="absolute top-20 h-[17px] w-9 flex justify-center items-center"
                    style={{
                      backgroundImage: `url(${glammClubConfig?.myOrdersAmountTransitionBoxBG})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      right: `${glammClubConfig?.startOffset || 20 + glammPercentage / 2}%`,
                    }}
                  >
                    <span className="text-white text-10 font-bold">
                      {glammClubMembershipData?.currentMonth?.personal?.salesNeeded
                        ? formatPrice((glammClubMembershipData?.currentMonth?.personal?.salesNeeded as number) * 100, true)
                        : ""}
                    </span>
                  </div>

                  <svg width="226" height="8" viewBox="0 0 226 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.21973 3.53516C0.943584 3.53516 0.719727 3.75901 0.719727 4.03516C0.719727 4.3113 0.943584 4.53516 1.21973 4.53516V3.53516ZM225.513 4.38871C225.709 4.19345 225.709 3.87686 225.513 3.6816L222.331 0.499622C222.136 0.30436 221.819 0.30436 221.624 0.499622C221.429 0.694885 221.429 1.01147 221.624 1.20673L224.453 4.03516L221.624 6.86358C221.429 7.05885 221.429 7.37543 221.624 7.57069C221.819 7.76595 222.136 7.76595 222.331 7.57069L225.513 4.38871ZM1.21973 4.53516H225.16V3.53516H1.21973V4.53516Z"
                      fill="#D8B261"
                    />
                  </svg>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="text-white text-xs">
                    {" "}
                    <img
                      src={getMembershipIcon(glammClubMembershipData?.nextMembershipLevelDetailLabel, glammClubConfig)}
                      alt={glammClubMembershipData?.nextMembershipLevelDetailLabel}
                      className="h-3.5"
                    />
                  </div>
                  <div className="text-xs font-semibold text-white custom-font-size">{t("member") || "Member"}</div>
                </div>
              </>
            )}
          </div>

          <div className="flex w-full pl-7 pr-4 pt-3 items-center justify-between">
            <div className="flex text-white space-x-5 w-52">
              <ul className="list-disc text-10 space-y-1">
                {getBenefitsArray(
                  glammClubConfig?.myOrdersBenefitsText[glammClubMembershipData?.currentMembershipLevelDetailLabel],
                  "start"
                )?.map((element: any) => {
                  return <li key={uuid4()}>{element}</li>;
                })}
              </ul>
              <ul className="list-disc text-10 space-y-1">
                {getBenefitsArray(
                  glammClubConfig?.myOrdersBenefitsText[glammClubMembershipData?.currentMembershipLevelDetailLabel]
                )?.map((element: any) => {
                  return <li key={uuid4()}>{element}</li>;
                })}
              </ul>
            </div>
            <button
              onClick={() => {
                adobeClickEventShopNow("Shop Now");
                redirect(glammClubConfig?.slug || "/glammclub");
              }}
              className={`w-28 bg-gray-900 p-2 text-sm text-white rounded font-semibold uppercase`}
            >
              {t("shopNow") || "Shop Now"}
            </button>
          </div>
        </div>
      )}
      {glammClubConfig?.enableMyOrdersPersonalisation && profile && glammClubMembershipData?.currentMembershipLevel === 3 && (
        <div
          className="relative h-28 w-full flex flex-col items-center mb-4"
          style={{
            backgroundImage: `url(${glammClubConfig?.myOrdersGlammClubLegendBannerImgSrc})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="flex w-full items-center justify-between p-3">
            <img
              src={glammClubConfig?.myOrdersGlammClubLegendStickerImgSrc}
              alt={glammClubMembershipData?.currentMembershipLevelDetailLabel}
              className="h-6"
            />
            <div className="flex flex-col space-y-2 items-center">
              <img
                src={glammClubConfig?.myOrdersGlammClubLegendCongratulationsImgSrc}
                alt={t("congratulationsNormal") || "Congratulations"}
                className="w-36	h-6"
              />

              <div className="text-white text-sm font-bold uppercase">
                <p>{glammClubConfig?.legendMyOrdersText || "on stepping into greatness"}</p>
              </div>

              <button
                onClick={() => {
                  adobeClickEventShopNow("Shop Now");
                  redirect(glammClubConfig?.trialCatalogueSlug || "/glammclub/trial-catalogue");
                }}
                className={`w-28 h-7 bg-gray-900 p-1 text-xs text-white rounded font-semibold uppercase`}
              >
                {t("shopNow") || "Shop Now"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>
        {`
          @media only screen and (max-width: 360px) {
            .custom-font-size {
              font-size: 11px;
            }
          }
        `}
      </style>
    </>
  );
};

export default GlammClubMyOrdersHeader;
