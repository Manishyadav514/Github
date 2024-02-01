import React, { useEffect, ReactElement } from "react";
import Head from "next/head";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import TVCWidgets from "@components/TVC/TVCWidgets";

import Layout from "@libLayouts/Layout";

function FocusGroup({ widgets }: any) {
  // Adobe Analytics[1] - Page Load - Home
  useEffect(() => {
    const pageload = {
      common: {
        pageName: "web|FocusGroup",
        newPageName: ADOBE.ASSET_TYPE.FOCUS_GROUP,
        subSection: ADOBE.ASSET_TYPE.FOCUS_GROUP,
        assetType: ADOBE.ASSET_TYPE.FOCUS_GROUP,
        newAssetType: ADOBE.ASSET_TYPE.FOCUS_GROUP,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = pageload;
  }, []);

  return (
    <section className="bg-white h-auto" style={{ minHeight: "100vh" }}>
      <Head>
        <meta key="description" name="description" content="Focus Group" />
        <title key="title">Focus Group</title>
        <meta key="og:title" property="og:title" content="Focus Group" />
        <meta key="og:description" property="og:description" content="Focus Group." />
      </Head>

      {widgets?.map((widget: any, index: number) => (
        <TVCWidgets key={widget.id} widget={widget} index={index} />
      ))}
    </section>
  );
}

FocusGroup.getLayout = (children: ReactElement) => (
  <Layout footer={false} topBanner={false}>
    {children}
  </Layout>
);

FocusGroup.getInitialProps = async () => {
  const widgetApi = new WidgetAPI();

  const { data } = await widgetApi.getWidgets({
    where: {
      slugOrId: "mobile-site-focus-group",
    },
  });
  return { widgets: data?.data?.data?.widget };
};

export default FocusGroup;
