import React, { RefObject, useEffect, useState } from "react";
import { useRouter } from "next/router";

import AdSlots from "./AdSlots";
import { POPUP_ADS } from "@libConstants/AdsConstants";

const InterstitialAds = () => {
  const [showInterstitial, setShowInterstitial] = useState(false);
  const adsBlock: RefObject<HTMLDivElement> = React.useRef(null);
  const router = useRouter();
  const id = router.pathname;

  const handleCloseBtnClick = () => {
    (adsBlock.current as HTMLDivElement).classList.add("hidden");
    document.getElementsByTagName("body")[0].style.overflow = "scroll";
  };

  const getAdSlot = () => {
    // add all routes where you want to show ads
    const currentPathname = router.pathname;
    if (currentPathname === "/learn" || currentPathname.includes("/learn/category/")) {
      return POPUP_ADS[0];
    } else if (/\/learn\/(?!category).*/.test(currentPathname)) {
      return POPUP_ADS[1];
    }
    if (
      currentPathname === "/getting-pregnant" ||
      currentPathname === "/baby" ||
      currentPathname === "/toddler" ||
      currentPathname === "/pregnancy" ||
      currentPathname === "/ovulation-calculator" ||
      currentPathname === "/advisory-board" ||
      currentPathname === "/become-a-creator" ||
      currentPathname === "/change-makers-2021" ||
      currentPathname === "/toxins-to-avoid-in-baby-products" ||
      currentPathname.includes("/baby-names") ||
      currentPathname.includes("/live-doctor-chat") ||
      currentPathname.includes("/community/") ||
      currentPathname.includes("/contest")
    ) {
      return POPUP_ADS[2];
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInterstitial(true);
    }, 15000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return showInterstitial ? (
    <div
      id={`${id}-main`}
      ref={adsBlock}
      className="z-50  h-full bg-transparent fixed top-0 left-0 invisible w-full"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
    >
      <div className="div-with-ad-container top-28 fixed ">
        <div className="modal-close-icon cursor-pointer" role="dialog" onClick={handleCloseBtnClick} />
        <AdSlots id={id} className="w-[320px] flex justify-center max-w-[320px]" adSlotData={getAdSlot()} isInterstitial />
        <style jsx>
          {`
            .div-with-ad-container {
              position: fixed;
              left: 50%;
              transform: translateX(-50%);
            }
            .modal-close-icon {
              position: absolute;
              width: 15px;
              height: 15px;
              border-radius: 50%;
              top: -19px;
              right: 0;
              background-color: #fff;
              cursor: pointer;
            }
          `}
        </style>
      </div>
    </div>
  ) : null;
};

export default React.memo(InterstitialAds);
