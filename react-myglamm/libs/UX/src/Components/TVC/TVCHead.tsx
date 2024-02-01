import React, { useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER, CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const TVCHead = () => {
  const router = useRouter();

  // Adobe Analytics[1] - Page Load - Home
  useEffect(() => {
    const pageload = {
      common: {
        pageName: "web|ShraddhaKapoor",
        newPageName: ADOBE.ASSET_TYPE.TVC,
        subSection: ADOBE.ASSET_TYPE.TVC,
        assetType: ADOBE.ASSET_TYPE.TVC,
        newAssetType: "TVC Page",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = pageload;
  }, []);

  return (
    <Head>
      <title key="title">Watch the Shraddha Kapoor MyGlamm TV Ad & Get Her Favourite Lipstick Free!</title>
      <meta
        key="description"
        name="description"
        content="Watch MyGlamm's TV ad & fill our survey to tell us your beauty, skincare & haircare needs. In return, get Shraddha Kapoor's favourite LIT Lipstick absolutely free."
      />
      <meta
        key="og:title"
        property="og:title"
        content="Watch the Shraddha Kapoor MyGlamm TV Ad & Get Her Favourite Lipstick Free!"
      />
      <meta
        key="og:description"
        property="og:description"
        content="Watch MyGlamm's TV ad & fill our survey to tell us your beauty, skincare & haircare needs. In return, get Shraddha Kapoor's favourite LIT Lipstick absolutely free."
      />
      <link key="canonical" rel="canonical" href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${router.asPath.split("?")[0]}`} />
    </Head>
  );
};

export default TVCHead;
