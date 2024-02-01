import React, { useEffect } from "react";

import Head from "next/head";

import { ADOBE } from "@libConstants/Analytics.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const LookBookHead = ({ selectedCategory }: { selectedCategory: any }) => {
  useEffect(() => {
    const categoryName = selectedCategory?.cms[0]?.content?.name.toLowerCase() || "";

    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|glammstudio|looks",
        newPageName: ADOBE.ASSET_TYPE.LOOKBOOK,
        subSection: categoryName,
        assetType: ADOBE.ASSET_TYPE.LOOKBOOK,
        newAssetType: "content",
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
      look: {
        lookCategory: categoryName,
      },
    };
  }, [selectedCategory]);

  if (!selectedCategory) return null;

  return (
    <Head>
      <title>{selectedCategory?.cms[0]?.metadata?.title}</title>
      <meta key="description" name="description" content={selectedCategory?.cms[0]?.metadata?.description} />
      <meta key="keywords" name="keywords" content={selectedCategory?.cms[0]?.metadata?.keywords} />
      <link
        key="canonical"
        rel="canonical"
        href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${selectedCategory?.urlManager.url}`}
      />

      <meta key="og:title" property="og:title" content={selectedCategory?.cms[0]?.metadata?.title} />
      <meta key="og:description" property="og:description" content={selectedCategory?.cms[0]?.metadata?.description} />
      <meta property="og:url" content={`${BASE_URL()}${selectedCategory?.urlManager.url}`} />
    </Head>
  );
};

export default LookBookHead;
