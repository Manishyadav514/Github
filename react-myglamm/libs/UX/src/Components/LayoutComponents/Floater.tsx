import React from "react";
import dynamic from "next/dynamic";

import { isClient } from "@libUtils/isClient";
import Adobe from "@libUtils/analytics/adobe";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE } from "@libConstants/Analytics.constant";

import { isWebview } from "@libUtils/isWebview";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
const HomeFloater = dynamic(() => import(/* webpackChunkName: "" */ "@libComponents/HomeWidgets/HomeFloater"), { ssr: false });
const GlammClubFloater = dynamic(() => import(/* webpackChunkName: "" */ "./GlammClubFloater"), { ssr: false });

type floater = {
  slug: string;
  imgSrc: string;
  active: boolean;
  popxoImgSrc?: string;
  floaterV2: boolean;
  imgSrcV2: string;
  floaterTextSrc: string;
  floaterText: string;
};

const Floater = () => {
  const { t } = useTranslation();

  const { imgSrc, imgSrcV2, slug, active, floaterV2, floaterTextSrc, floaterText, popxoImgSrc }: floater =
    t("floaterConfig") || {};

  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  /* ADOBE EVENT - CLICK - Floater Click */
  const adobeTriggerClickEvent = () => {
    const currentRoute = isClient() ? location.href : "/";

    (window as any).digitalData = {
      common: {
        ctaName: "floater",
        linkName: `web|${currentRoute}`,
        linkPageName: currentRoute,
        newLinkPageName: currentRoute,
        subSection: currentRoute,
        assetType: "Floater",
        newAssetType: "Navigation",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  if (glammClubConfig?.active && glammClubConfig?.glammClubFloaterIcon && glammClubConfig?.slug && !isWebview()) {
    return <GlammClubFloater adobeTriggerClickEvent={adobeTriggerClickEvent} glammClubConfig={glammClubConfig} />;
  }

  if (floaterV2 && imgSrcV2 && slug && active && (floaterTextSrc || floaterText)) {
    return <HomeFloater adobeTriggerClickEvent={adobeTriggerClickEvent} />;
  }

  return null;
};

export default Floater;
