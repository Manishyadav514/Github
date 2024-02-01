import React from "react";
import Link from "next/link";

import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { GamificationConfig } from "@typesLib/Gamification";

import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";

import { ValtioStore } from "@typesLib/ValtioStore";

import GamificationUser from "./GamificationUser";
import GamificationShare from "./GamificationShare";

const GamificationDetails = ({ variant }: { variant: string }) => {
  const { t } = useTranslation();

  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const GetBannerText = () => {
    if (variant === "1") return GAMIFICATION_DATA.bountyBannerText;
    if (userProfile) return GAMIFICATION_DATA?.logginedBannerText;

    return GAMIFICATION_DATA?.guestBannerText;
  };

  return (
    <div>
      <section
        className="px-4 pt-7 pb-6 bg-no-repeat bg-contain bg-center text-center relative"
        style={{
          backgroundImage: `url(${
            variant === "1" ? GAMIFICATION_DATA?.rewardsBountyBackgroundBanner : GAMIFICATION_DATA?.rewardsBackgroundBanner
          })`,
          backgroundSize: "100% 100%",
        }}
      >
        <GamificationUser />

        <p className="text-xs text-center px-8 mb-5">{GetBannerText()}</p>

        <div className="pb-5">
          <img
            src={variant === "1" ? GAMIFICATION_DATA.rewardsBountyEarnBanner : GAMIFICATION_DATA?.earnBanner}
            alt="Earn Prize Worth"
          />
        </div>

        <GamificationShare variant={variant} />

        {userProfile && (
          <section
            className="rounded-xl p-5 pt-7 text-left absolute inset-x-0 mx-4"
            style={{ boxShadow: "0 3px 5px 1px rgba(0, 0, 0, 0.1)", bottom: "-95px" }}
          >
            <div className="flex items-center justify-between mb-1">
              <p
                className="leading-tight"
                dangerouslySetInnerHTML={{ __html: t("gamificationTextRewardsBalance").replace("\n", "<br />") }}
              />
              <strong className="text-4xl">0</strong>
            </div>

            <Link
              href={
                GAMIFICATION_DATA.installApp || GAMIFICATION_DATA.AppInstallOnClaimReward
                  ? getAppStoreRedirectionUrl(GAMIFICATION_DATA.trackYourFriendsBranchUrl)
                  : "/track-myrewards"
              }
              className="text-themePink text-11 tracking-wider pl-1 underline"
              aria-label={t("trackMyFriends")}
            >
              {t("trackMyFriends")}
            </Link>
          </section>
        )}
      </section>

      <div className={`bg-color3 ${userProfile ? "pt-32" : ""}`}>
        <img src={GAMIFICATION_DATA.howItWorks} alt="How it Works" />
      </div>
    </div>
  );
};

export default GamificationDetails;
