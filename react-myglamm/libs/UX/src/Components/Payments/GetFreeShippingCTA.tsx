import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import React, { useState } from "react";
import PaymentUpsell from "./PaymentUpsell";

const GetFreeShippingCTA = () => {
  const [showUpsell, setShowUpsell] = useState(false);

  const adobeGetFreeShipping = () => {
    (window as any).digitalData = {
      common: {
        linkName: "web|upsell payment",
        linkPageName: "web|upsell payment",
        newLinkPageName: "upsell payment",
        assetType: "",
        newAssetType: "",
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName: "paymentpageUpsell",
        pageLocation: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      },
    };
    Adobe.Click();
  };

  return (
    <React.Fragment>
      <button
        onClick={() => {
          adobeGetFreeShipping();
          setShowUpsell(true);
        }}
        className="w-full mr-4 py-2 uppercase border border-gray-400 font-bold rounded"
      >
        get free shipping
      </button>

      {showUpsell && <PaymentUpsell showUpsell={showUpsell} setShowUpsell={setShowUpsell} />}
    </React.Fragment>
  );
};

export default GetFreeShippingCTA;
