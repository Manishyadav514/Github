import React, { useEffect } from "react";
import Head from "next/head";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import useTranslation from "@libHooks/useTranslation";

const MyProfileHead = () => {
  const { t } = useTranslation();

  // Adobe Analytics[43] - Page Load - My Profile
  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|hamburger|account",
        newPageName: "my profile",
        subSection: "my profile",
        assetType: "account",
        newAssetType: "my account",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  return (
    <Head>
      <title>{t("myProfile") || "My Profile"}</title>
    </Head>
  );
};

export default MyProfileHead;
