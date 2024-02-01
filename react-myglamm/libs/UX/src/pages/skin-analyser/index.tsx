import React, { ReactElement, useEffect } from "react";
import Head from "next/head";
import { ORGANIZATION_SCHEMA } from "@libConstants/Schema.constant";
import { getVendorCode } from "@libUtils/getAPIParams";
import SkinAnalyserHome from "@libComponents/SkinAnalyserHome";
import { skinAnalyserHomeAnalytics } from "@checkoutLib/Storage/HelperFunc";
import { GASkinAnalyzer } from "@libUtils/analytics/gtm";
import { useRouter } from "next/router";
import SEOMain from "@libComponents/LayoutComponents/SEOMain";

const SkinAnalysis = () => {
  useEffect(() => {
    skinAnalyserHomeAnalytics();
    GASkinAnalyzer("Skin Analyser Landing Page");
  }, []);
  const { asPath } = useRouter();

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

SkinAnalysis.getLayout = (children: ReactElement) => children;
export default SkinAnalysis;
