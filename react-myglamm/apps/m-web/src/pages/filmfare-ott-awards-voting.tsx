import React, { useEffect, useState, ReactElement } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import Widgets from "@libComponents/HomeWidgets/Widgets";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import Layout from "@libLayouts/Layout";

const FilmfareSurveyThankyou = dynamic(() => import("@components/Survey/FilmfareSurveyThankyou"), { ssr: false });

const Filmfare = ({ widgets }: { widgets: any[] }) => {
  const [showThankyouPage, setShowThankyouPage] = useState(false);

  const showSurveyThankyou = () => {
    window.scrollTo(0, 0);
    setShowThankyouPage(true);
  };
  const hideSurveyThankyou = () => {
    setShowThankyouPage(false);
    pageLoadFilmfare();
  };

  useEffect(() => {
    window.addEventListener("ThankyouPage", showSurveyThankyou);

    return () => window.removeEventListener("ThankyouPage", showSurveyThankyou);
  }, []);

  // Adobe Analytics - Page Load - filmfare survey - On load of Landing.
  const pageLoadFilmfare = () => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|filmfareOTT`,
        newPageName: "filmfareOTT",
        subSection: ADOBE.ASSET_TYPE.FILMFARE,
        assetType: ADOBE.ASSET_TYPE.FILMFARE,
        newAssetType: ADOBE.ASSET_TYPE.FILMFARE,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  };

  useEffect(() => {
    pageLoadFilmfare();
  }, []);

  return (
    <main className="bg-pink-50 min-h-screen">
      <Head>
        <title>Filmfare</title>
      </Head>

      {showThankyouPage ? (
        <FilmfareSurveyThankyou hideSurveyThankyou={hideSurveyThankyou} />
      ) : (
        <Widgets slugOrId="mobile-site-filmfare-survey" widgets={widgets} />
      )}
    </main>
  );
};

Filmfare.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

Filmfare.getInitialProps = async () => {
  const widgetApi = new WidgetAPI();

  const { data } = await widgetApi.getWidgets({ where: { slugOrId: "mobile-site-filmfare-survey" } });

  return { widgets: data?.data?.data?.widget || [] };
};

export default Filmfare;
