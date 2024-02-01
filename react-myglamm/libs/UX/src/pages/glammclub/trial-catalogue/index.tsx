import React, { ReactElement, useEffect } from "react";
import Layout from "@libLayouts/Layout";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { SLUG } from "@libConstants/Slug.constant";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";
import { GATrialCatalog } from "@libUtils/analytics/gtm";

const TrialCatalogue = ({ widgets }: { widgets: any[] }) => {
  /* ADOBE EVENT - PAGELOAD - Glamm Club Trial Catalogue */
  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|Glammclub|Trial Catalog",
        newPageName: "Glammclub Trial Catalog",
        subSection: "Glammclub Trial Catalog",
        assetType: "Trial Catalog",
        newAssetType: "Trial Catalog",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
    /* WebEngage Event - Page View - Glamm Club Trial Catalogue */
    const webengageDataLayer = { screenName: "Trial Catalog" };
    GATrialCatalog(webengageDataLayer);
  }, []);

  return (
    <div className="bg-white">
      <Widgets
        widgets={widgets}
        slugOrId={SLUG().G3_GLAMM_CLUB_TRIAL_CATALOGUE_WIDGETS}
        icidPrefix="TrialCatalog_TrailCatalog"
      />
    </div>
  );
};

TrialCatalogue.getLayout = (children: ReactElement) => (
  <Layout footer={false} topBanner={false}>
    {children}
  </Layout>
);

TrialCatalogue.getInitialProps = async () => {
  const widgetApi = new WidgetAPI();
  try {
    const { data } = await widgetApi.getHomeWidgets(
      { where: { slugOrId: SLUG().G3_GLAMM_CLUB_TRIAL_CATALOGUE_WIDGETS } },
      10,
      0,
      false
    );
    return { widgets: data?.data?.data?.widget };
  } catch {
    return { widgets: [] };
  }
};

export default TrialCatalogue;
