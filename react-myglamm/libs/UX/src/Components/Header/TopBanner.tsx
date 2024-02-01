import React, { useState, useEffect, useCallback } from "react";

import { useRouter } from "next/router";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { getVendorCode } from "@libUtils/getAPIParams";
import { GAgenericEvent } from "@libUtils/analytics/gtm";

import PinkGiftIcon from "../../../public/svg/ticker-gift.svg";

function TopBanner() {
  const topBanner = useSelector((store: ValtioStore) => store.navReducer.topBanner);

  const [isTopBanner, setIsTopBanner] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (document.cookie.split(";").includes("topBannerHide=true")) {
      setIsTopBanner(false);
    }
  }, []);

  /**
   * Set cookie for hiding top banner with max age of 1 week
   */
  const closeTopBanner = useCallback(() => {
    document.cookie = `topBannerHide=true ;Max-Age=${60 * 60 * 24 * 7}`;
    setIsTopBanner(false);
  }, []);

  const handleTickerClick = () => {
    if (getVendorCode() === "bbc") {
      GAgenericEvent("engagement", "BBC Clicked on Ticker", "");
    }
  };

  if (router.pathname === "/" && isTopBanner && topBanner) {
    return (
      <div className="flex items-center z-50 h-10 bg-color2">
        <div className="flex items-center font-semibold flex-grow">
          <PinkGiftIcon className="outline-none w-18px h-18px ml-3.5" roles="image" aria-labelledby="gift icon" />
          <div
            className="text-gray-600 text-11 ml-2"
            dangerouslySetInnerHTML={{
              __html: topBanner,
            }}
            onClick={() => handleTickerClick()}
          />
        </div>
        <button
          type="button"
          onClick={closeTopBanner}
          className="outline-none text-color1 pr-3.5 text-2rem leading-8 focus-visible:outline"
          aria-label="close"
        >
          ×
        </button>
      </div>
    );
  }

  return null;
}

export default TopBanner;
