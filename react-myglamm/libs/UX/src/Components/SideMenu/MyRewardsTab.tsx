import React from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";
import { GAMIFICATION_URL } from "@libConstants/SURVEY.constant";
import { formatPrice } from "@libUtils/format/formatPrice";

const MyRewardsTab = () => {
  const { t } = useTranslation();

  let isRewardUpdatesClicked = sessionStorage.getItem("rewardUpdates");

  return (
    <Link
      href={GAMIFICATION_URL}
      prefetch={false}
      onClick={() => sessionStorage.setItem("rewardUpdates", "true")}
      aria-label={t("titleGamification")}
    >
      <div className="flex rounded-b-xl px-4 -mt-2 bg-color2">
        <div className="py-5 items-center w-full">
          <p className="text-xs  flex items-center font-extrabold">
            {t("titleGamification")}
            {!isRewardUpdatesClicked && <span className="ml-1 w-4 text-xs text-red-500">&#9679;</span>}
          </p>
          <p className="text-10 block font-light">
            {t("myRewardsGamificationMessage") || (
              <span>Invite your friend and unlock goodies worth {formatPrice(5, true, false)} Lakhs</span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MyRewardsTab;
