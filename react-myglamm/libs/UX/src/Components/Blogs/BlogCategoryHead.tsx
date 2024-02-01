import React, { useEffect } from "react";
import Head from "next/head";

import { ADOBE } from "@libConstants/Analytics.constant";

import { useRouter } from "next/router";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const BlogCategoryHead = ({ header, metaData }: { header: string; metaData: any }) => {
  const { asPath } = useRouter();

  // Adobe Analytics[37] - Page Load - glammstudio/blog category
  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|glammstudio|${header}`,
        newPageName: "blog category",
        subSection: `${header}`,
        assetType: "blog category",
        newAssetType: "content",
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
      blog: {
        blogCategory: `${header}`,
      },
    };
  }, []);

  return (
    <Head>
      {/* SEO */}
      <title>{metaData?.title || header}</title>
      <meta key="description" name="description" content={metaData?.description} />
      <meta key="keywords" name="keywords" content={metaData?.keywords} />
      <link
        key="canonical"
        rel="canonical"
        href={metaData?.canonicalTag || `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${asPath.split("?")[0]}`}
      />
      {metaData?.noIndex && <meta name="robots" content="noindex" />}
    </Head>
  );
};

export default BlogCategoryHead;
