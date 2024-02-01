import React from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import ScratchCoupon from "@libComponents/ScratchCard/ScratchCoupon";
import ScratchRefund from "@libComponents/ScratchCard/ScratchRefund";
import ScratchGlammPoints from "@libComponents/ScratchCard/ScratchGlammPoints";
import ScratchCardDetail from "@libComponents/ScratchCard/ScratchCardDetails";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";

import useTranslation from "@libHooks/useTranslation";

interface scratchProps {
  isRotated: boolean;
  setIsRotated: any;
  scratchCardData: any;
  widgets: any;
  pageName?: any;
  showUpdatedStatus?: number;
}
function ScratchedDataContainer({
  scratchCardData,
  setIsRotated,
  isRotated,
  widgets,
  pageName,
  showUpdatedStatus,
}: scratchProps) {
  const { t } = useTranslation();

  const ViewDetailsAdobeOnClick = () => {
    const pageType: any = "Scratch and win";
    // Adobe Analytics(75) - On Click - View Details Button click .
    (window as any).digitalData = {
      common: {
        linkName: "web|listing page|new scratch card|view details",
        linkPageName: "web|listing page|new scratch card|view details",
        newLinkPageName: "Listing page new scratch card view details",
        assetType: pageType,
        newAssetType: pageType,
        subSection: "Listing page new scratch card view details",
        platform: ADOBE.PLATFORM,
        ctaName: "View details",
        pageLocation: pageName,
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <>
      <div className={`card ${isRotated ? "rotated" : ""}`}>
        <div
          className="front mx-auto py-12  shadow rounded-3xl relative bg-white"
          style={{
            backgroundImage: `url(${
              t("scratchAndWin")?.scratchCardScratchedBGFull ||
              "https://files.myglamm.com/site-images/original/scratchedBgBanner_1.png"
            })`,

            backgroundPosition: "top center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="py-4">
            <div className="text-center mx-4">
              <img src="https://files.myglamm.com/site-images/original/you-ve-won.png" alt="you won" />
            </div>

            {scratchCardData.value?.type === "glammPoints" && (
              <ScratchGlammPoints data={scratchCardData} showUpdatedStatus={showUpdatedStatus} />
            )}
            {scratchCardData.value?.type === "discount" && (
              <ScratchCoupon
                data={scratchCardData}
                pageName={pageName}
                showUpdatedStatus={showUpdatedStatus}
                fullScreen="full screen card"
              />
            )}
            {scratchCardData.value?.type === "refund" && (
              <ScratchRefund
                data={scratchCardData}
                pageName={pageName}
                showUpdatedStatus={showUpdatedStatus}
                fullScreen="full screen card"
              />
            )}
            <div>
              <div
                aria-hidden="true"
                className="text-sm text-center flex justify-center items-center"
                onClick={() => {
                  setIsRotated(true);
                  ViewDetailsAdobeOnClick();
                }}
              >
                <img src="https://files.myglamm.com/site-images/original/info.png" alt="info" className="w-3.5 mr-1.5" />
                {t("viewDetails")}
              </div>
            </div>
          </div>
        </div>

        <ScratchCardDetail data={scratchCardData} setIsRotated={setIsRotated} widgets={widgets} isRotated={isRotated} />
      </div>
    </>
  );
}

export default ScratchedDataContainer;
