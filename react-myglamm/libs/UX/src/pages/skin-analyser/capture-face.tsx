import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { checkUserLoginStatus, customSkinData, generateSkinAnaData } from "@checkoutLib/Storage/HelperFunc";

import SkinAnalysisAPI from "@libAPI/apis/SkinAnalysisAPI";

import { ADOBE } from "@libConstants/Analytics.constant";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import Adobe from "@libUtils/analytics/adobe";
import { GASkinAnalyzer } from "@libUtils/analytics/gtm";

const CaptureFace = () => {
  const router = useRouter();
  const skinAnalysisAPI = new SkinAnalysisAPI();
  const { memberId } = checkUserLoginStatus() || {};
  const { t } = useTranslation();
  const skinAnalyserDetails = t("skinAnalyser");
  const perfectCorpApiKey = t("gbcENV");

  const [showInstructions, setShowInstructions] = useState(false);

  const LoadPerfectScript = (d: any, k: any) => {
    const perfectCorpSrc = "https://plugins-media.makeupar.com/c42901/sdk.js?apiKey=" + k;
    const isScriptLoaded = Boolean(document.querySelector('script[src="' + perfectCorpSrc + '"]'));

    if (!(window as any)?.YMK?.isLoaded() && !isScriptLoaded) {
      var s = d.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = perfectCorpSrc;
      var x = d.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
      (window as any).ymkAsyncInit = function () {
        (window as any).YMK.init({ height: 800, disableSkinAge: true, disableSkinHealth: true });
      };
    }
  };

  useEffect(() => {
    LoadPerfectScript(document, perfectCorpApiKey.NEXT_PUBLIC_PERFECT_CORP_API_KEY || "");

    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|Skin Analyser|Instruction Page",
        newPageName: "Skin Analyser Instruction Page",
        subSection: "Skin Analyser Instruction Page",
        assetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        newAssetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    setShowInstructions(true);
  }, []);

  useEffect(() => {
    GASkinAnalyzer("Skin Analyser Instruction Page");
  }, []);

  const handleStartSkinAnalysis = () => {
    GASkinAnalyzer("Skin Analyser Camera Scan");
    setShowInstructions(false);

    (window as any).digitalData = {
      common: {
        linkName: `web|skin analyser|Get Started Instruction Page`,
        linkPageName: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        ctaName: "Skin Analyser Instruction Page - Get Started",
        newLinkPageName: "Skin Analyser Instruction Page",
        subSection: "Skin Analyser Instruction Page",
        assetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        newAssetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();

    setTimeout(() => {
      ADOBE_REDUCER.adobePageLoadData = {
        common: {
          pageName: "web|Skin Analyser|Camera",
          newPageName: "Skin Analyser Camera",
          subSection: "Skin Analyser Camera",
          assetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
          newAssetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
      };
    }, 500);

    (window as any)?.YMK?.openSkincare();

    (window as any)?.YMK?.addEventListener("photoSaved", (data: any) => {
      console.log("photoSaved", data);
    });

    (window as any)?.YMK?.addEventListener("skinAnalysisUpdated", (data: any) => {
      if (data) {
        let customData = customSkinData(data);

        sessionStorage.setItem(SESSIONSTORAGE.SKIN_ANALYSER_RESULTS, JSON.stringify(customData));

        // send skin analysis data to backend if user is logined
        if (memberId) {
          let currentDate = new Date();
          const timmeUTC = currentDate.toUTCString();
          const skinAnalysisData = generateSkinAnaData(skinAnalyserDetails?.skinAnalysisData, customData, timmeUTC);
          skinAnalysisAPI
            .saveSkinAnalysisData(skinAnalysisData)
            .then(({ data }) => {
              console.log(data?.data?.message);
            })
            .catch((err: any) => {
              console.error("Skin analyser", err);
            });
        }
        router.push("/skin-analyser/results");
      }
    });

    // (window as any).YMK.snapshot(["base64"], (base64OrBlob: any) => {
    //   console.log("base64OrBlob", base64OrBlob);
    // });

    // (window as any).YMK.isLoaded();
  };

  return (
    <div>
      {showInstructions ? (
        <DisplayInstructions handleStartSkinAnalysis={handleStartSkinAnalysis} />
      ) : (
        <div
          id="YMK-module"
          className="w-full h-full flex flex-col justify-center items-center top-0 left-0 fixed bg-black"
        ></div>
      )}
    </div>
  );
};

export const DisplayInstructions = ({ handleStartSkinAnalysis }: { handleStartSkinAnalysis: () => void }) => {
  const { t } = useTranslation();
  const { instructionSkinAnalyser } = t("skinAnalyser");

  return (
    <div className="w-full h-full flex flex-col justify-center items-center top-0 left-0 fixed bg-black p-5">
      <img className="h-3/4" src={instructionSkinAnalyser} />
      <button
        onClick={handleStartSkinAnalysis}
        className="w-full border border-white rounded text-white py-3 mt-10 bg-gray-500 font-bold uppercase"
      >
        Get Started
      </button>
    </div>
  );
};

CaptureFace.getLayout = (children: ReactElement) => children;

export default CaptureFace;
