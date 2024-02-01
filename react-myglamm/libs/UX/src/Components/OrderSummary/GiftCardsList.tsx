import clsx from "clsx";
import React, { useState } from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";

const GiftCardDetails = dynamic(() => import("@libComponents/PopupModal/GiftCardDetails"), {
  ssr: false,
});

const GiftCardsList = ({ orderDetails, orderStatus }: { orderDetails: any; orderStatus?: string }) => {
  const { giftCardDetails } = orderDetails;
  const isGCAddedFromMiscProducts = orderDetails?.miscellaneousProduct?.find((i: any) => i?.moduleName === 2);
  if (orderStatus !== "success" || giftCardDetails?.length === 0) {
    return null;
  }
  return (
    <div className={clsx("p-2", giftCardDetails?.length > 1 ? "flex overflow-x-scroll" : "")}>
      {giftCardDetails?.length > 0 &&
        giftCardDetails?.map((card: any) => (
          <GiftCard key={card?.orderId} giftCard={card} isGCAddedFromMiscProducts={isGCAddedFromMiscProducts} />
        ))}
    </div>
  );
};

const GiftCard = ({
  giftCard,
  isGCAddedFromMiscProducts,
}: {
  giftCard: { giftCardValue: number; giftCardExpiry: string };
  isGCAddedFromMiscProducts: boolean;
}) => {
  const { t } = useTranslation();
  const giftCardDetails = t("giftCardDetails");
  const giftCardVariant = getSessionStorageValue(SESSIONSTORAGE.GIFT_CARD_VARIANT);
  const giftCardVariantPhase2 = getSessionStorageValue(SESSIONSTORAGE.GIFT_CARD_PHASE_2_VARIANT);

  const [showTnc, setShowTnc] = useState<boolean | undefined>();

  const handleAdobeForTermsAndConditions = () => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|GC payment|termsCondition",
        newPageName: "View Gift Card Terms Conditions",
        assetType: "order summary",
        newAssetType: "order summary",
        platform: ADOBE.PLATFORM,
        pageLocation: "order summary",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  };

  return (
    <div
      className="bg-cover bg-no-repeat p-5 pb-3 m-2 rounded-lg"
      style={{
        backgroundImage: `url(${giftCardDetails?.backgroundUrl})`,
      }}
    >
      <div className="flex items-center ">
        <img className="w-15 h-15" src={giftCardDetails?.vendorLogo} />
        <div className="ml-3">
          <div className="text-white">
            {isGCAddedFromMiscProducts
              ? giftCardDetails?.[`thankYouText2${giftCardVariantPhase2}`] || `Glammclub Gift card`
              : giftCardDetails?.[`thankYouText${giftCardVariant}`] || giftCardDetails?.thankYouText}
          </div>
          <div className="text-left font-bold text-4xl text-white">{giftCardDetails?.title}</div>
        </div>
      </div>
      <div className="flex items-end justify-between mt-2">
        <div>
          <p className="text-left text-white font-semibold">
            {`${giftCardDetails?.validity.replace("{{expiry}}", giftCard?.giftCardExpiry)} - GFTXXXXX`}
          </p>
          <p className="text-left text-white text-sm w-52">
            {giftCardDetails?.[`description${giftCardVariant}`] || giftCardDetails?.description}
          </p>
        </div>
        <div className="text-4xl font-bold text-white">{formatPrice(giftCard.giftCardValue, true)}</div>
      </div>

      <button
        type="button"
        onClick={() => {
          setShowTnc(true);
          handleAdobeForTermsAndConditions();
        }}
        className="text-xs text-white border-b border-white flex ml-auto px-0.5 pt-2"
      >
        {giftCardDetails?.tnc || "Terms and Conditions"}
      </button>

      {typeof showTnc === "boolean" && (
        <GiftCardDetails
          show={showTnc}
          hideAddToBagCta
          onClose={() => setShowTnc(false)}
          minBillAmount={formatPrice(giftCard.giftCardValue, false, false) as number}
        />
      )}
    </div>
  );
};

export default GiftCardsList;
