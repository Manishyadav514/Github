import React, { useEffect } from "react";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const MyRewards = () => {
  const { t } = useTranslation();

  // Adobe Analytics[44] - Page Load - My Rewards
  useEffect(() => {
    const digitalData = {
      common: {
        pageName: "web|hamburger|rewards",
        newPageName: "my rewards",
        subSection: "my rewards",
        assetType: "",
        newAssetType: "my account",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);

  return (
    <div
      className="py-8 bg-cover"
      style={{ backgroundImage: "url(https://files.myglamm.com/site-images/original/bg-blur.jpg)" }}
    >
      <img
        src="https://files.myglamm.com/site-images/original/app-img.png"
        alt="My Rewards"
        width="200"
        className="mx-auto"
        style={{ marginBottom: "0.625rem" }}
      />
      <h4 className="mx-5 mb-5 text-center leading-relaxed" style={{ fontSize: "1.31rem" }}>
        {t("To check your rewards, download the MyGlamm App")}
      </h4>
      <a href="https://myglamm.in/EYoWab2BP0" target="_blank" rel="noopener noreferrer" aria-label={t("downloadAppText")}>
        <button className="m-auto block bg-black text-white border border-black" style={{ padding: "7px 15px" }} type="submit">
          {t("downloadAppText")}
        </button>
      </a>
    </div>
  );
};

export default MyRewards;
