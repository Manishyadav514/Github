import React, { ReactElement, useEffect, useState, Fragment } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import { LazyLoadComponent } from "react-lazy-load-image-component";

import CustomLayout from "@libLayouts/CustomLayout";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import GamificationAPI from "@libAPI/apis/GamificationAPI";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import GamificationFooter from "@libComponents/Gamification/GamificationFooter";
import GamificationDetails from "@libComponents/Gamification/GamificationDetails";
import GamificationPrizeListing from "@libComponents/Gamification/GamificationPrizeListing";
import GamificationScoreBoardDetails from "@libComponents/Gamification/GamificationScoreBoardDetails";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";
import { GamificationConfig, PrizeListing, UserStats } from "@typesLib/Gamification";
import { useSplit } from "@libHooks/useSplit";

const GamificationBlockerPage = dynamic(
  () => import(/* webpackChunkName: "BlockerPage" */ "@libComponents/Gamification/GamificationBlockerPage"),
  { ssr: false }
);

const GamificationLandingPage = () => {
  const { t, isConfigLoaded } = useTranslation();

  const variants = useSplit({ experimentsList: [{ id: "bountyRewards" }], deps: [] });
  const orderSuccessObj = t("orderSuccessGamificationObj");

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [gamificationPrizes, setGamificationPrizes] = useState<PrizeListing[]>();
  const [userGamificationStats, setuserGamificationStats] = useState<UserStats>();

  const loadGamificationData = () => {
    /* initate loading in case user logs in */
    setGamificationPrizes(undefined);

    const isLoggined = checkUserLoginStatus();

    const gamificationApi = new GamificationAPI();
    const gamificationApiCalls = [gamificationApi.getGamificationProducts()];
    if (isLoggined) {
      const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");
      gamificationApiCalls.push(gamificationApi.getGamificationStats(GAMIFICATION_DATA.dumpKey));
    }

    Promise.allSettled(gamificationApiCalls).then(([prizeProducts, stats]) => {
      // @ts-ignore
      const userStats = stats?.value?.data?.data?.[0]?.value;
      // @ts-ignore
      const prizeArray = prizeProducts.value?.data?.data;

      if (userStats?.rewards) {
        setuserGamificationStats(userStats);
        setGamificationPrizes(
          prizeArray?.map((prize: PrizeListing) => ({ ...prize, ...(userStats.rewards[prize.eventName] || {}) }))
        );
      } else {
        setGamificationPrizes(prizeArray);
      }
    });
  };

  /* Gamification ScoreBoard and Products Avialability Data Call */
  useEffect(() => {
    /* Callback received on login success */
    window.addEventListener("Login Success", loadGamificationData);

    isConfigLoaded && loadGamificationData();

    return () => window.removeEventListener("Login Success", loadGamificationData);
  }, [isConfigLoaded]);

  // Adobe Analytics[32] - Page Load -Gamification
  useEffect(() => {
    const digitalData = {
      common: {
        pageName: "web|MyGlammXOGamification",
        newPageName: "MyGlammXOGamification",
        subSection: "MyGlammXOGamification",
        assetType: "Gamification",
        newAssetType: "Gamification",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);

  return (
    <main>
      <Head>
        <title>My Rewards | Gamification</title>
      </Head>

      {/* Show Loader Till the Profile Details are loaded in redux */}
      {(() => {
        if (checkUserLoginStatus() && userProfile?.memberType.typeName !== "ambassador") {
          return <GamificationBlockerPage />;
        }

        if (gamificationPrizes) {
          return (
            <Fragment>
              {/* Based On Points(0 or greater then 0) show different view UI */}
              {userGamificationStats?.count ? (
                <GamificationScoreBoardDetails
                  gamificationPrizes={gamificationPrizes}
                  userGamificationStats={userGamificationStats}
                />
              ) : (
                <GamificationDetails variant={variants?.bountyRewards} />
              )}

              <GamificationPrizeListing userGamificationStats={userGamificationStats} gamificationPrizes={gamificationPrizes} />

              <LazyLoadComponent threshold={1100}>
                <GamificationFooter />
              </LazyLoadComponent>
            </Fragment>
          );
        }

        return (
          <div className="inset-0 w-full fixed bg-color3">
            <LoadSpinner className="inset-0 h-screen absolute m-auto w-16" />
          </div>
        );
      })()}
    </main>
  );
};

GamificationLandingPage.getLayout = (page: ReactElement) => (
  <CustomLayout header="My Rewards" fallback="My Rewards">
    {page}
  </CustomLayout>
);

export default GamificationLandingPage;
