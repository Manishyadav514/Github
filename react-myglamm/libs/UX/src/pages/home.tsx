import React, { useEffect } from "react";

import HomeHead from "@libComponents/Homepage/HomeHead";
import Widgets from "@libComponents/HomeWidgets/Widgets";

import { isClient } from "@libUtils/isClient";
import { getClientQueryParam } from "@libUtils/_apputils";
import { getHomeInitialProps } from "@libUtils/homeUtils";

import useHomeOnMount from "@libHooks/useHome";
import useTranslation from "@libHooks/useTranslation";

type HomePageProps = {
  slug: string;
  homeWidgets: Array<any>;
  disableSegment?: boolean;
};

function Home({ homeWidgets, slug, disableSegment = false }: HomePageProps) {
  const { t } = useTranslation();

  useHomeOnMount(homeWidgets);

  useEffect(() => {
    if (getClientQueryParam("tc") === "disable" && isClient()) {
      sessionStorage.setItem("truecaller", "disable");
    }
  }, []);

  return (
    <main className="min-h-screen bg-white pt-1">
      <HomeHead />

      <Widgets
        slugOrId={slug}
        widgets={homeWidgets}
        widgetPersonalization={true}
        disableSegment={disableSegment}
        // expId={t("abTestExperimentIds")?.[0]?.["homepageResizeBanner"]}
        abExp="homePageWidget"
      />
    </main>
  );
}

Home.getInitialProps = getHomeInitialProps;

export default Home;
