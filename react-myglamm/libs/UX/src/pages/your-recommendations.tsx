import React, { useEffect } from "react";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import Head from "next/head";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";
import MultipleCollectionCarousel from "@libComponents/HomeWidgets/MultipleCollectionCarousel-homewidget";
import PersonalisedProductGridView from "@libComponents/PersonalisedWidgets/PersonalisedProductGridView";
import PersonalisedProductCarousel from "@libComponents/PersonalisedWidgets/PersonalisedProductCaraousel";

import { ADOBE } from "@libConstants/Analytics.constant";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

function YourDashBoard({ widgets }: any) {
  const { t } = useTranslation();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  // #region // Adobe Analytics[39]-Page Personalised Landing Page
  useEffect(() => {
    const common = {
      pageName: "web|personalised listing page",
      newPageName: ADOBE.ASSET_TYPE.PERSONALISED_LISTING_PAGE,
      subSection: ADOBE.ASSET_TYPE.PERSONALISED_LISTING_PAGE,
      assetType: ADOBE.ASSET_TYPE.PERSONALISED_LISTING_PAGE,
      newAssetType: ADOBE.ASSET_TYPE.PERSONALISED_LISTING_PAGE,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      technology: ADOBE.TECHNOLOGY,
    };

    ADOBE_REDUCER.adobePageLoadData = { common };
  }, []);

  return (
    <main className="bg-color2">
      <Head>
        <title>Your Recommendations</title>
      </Head>

      <section className="bg-transparent">
        {/* User Name and GlammPoints Data */}
        <div className="flex pb-4" style={{ fontFamily: "BodoniSvtyTwoITCTT" }}>
          <div className="w-2/3">
            <div className="pl-4 pt-5 pb-0 leading-tight">
              <p className="text-lgfont-thin">Hello</p>
              <p className="text-4xl font-semibold">{userProfile ? userProfile.firstName : "Guest"}</p>
            </div>
            <span className="pl-4 italic">You look beautiful today :)</span>
          </div>

          {userProfile && (
            <div className="leading-tight w-1/3 text-right pr-4 pt-12 tracking-tight">
              <span className="font-semibold text-gray-600 text-[8px]">You have</span>
              <br />
              <div className="flex justify-end">
                <GoodPointsCoinIcon className="mt-2 h-4 w-4" />
                <span className="text-2xl ml-1 font-semibold tracking-tight">
                  {userProfile?.currentBalance?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
              </div>
              <span className="text-xs beautifulText italic">{t("myglammPoints")}</span>
            </div>
          )}
        </div>

        {/* Personalized Widgets For User */}
        <section className="rounded-t-3xl py-7">
          {widgets?.map((item: any, index: number) => {
            const icid = `personalised listing page_personalised listing page_${item.customParam.toLowerCase()}_${item.label.toLowerCase()}_${
              index + 1
            }`;
            return (
              <LazyLoadComponent key={item.id}>
                {item.customParam.match(/module-carousel-2|module-carousel-3|module-grid-2/) && (
                  <PersonalisedProductCarousel item={item} icid={icid} />
                )}

                {item.customParam === "module-carousel-1" && <MultipleCollectionCarousel item={item} icid={icid} />}

                {item.customParam === "module-grid-3" && <PersonalisedProductGridView item={item} icid={icid} />}
              </LazyLoadComponent>
            );
          })}
        </section>
      </section>
    </main>
  );
}

YourDashBoard.getInitialProps = async () => {
  const widgetApi = new WidgetAPI();

  const { data } = await widgetApi.getWidgets({
    where: { slugOrId: "mobile-site-personalised-homegroup" },
  });

  return { widgets: data?.data?.data?.widget };
};

export default YourDashBoard;
