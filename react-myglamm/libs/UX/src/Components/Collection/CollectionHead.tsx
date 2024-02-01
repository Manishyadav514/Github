import React, { useEffect } from "react";
import format from "date-fns/format";
import Head from "next/head";

import { BASE_URL } from "@libConstants/COMMON.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { GACollectionPageViewed } from "@libUtils/analytics/gtm";

import { useInfiniteScrollGA4Event } from "@libHooks/useInfiniteScrollGA4Event";

interface CollectionHeadProps {
  collection: any;
  products: any[];
}

const CollectionHead = ({ collection, products }: CollectionHeadProps) => {
  const { metadata, content } = collection?.cms?.[0] || {};

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|${content?.name}|product listing page`,
        newPageName: "product listing",
        subSection: content?.name,
        assetType: "collection",
        newAssetType: "collection",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      collection: {
        numberOfProducts: collection?.products?.length || 0,
        collection: content?.name,
      },
    };

    let tagsArray: any = [];

    const collectiontTags = collection?.meta?.tag || [];

    if (collectiontTags.length > 0) {
      collectiontTags.map((tag: any) => {
        tagsArray.push(`${tag}-${format(new Date(), "ddMMyy")}`);
      });
    }

    // #region  // *Webengage [6] - Collection Viewed : function call
    const webengageDataLayer = {
      collectionName: content?.name,
      userType: localStorage.getItem("memberId") ? "Member" : "Guest",
      tags: [...tagsArray, ...collectiontTags],
    };
    GACollectionPageViewed(webengageDataLayer);
  }, [collection]);

  useInfiniteScrollGA4Event(
    products.filter((p: any) => !!p.sku), // skip widgets
    { id: collection?.id, name: content?.name, type: "collection" }
  );

  return (
    <Head>
      <title>{metadata?.title || "Referral"}</title>
      <meta key="description" name="description" content={metadata?.description} />
      <meta key="keywords" name="keywords" content={metadata?.keywords} />
      <link
        key="canonical"
        rel="canonical"
        href={metadata?.canonicalTag || `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${collection?.urlManager?.url}`}
      />
      <meta key="og:title" property="og:title" content={metadata?.title} />
      <meta key="og:description" property="og:description" content={metadata?.description} />
      <meta key="og:url" property="og:url" content={`${BASE_URL()}${collection?.urlManager?.url}`} />
      <meta key="og:image" property="og:image" content={collection?.assets?.[0]?.url} />
      {metadata?.noIndex && <meta name="robots" content="noindex" />}
    </Head>
  );
};

export default CollectionHead;
