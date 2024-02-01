import { useEffect } from "react";

import { ADOBE } from "@libConstants/Analytics.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { PLP_STATE } from "@libStore/valtio/PLP.store";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { GAShopView } from "@libUtils/analytics/gtm";
import { getVendorCode } from "@libUtils/getAPIParams";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useSelector } from "./useValtioSelector";

export default function useHomeOnMount(homeWidgets: any[]) {
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  useEffect(() => {
    /* Resetting PLP State and Scroll Position */
    PLP_STATE.products = [];
    const scrollPosition = sessionStorage.getItem(SESSIONSTORAGE.PLP_SCROLL_POS_Y);
    if (scrollPosition) {
      sessionStorage.removeItem(SESSIONSTORAGE.PLP_SCROLL_POS_Y);
    }

    /* Firing Events Based on Guest/Logged in and data present */
    if (
      userProfile?.id ||
      !homeWidgets?.find(x => x.type === "multimedia" && x.meta?.manualWeightage && x.meta?.manualWeightage !== 100)
    ) {
      adobePageLoadHome();
    } else {
      // @ts-ignore
      addEventListener("homePageLoad", adobePageLoadHome);
    }

    return () => {
      // @ts-ignore
      removeEventListener("homePageLoad", adobePageLoadHome);
    };
  }, []);

  // Adobe Analytics[1] - Page Load - Home
  const adobePageLoadHome = (event?: { detail: "trueV1" | "trueV2" }) => {
    window.requestIdleCallback(() => {
      window.requestAnimationFrame(() => {
        const pageload = {
          common: {
            pageName: "web|home|homepage",
            newPageName: "homepage",
            subSection: ADOBE.ASSET_TYPE.HOME,
            assetType: ADOBE.ASSET_TYPE.HOME,
            newAssetType: ADOBE.ASSET_TYPE.HOME,
            platform: ADOBE.PLATFORM,
            pageLocation: "",
            technology: ADOBE.TECHNOLOGY,
          },
        };

        if (!IS_DESKTOP) {
          (window as any).evars.evar99 =
            event?.detail || JSON.stringify(!!userProfile?.meta?.attributes?.userGraphVc?.[getVendorCode()]);
        }

        ADOBE_REDUCER.adobePageLoadData = pageload;
        GAShopView();
      });
    });
  };
}
