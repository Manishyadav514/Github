import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";

import { ValtioStore } from "@typesLib/ValtioStore";
import { GamificationConfig, PrizeListing, UserStats } from "@typesLib/Gamification";

import { CTA_PRIZE } from "@libConstants/GAMIFICATION.constant";

import { getGamificationRedirectionURL } from "./getGamificationRedirection";
import { getCurrencySymbol } from "@libUtils/format/formatPrice";

const GamificationConfirmationModal = dynamic(
  () => import(/* webpackChunkName: "PrizeConfirmationModal" */ "@libComponents/PopupModal/GamificationConfirmationModal"),
  { ssr: false }
);

interface ListingPrize {
  userGamificationStats?: UserStats;
  gamificationPrizes: PrizeListing[];
}

const GamificationPrizeListing = ({ gamificationPrizes }: ListingPrize) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [selectedPrize, setSelectedPrize] = useState<PrizeListing>();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");

  const handlePrizeClick = (prize: PrizeListing) => {
    if (GAMIFICATION_DATA.installApp || GAMIFICATION_DATA.AppInstallOnClaimReward) {
      window.location.href = getAppStoreRedirectionUrl(GAMIFICATION_DATA.myRewardsBranchUrl);
    } else if (prize.status === 1) {
      setSelectedPrize(prize);
      setShowConfirmationModal(true);
    } else if (prize.status === 2 && getGamificationRedirectionURL(prize.cta)) {
      router.push(getGamificationRedirectionURL(prize.cta) || "/");
    }
  };

  const handleUserClick = () => {
    if (!userProfile) {
      SHOW_LOGIN_MODAL({ show: true, hasGuestCheckout: false });
    }
  };

  return (
    <div className="px-3 py-10 text-center">
      <h3 className="font-semibold text-sm bg-underline mb-4 text-center inline-block uppercase px-0.5">
        {userProfile ? t("gamificationClaimYourRewards") : t("allRewards")}
      </h3>

      {gamificationPrizes.map(prize => {
        const DISABLE_BTN = prize.status === 3 || !prize.status;

        return (
          <div
            key={prize.eventName}
            onClick={handleUserClick}
            className="rounded-md bg-no-repeat bg-center flex justify-between items-center p-4 pl-3 text-left mt-1"
            style={{
              backgroundSize: "100% 100%",
              backgroundImage: `url(${GAMIFICATION_DATA?.prizeBackgroundImg})`,
            }}
          >
            <div className="w-2/3">
              <p className="font-semibold text-xxs uppercase h-2">{t("invite")}</p>
              <p className="text-4xl mb-1 font-semibold">
                {prize.count.toString().padStart(2, "0")}
                <span className="text-sm italic font-thin" style={{ fontFamily: "cursive" }}>
                  {t("friends")}
                </span>
              </p>
              <p className="font-semibold text-xs leading-relaxed uppercase">{t("getFreeTitle")}</p>
              <p className="text-xs">
                {prize.subtitle.split(getCurrencySymbol())[0]}&nbsp;
                {prize.subtitle.includes(getCurrencySymbol()) && (
                  <>
                    {getCurrencySymbol()}
                    <strong>{prize.subtitle.split(getCurrencySymbol()).pop()}</strong>
                  </>
                )}
              </p>
            </div>

            {userProfile && (
              <button
                type="button"
                disabled={DISABLE_BTN}
                style={{ opacity: "1" }}
                onClick={() => handlePrizeClick(prize)}
                className={`h-7 font-semibold tracking-widest text-xs uppercase w-20 rounded-sm ${
                  CTA_PRIZE[prize.status || 0].class
                }`}
              >
                {t(CTA_PRIZE[prize.status || 0].key) || CTA_PRIZE[prize.status || 0].label}
              </button>
            )}
          </div>
        );
      })}

      {selectedPrize && (
        <GamificationConfirmationModal
          prizeInfo={selectedPrize}
          show={showConfirmationModal}
          hide={() => setShowConfirmationModal(false)}
        />
      )}
    </div>
  );
};

export default GamificationPrizeListing;
