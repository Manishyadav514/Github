import React, { Fragment } from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import { GamificationConfig, PrizeListing, UserStats } from "@typesLib/Gamification";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";

import GamificationUser from "./GamificationUser";
import GamificationShare from "./GamificationShare";

interface ScoreBoardProps {
  userGamificationStats: UserStats;
  gamificationPrizes: PrizeListing[];
}

const GamificationScoreBoardDetails = ({ userGamificationStats, gamificationPrizes }: ScoreBoardProps) => {
  const { t } = useTranslation();

  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");

  const BALANCE = userGamificationStats.count - userGamificationStats.usedCount;

  const nextLockedPrize = gamificationPrizes.find(x => !x.status);

  return (
    <section className="pt-7 pb-6 px-2" style={{ background: "linear-gradient(to bottom,var(--color3) 90%, var(--color2) 0)" }}>
      <GamificationUser />

      <div
        className="text-center bg-no-repeat rounded-xl px-4 tracking-wider mb-4"
        style={
          nextLockedPrize
            ? { backgroundImage: `url(${GAMIFICATION_DATA?.friendsLeftBgImg})`, backgroundSize: "100% 100%" }
            : { backgroundImage: `url(${GAMIFICATION_DATA?.bravoBgBanner})`, paddingTop: "100px", backgroundSize: "100% 100%" }
        }
      >
        {nextLockedPrize && (
          <Fragment>
            <p className="text-xs pt-5 uppercase">{t("youAreJust")}</p>
            <p className="font-semibold text-2xl uppercase leading-tight">
              {(nextLockedPrize?.count || 0) - BALANCE} {t("friends")}
            </p>
            <p className="text-2xl leading-tight" style={{ color: "#d79480", fontFamily: "cursive" }}>
              {t("away")}
            </p>
            <p className="uppercase text-xs">{t("fromUnlockingNextReward")}</p>
            <p className="mb-3">
              {t("Amount", [""])} <strong>{formatPrice(nextLockedPrize?.rewardAmount, true, false)}</strong>
            </p>
          </Fragment>
        )}

        <GamificationShare />
      </div>

      <div className="bg-white rounded-xl px-4 py-6 mx-2" style={{ boxShadow: "0 3px 5px 1px rgba(0, 0, 0, 0.1)" }}>
        <h4 className="font-semibold text-sm bg-underline mb-5 leading-tight mx-auto table uppercase">{t("yourRewards")}</h4>

        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <p className="leading-tight" dangerouslySetInnerHTML={{ __html: GAMIFICATION_DATA?.balanceText }} />
          <span className="font-semibold text-3xl">{BALANCE}</span>
        </div>

        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center justify-between border-r border-gray-200 w-1/2 pr-8 opacity-75">
            <p className="text-sm leading-snug" dangerouslySetInnerHTML={{ __html: GAMIFICATION_DATA?.earnedText }} />
            <span style={{ fontSize: "28px" }}>{userGamificationStats.count}</span>
          </div>
          <div className="flex items-center justify-between w-1/2 pl-8 opacity-75">
            <p className="text-sm leading-snug" dangerouslySetInnerHTML={{ __html: GAMIFICATION_DATA?.claimedText }} />
            <span style={{ fontSize: "28px" }}>{userGamificationStats.usedCount}</span>
          </div>
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
      </div>
    </section>
  );
};

export default GamificationScoreBoardDetails;
