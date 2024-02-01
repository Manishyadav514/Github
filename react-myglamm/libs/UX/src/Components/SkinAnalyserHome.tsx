import useTranslation from "@libHooks/useTranslation";
import React, { useEffect } from "react";
import Image from "next/legacy/image";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { useRouter } from "next/router";

const SkinAnalyserHome = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { getStartedSkinAnalyser, howItWorksSkinAnalyser } = t("skinAnalyser");

  const handleSubmit = () => {
    (window as any).digitalData = {
      common: {
        linkName: `web|skin analyser|Get Started Landing Page`,
        linkPageName: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        ctaName: "Skin Analyser Landing Page - Get Started",
        newLinkPageName: ADOBE.ASSET_TYPE.SKIN_ANALYSER_LANDING_PAGE,
        subSection: ADOBE.ASSET_TYPE.SKIN_ANALYSER_LANDING_PAGE,
        assetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        newAssetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();

    router.push("/skin-analyser/capture-face");
  };

  return (
    <div>
      <div className="relative">
        <Image width={360} height={640} layout="responsive" alt="skin Analysis" src={getStartedSkinAnalyser} />
        <div className="top-10">
          <button
            onClick={() => handleSubmit()}
            className="text-sm text-white w-5/6  shadow-lg rounded-sm absolute inset-x-0 bottom-0 mb-4 font-semibold mx-auto uppercase bg-color1 py-2"
          >
            {t("instructionCTA") || "Get Started"}
          </button>
        </div>
      </div>
      <div className="relative p-2 mb-4">
        <p className="font-bold text-center mt-3">How it works?</p>
        <Image width={330} height={400} className="mb-4" layout="responsive" alt="skin Analysis" src={howItWorksSkinAnalyser} />
        <div className="top-10  bottom-0  mt-3  mb-4 flex justify-center">
          <button
            onClick={() => handleSubmit()}
            className="text-sm text-white w-5/6  shadow-lg rounded-sm absolute  font-semibold  uppercase bg-color1 py-2"
          >
            {t("instructionCTA") || "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalyserHome;
