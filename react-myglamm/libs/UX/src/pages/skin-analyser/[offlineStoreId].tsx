import React, { ReactElement, useEffect } from "react";
import Head from "next/head";
import { ORGANIZATION_SCHEMA } from "@libConstants/Schema.constant";
import { getVendorCode } from "@libUtils/getAPIParams";
import SkinAnalyserHome from "@libComponents/SkinAnalyserHome";
import { skinAnalyserHomeAnalytics } from "@checkoutLib/Storage/HelperFunc";
import { useRouter } from "next/router";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

const OfflineStore = () => {
  const router = useRouter();
  const offlineStoreId = router.query.offlineStoreId as string;

  useEffect(() => {
    if (offlineStoreId) {
      skinAnalyserHomeAnalytics();
      sessionStorage.setItem(SESSIONSTORAGE.OFFLINE_STORE_NAME, offlineStoreId);
    }
  }, [offlineStoreId]);

  return (
    <React.Fragment>
      <Head>
        <title>{ORGANIZATION_SCHEMA[getVendorCode()]?.skinAnalyzerMetaTitle}</title>
        <meta name="title" key="title" content={ORGANIZATION_SCHEMA[getVendorCode()]?.skinAnalyzerMetaTitle} />
        <meta key="og:title" property="og:title" content={ORGANIZATION_SCHEMA[getVendorCode()]?.skinAnalyzerMetaTitle} />

        <meta
          name="description"
          key="description"
          content={ORGANIZATION_SCHEMA[getVendorCode()]?.skinAnalyzerMetaDescription}
        />
        <meta
          key="og:description"
          property="og:description"
          content={ORGANIZATION_SCHEMA[getVendorCode()]?.skinAnalyzerMetaDescription}
        />
      </Head>

      <SkinAnalyserHome />
    </React.Fragment>
  );
};

OfflineStore.getLayout = (children: ReactElement) => children;
export default OfflineStore;
