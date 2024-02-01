import React from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import { GamificationConfig } from "@typesLib/Gamification";

const GamificationBlockerPage = () => {
  const { t } = useTranslation();

  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");

  return (
    <div className="pt-28 text-center">
      <img
        width={150}
        height={150}
        alt="Do not Touch"
        className="mb-5 mx-auto"
        src="https://files.myglamm.com/site-images/original/do-not-touch@2x.png"
      />

      <p className="font-semibold text-18 mb-5">{GAMIFICATION_DATA?.blockerText1}</p>

      <p className="px-10">{GAMIFICATION_DATA?.blockerText2}</p>

      <Link
        href="/"
        className="bg-ctaImg w-11/12 h-10 block mx-auto text-white font-semibold mt-40 rounded tracking-wide py-2"
        aria-label="GO TO HOMEPAGE"
      >
        GO TO HOMEPAGE
      </Link>
    </div>
  );
};

export default GamificationBlockerPage;
