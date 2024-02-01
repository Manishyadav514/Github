import { ADOBE } from "@libConstants/Analytics.constant";
import useTranslation from "@libHooks/useTranslation";
import Adobe from "@libUtils/analytics/adobe";
import React from "react";
import ChangeSection from "../../../public/svg/change-selection.svg";

const PDPChangeShadeSelection = ({ childProducts }: any) => {
  const { t } = useTranslation();

  const onCLickAdobeEvent = () => {
    (window as any).digitalData = {
      common: {
        linkName: `web|change selection`,
        linkPageName: `web|change selection`,
        ctaName: "change selection",
        subSection: "change selection",
        newLinkPageName: "change selection",
        assetType: "product description page",
        newAssetType: "product description page",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
    };
    Adobe.Click();
  };

  return (
    <div
      className="w-1/2 px-1"
      onClick={() => {
        document.getElementById("scrollToShadeSelection")?.scrollIntoView({ behavior: "smooth" });
        onCLickAdobeEvent();
      }}
    >
      <div className="flex gap-1 py-0.5  overflow-hidden">
        {childProducts?.map((prod: any) => {
          const { shadeImage } = prod?.cms?.[0]?.attributes || {};
          if (!shadeImage) return <></>;
          return <img className="squircle w-5 h-5" src={shadeImage} alt="Select Shade Preview" />;
        })}
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        <ChangeSection />
        <p className="font-bold text-11 text-color1 underline">{t("changeSelection") || "Change Selection"}</p>
      </div>
    </div>
  );
};

export default PDPChangeShadeSelection;
