import React, { useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { useRouter } from "next/router";

import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import "@libStyles/css/shopBtn.module.css";

import CopyDark from "../../../public/svg/copy-dark.svg";

const CopyScratchCode = ({
  couponCode,
  id,
  webURL,
  // adobeEvent,
  couponPlaceholder,
  statusId,
  pageName,
  showUpdatedStatus,
  fullScreen,
  t,
}: any) => {
  const [showCopied, setShowCopied] = useState<string | null>();
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const router = useRouter();
  /* Copy Coupon To Clipboard in case a Coupon Code is Present with Offer */
  const copyCoupon = (offerId: string, event: any) => {
    event.stopPropagation();

    navigator.clipboard.writeText(couponCode);
    setShowCopied(offerId);

    adobeEvent("Copy code");
  };

  const adobeEvent = (ctaName?: any) => {
    const pageType = "Scratch and win";
    const buttonName = ctaName?.toLowerCase();
    const screenName = pageName?.toLowerCase();
    const linkName = fullScreen
      ? `web|${screenName || ""}|new scratch card|${buttonName}`
      : `web|${screenName || ""}|${buttonName}`;
    let commonObj = {};

    if (ctaName) {
      commonObj = {
        linkName,
        linkPageName: linkName,
        assetType: pageType,
        newAssetType: pageType,
        newLinkPageName: `${pageName || ""} ${buttonName}`,
        subSection: `${pageName || ""} ${buttonName}`,
        pageLocation: pageName,
        platform: ADOBE.PLATFORM,
        ctaName,
      };
    }

    (window as any).digitalData = {
      common: commonObj,
      user: Adobe.getUserDetails(profile),
    };
    if (ctaName) {
      Adobe.Click();
    } else {
      Adobe.PageLoad();
    }
  };

  const couponText = couponPlaceholder || couponCode;

  return (
    <div className="mx-auto">
      {showCopied === id || !couponCode || couponCode?.trim() === "" ? (
        <div className="relative">
          <img
            aria-hidden
            src="https://files.myglamm.com/site-images/original/copy1.png"
            alt="test"
            className="relative w-36 mx-auto"
          />

          <button
            aria-hidden
            type="button"
            className={`${
              showCopied === id ? "shopBtn" : ""
            } absolute flex items-center justify-center opacity-80 right-0 bg-color1  top-0 bottom-0 w-full rounded-3xl`}
            style={{ right: "0px" }}
            onClick={e => {
              adobeEvent("Shop now");
              e.stopPropagation();
              router.push(t("scratchAndWin")?.scratchCardShopNowWebUrl || `/buy/skincare`);
            }}
          >
            <span className="text-black">{t("scratchAndWin")?.scratchCardShopNowCTA}</span>
          </button>
        </div>
      ) : (
        <div className="relative">
          <span
            className="absolute flex top-1/2  justify-center  truncate items-center text-sm uppercase"
            style={{
              left: "34%",
              transform: "translate(-50%,-50%)",
            }}
          >
            {couponText.substring(0, 7)}
            {couponText.length > 8 && "..."}
          </span>

          <img
            aria-hidden
            src="https://files.myglamm.com/site-images/original/copy1.png"
            alt="test"
            className="relative w-36 mx-auto"
          />
          <span
            role="presentation"
            onClick={e => copyCoupon(id, e)}
            className={` absolute bg-color1 flex items-center justify-center opacity-80 right-0 top-0 bottom-0 w-14 rounded-3xl`}
          >
            <CopyDark />
          </span>
        </div>
      )}
    </div>
  );
};

export default CopyScratchCode;
