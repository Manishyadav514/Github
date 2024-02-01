import React from "react";

import clsx from "clsx";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE } from "@libConstants/Analytics.constant";

import Adobe from "@libUtils/analytics/adobe";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";

import Info from "../../../public/svg/Info Asset.svg";

const GamificationAppInstall = ({ branchURL, background }: { branchURL: string; background?: string }) => {
  const { t } = useTranslation();

  const inviteFriendsClick = () => {
    (window as any).digitalData = {
      common: {
        linkName: "web|gamification|payment success|invite multiple friend",
        linkPageName: "web|gamification|payment success|invite multiple friend",
        ctaName: "invite multiple friend",
        newLinkPageName: "MyGlammXOGamification",
        subSection: "MyGlammXOGamification",
        assetType: "Gamification",
        newAssetType: "Gamification",
        pageLocation: "",
        platform: ADOBE.PLATFORM,
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();

    window.location.href = getAppStoreRedirectionUrl(branchURL);
  };

  return (
    <div
      role="presentation"
      onClick={inviteFriendsClick}
      style={{ boxShadow: "rgb(0 0 0 / 24%) 0px 0px 3px" }}
      className={clsx("px-3.5 py-2.5 h-20 m-4 rounded", background === "white" && "bg-white")}
    >
      <Info className="float-left w-4" />
      <span className="font-semibold text-xs text-gray-500 ml-1 float-left">{t("recommended")}</span>
      <img alt="apple" className="ml-2.5 float-right" src="https://files.myglamm.com/site-images/original/layer-2.jpg" />
      <img alt="playstore" className="float-right" src="https://files.myglamm.com/site-images/original/layer-3.jpg" />
      <br />
      <p className="text-xs float-left text-left">
        {t("inviteMultipleFriendsText")}
        <br />
        <strong>{t("downloadAppNow")}!</strong>
      </p>
    </div>
  );
};

export default GamificationAppInstall;
