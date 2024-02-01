import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "@libHooks/useValtioSelector";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

const EmptyScratchCardList = ({ t }: any) => {
  const router = useRouter();
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const adobeEvent = () => {
    (window as any).digitalData = {
      common: {
        linkName: "web|listing page|no cards availabe|Shop now",
        linkPageName: "web|listing page|no cards availabe|Shop now",
        ctaName: "Shop now",
        newLinkPageName: "Listing page shop now",
        subSection: "Listing page shop now",
        assetType: "Scratch and win",
        newAssetType: "Scratch and win",
        platform: ADOBE.PLATFORM,
      },
      user: Adobe.getUserDetails(profile),
    };
    Adobe.Click();
  };
  return (
    <React.Fragment>
      <div className="my-10 py-10 mx-auto">
        <div className="mx-auto flex text-2xl text-center items-center w-52  px-2 py-12 justify-center">
          {t("scratchCardNoDataText") || "Make a purchase, win a scratch card"}
        </div>
        <button
          aria-hidden
          type="button"
          className="
            text-white text-center px-4 flex justify-center items-center rounded-lg mt-10 py-3 w-3/5 mx-auto bg-color1 text-sm font-semibold rounded-sm uppercase"
          onClick={() => {
            adobeEvent();
            router.push("/buy/skincare");
          }}
        >
          {t("shopNow")}
        </button>
      </div>
    </React.Fragment>
  );
};

export default EmptyScratchCardList;
