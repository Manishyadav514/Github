import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "@libHooks/useTranslation";
import CustomLayout from "@libLayouts/CustomLayout";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import RegisterUser from "@libComponents/PopupModal/RegisterUser";
import clsx from "clsx";
import OnlyMobileLogin from "@libComponents/Auth/OnlyMobileLogin.Modal";
import { logoutUser } from "@libStore/actions/userActions";
import { GASkinAnalyzer } from "@libUtils/analytics/gtm";

const SkinAnalysisResult = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [offlineStoreName, setofflineStoreName] = useState<any>();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [skinAnalysisResults, setSkinAnalysisResult] = useState<any>();

  const [skinData, setSkinData] = useState<any>([]);

  const skinAnalyserDetails = t("skinAnalyser");

  const { skinHealthImage, skinHealthResult } = skinAnalyserDetails;

  useEffect(() => {
    const storeNumber = sessionStorage.getItem(SESSIONSTORAGE.OFFLINE_STORE_NAME);

    let skinDetails: any = [];

    const _SkinAnalysisData = sessionStorage.getItem(SESSIONSTORAGE.SKIN_ANALYSER_RESULTS);

    const SkinAnalysisData = _SkinAnalysisData && JSON.parse(_SkinAnalysisData);

    skinAnalyserDetails.skinAnalysisData?.forEach((skin: any) => {
      if (skin.name === SkinAnalysisData?.[skin.name]?.name) {
        skinDetails.push({
          ...skin,
          score: SkinAnalysisData[skin.name].score / 10,
          scorePercentage: SkinAnalysisData[skin.name].score,
        });
      }
    });

    if (storeNumber) setofflineStoreName(storeNumber);
    setSkinData(skinDetails);
    setSkinAnalysisResult(SkinAnalysisData);

    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|skin analyser|Skin Analyser Result",
        newPageName: "Skin Analyser Result",
        subSection: "Skin Analyser Result",
        assetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        newAssetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  useEffect(() => {
    const _SkinAnalysisData = sessionStorage.getItem(SESSIONSTORAGE.SKIN_ANALYSER_RESULTS);

    const SkinAnalysisData = _SkinAnalysisData && JSON.parse(_SkinAnalysisData);

    let webengageData: any = [
      {
        name: "Overall Result",
        score: Math.trunc(SkinAnalysisData?.["SkinHealth"]?.score / 10),
      },
    ];
    skinAnalyserDetails.skinAnalysisData?.forEach((skin: any) => {
      if (skin.name === SkinAnalysisData?.[skin.name]?.name) {
        webengageData.push({
          name: skin.name,
          score: Math.trunc(SkinAnalysisData?.[skin.name]?.score / 10),
        });
      }
    });

    GASkinAnalyzer("Skin Analyser Results Page", webengageData);
  }, []);

  const handleSubmit = () => {
    (window as any).digitalData = {
      common: {
        linkName: `web|skin analyser|Recommended Product`,
        linkPageName: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        ctaName: "Skin Analyser Recommended Product",
        newLinkPageName: "Skin Analyser Result Page",
        subSection: "Skin Analyser Result Page",
        assetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        newAssetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();

    router.push("/skin-analyser/recommended-products");
  };

  if (skinData) {
    return (
      <div className="relative">
        {offlineStoreName ? <RegisterUser handleRegisterUser={() => setShowLoginModal(true)} /> : null}

        <div className={clsx("", offlineStoreName && "blur-lg")}>
          <div className="flex justify-center">
            <img
              className="h-48 w-5/12"
              src="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/1200x1200/faceimage3x.png"
            />
            <div className="relative">
              <img className="h-48" src={skinAnalyserDetails.backgroundImgUrl} />
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10/12">
                <p className="text-white  text-center text-4xl">
                  <span className="font-bold text-6xl">{(skinAnalysisResults?.["SkinHealth"]?.score / 10).toFixed(0)}</span>/10
                </p>
                <p className="text-white font-bold text-lg text-center">Your over all</p>
                <img className="flex justify-center" src={skinHealthImage} />
                <img className="mt-2" src={skinHealthResult} />
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-center">
              <img
                src="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Group-171113x.png"
                alt=""
              />
            </div>
            {skinData.map((skin: any, index: number) => (
              <div key={index} className="flex items-center mt-5">
                <img src={skin.iconUrl} alt={skin.name} className="w-16" />
                <div>
                  <span className="text-2xl ml-5">{Math.trunc(skin.score)}</span>
                  <span className="text-gray-400 text-lg">/10</span>
                </div>
                <div className="ml-5 w-full">
                  <div className="font-bold">{skin.name}</div>
                  <div className="bg-gray-200 mt-1">
                    <div className="rounded h-1" style={{ width: `${skin.scorePercentage}%`, backgroundColor: skin.color }} />
                  </div>
                </div>
              </div>
            ))}

            <div className="sticky bottom-1 inset-x-0">
              <button
                onClick={() => {
                  handleSubmit();
                  GASkinAnalyzer("Skin Analyser Recommedation Page");
                }}
                className="w-full px-10 py-2 bg-color1 mt-10 font-bold relative   text-white rounded"
              >
                {t("showProducts") || "Show Products"}
              </button>
            </div>
          </div>
        </div>

        {showLoginModal && (
          <OnlyMobileLogin
            show={showLoginModal}
            showNameField
            hide={() => setShowLoginModal(false)}
            onLoginSuccess={() => {
              setofflineStoreName(null);
              logoutUser();
            }}
            mergeCart
          />
        )}
      </div>
    );
  }

  return null;
};

SkinAnalysisResult.getLayout = (children: ReactElement) => (
  <CustomLayout header="SkinAnalyserResults" fallback="Skin Analyser Results">
    {children}
  </CustomLayout>
);

export default SkinAnalysisResult;
