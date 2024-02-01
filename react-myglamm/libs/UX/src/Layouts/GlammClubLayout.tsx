import React, { useEffect, useState } from "react";

import PDPStyle from "@libComponents/PDP/PDPStyle";

import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";

import GlammClubAPI from "@libAPI/apis/GlammClubAPI";

import { getMembershipIcon, getShopForMoreAmount, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import { formatPrice } from "@libUtils/format/formatPrice";

import Arrow from "../../public/svg/long-right-golden-arrow.svg";

import { ValtioStore } from "@typesLib/ValtioStore";

const cartGlammClub = {
  cartGlammClubLegendTitle: "Upgrade & Get",
  cartGlammClubVIPTitle: "Upgrade & Get",
  cartGlammClubLegendBenefits:
    "<ul class=`list-disc text-white`><li><span class='font-bold'>₹999 </span>Birthday Voucher</li><li><span class='font-bold'>Celebrity Event </span>exclusive invitation </li><li><span class='font-bold'>Free Gift</span> on every purchase above ₹399</li></ul>",
  cartGlammClubVIPBenefits:
    "<ul class=`list-disc text-white`><li><span class='font-bold'>₹499 </span> Birthday Voucher</li><li><span class='font-bold'>12 </span>Free Trail Packs </li><li><span class='font-bold'>Free Gift</span> on every purchase above ₹399</li></ul>",
};

const GlammClubLayout = ({ children }: any) => {
  const [glammClubMembershipData, setGlammClubMemberShipData] = useState<any>();
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};

  const nextMembership = glammClubMembershipData?.levelDetails?.find(
    (membership: any) => membership?.level === glammClubMembershipData?.nextMembershipLevelDetailLabel
  );

  const transitionAmount = getShopForMoreAmount(
    glammClubMembershipData?.currentMonth?.personal?.sales,
    nextMembership?.sales?.personalSales
  );

  const distanceCover = (maxSales: number, sales: number) => {
    const actualDistance = 100 - Math.round((sales / maxSales) * 100);
    if (actualDistance > 70) {
      return `${70}%`;
    }
    return `${actualDistance}%`;
  };

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
    }
  }, [profile]);

  return (
    <>
      <PDPStyle />
      {glammClubMembershipData?.currentMembershipLevel ? (
        <>
          <div
            className="rounded-t-md"
            style={{ background: `url("https://files.myglamm.com/site-images/original/bg-glamm-club.png")` }}
          >
            <div className="flex items-center p-4">
              <img className="w-24 mx-auto" src={glammClubConfig?.loginModalLogoImgSrc} alt="Glamm Club" />
              {glammClubMembershipData?.currentMembershipLevel !== 3 ? (
                <div className="text-white ml-6">
                  <div>
                    {glammClubMembershipData?.currentMembershipLevel === 1
                      ? glammClubConfig.cartGlammClubVIPTitle || cartGlammClub.cartGlammClubVIPTitle
                      : glammClubMembershipData?.currentMembershipLevel === 2
                      ? glammClubConfig.cartGlammClubLegendTitle || cartGlammClub.cartGlammClubLegendTitle
                      : ""}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        glammClubMembershipData?.currentMembershipLevel === 1
                          ? glammClubConfig.cartGlammClubVIPBenefits || cartGlammClub.cartGlammClubVIPBenefits
                          : glammClubMembershipData?.currentMembershipLevel === 2
                          ? glammClubConfig.cartGlammClubLegendBenefits || cartGlammClub.cartGlammClubLegendBenefits
                          : "",
                    }}
                    className="ml-3 text-11"
                  />
                </div>
              ) : null}
            </div>
            {glammClubMembershipData?.currentMembershipLevel < 3 ? (
              <div className="flex items-center w-full px-4 justify-between pb-6">
                <div className="flex flex-col items-center space-y-1">
                  <div className="text-white text-xs">
                    <div className="text-center">
                      <img
                        src={getMembershipIcon(glammClubMembershipData?.currentMembershipLevelDetailLabel, glammClubConfig)}
                        alt={glammClubMembershipData?.currentMembershipLevelDetailLabel}
                        className="h-5 "
                      />
                      <div className="font-bold"> {t("member") || "Member"} </div>
                    </div>
                  </div>
                </div>

                {glammClubMembershipData?.currentMembershipLevelDetailLabel !==
                  glammClubMembershipData?.nextMembershipLevelDetailLabel && (
                  <>
                    <div className="flex flex-col items-center relative pb-4">
                      <div className="">
                        <Arrow className="w-11/12 mx-auto " />
                      </div>
                      <div
                        className="flex text-10 space-x-1 absolute   bg-red-500 rounded-lg border-2 border-yellow px-1 "
                        style={{
                          right: distanceCover(
                            glammClubMembershipData?.currentMonth?.personal?.maxSales,
                            glammClubMembershipData?.currentMonth?.personal?.sales
                          ),
                          top: "-5px",
                        }}
                      >
                        <span className="text-amber-200 font-bold">
                          {transitionAmount ? formatPrice((transitionAmount as number) * 100, true) : ""}
                        </span>
                        <span className="text-white">{t("more") || "More"}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <div className="text-white text-xs text-center">
                        <img
                          src={getMembershipIcon(glammClubMembershipData?.nextMembershipLevelDetailLabel, glammClubConfig)}
                          alt={glammClubMembershipData?.nextMembershipLevelDetailLabel}
                          className="h-5"
                        />
                        <div className="font-bold"> {t("member") || "Member"} </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              glammClubMembershipData?.currentMembershipLevel === 3 && (
                <div className="flex flex-col items-center">
                  <span className="text-amber-100 font-medium">{t("congratulationsNormal") || "Congratulations"}</span>
                  <div className="flex text-white text-sm space-x-1">
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          glammClubConfig?.legendWelcomeText || "on gaining access to the <b>Exclusive Legend benefits!</b>",
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
          {children}
        </>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
};

export default GlammClubLayout;
