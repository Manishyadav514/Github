import React, { useEffect } from "react";
import Head from "next/head";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const OrdersHead = () => {
  const { t } = useTranslation();

  // Adobe Analytics[42] - Page Load - My Orders
  useEffect(() => {
    const digitalData = {
      common: {
        pageName: "web|hamburger|account|my account|my orders",
        newPageName: "my orders",
        subSection: "my orders/my profile",
        assetType: "my order",
        newAssetType: "my account",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);

  return (
    <Head>
      <title>{t("myOrders") || "My Orders"}</title>
    </Head>
  );
};

export default OrdersHead;
