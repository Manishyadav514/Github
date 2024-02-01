import React, { useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { SHOP } from "@libConstants/SHOP.constant";
import { BLOG_SEO } from "@libConstants/BLOGS.constant";

import { VendorCodes } from "@typesLib/APIFilters";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const GlammStudioHead = () => {
  const { asPath } = useRouter();

  // Adobe Analytics[34] - Page Load - Glammstudio
  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|glammstudio|glamm studio",
        newPageName: ADOBE.ASSET_TYPE.GLAMMSTUDIO,
        subSection: ADOBE.ASSET_TYPE.GLAMMSTUDIO,
        assetType: ADOBE.ASSET_TYPE.GLAMMSTUDIO,
        newAssetType: "content",
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  const SEO = BLOG_SEO[SHOP.SITE_CODE as keyof typeof BLOG_SEO];

  return (
    <Head>
      {/* SEO */}
      <title>{SEO?.title || "Best Beauty Tips, Makeup Tutorials, Tips & Trends Online - MyGlamm"}</title>
      <meta
        key="description"
        name="description"
        content={
          SEO?.description ||
          "Revitalize yourself with best makeup tips, makeup tutorials alongwith tips &amp; trends related to beauty, fashion, lifestyle and much more at MyGlamm."
        }
      />
      <meta
        key="keywords"
        name="keywords"
        content={
          // @ts-ignore
          (SEO?.keywords as string) ||
          "makeup tips, makeup tutorials, beauty guides, makeup trends, online makeup tips, best makeup tips, best makeup tutorials, makeup articles, latest makeup trends, MyGlamm"
        }
      />
      <link key="canonical" rel="canonical" href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${asPath.split("?")[0]}`} />
    </Head>
  );
};

export default GlammStudioHead;
