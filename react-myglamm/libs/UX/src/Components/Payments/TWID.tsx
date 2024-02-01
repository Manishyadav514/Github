import { SHOP } from "@libConstants/SHOP.constant";
import useTranslation from "@libHooks/useTranslation";
import { PaymentType } from "@typesLib/Payment";
import React from "react";
import DowntimeMsg from "./DowntimeMsg";
import WhatsappEnabeCheckbox from "./WhatsappEnableCheckbox";
import OfferTag from "../../../public/svg/offer-tag.svg";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useFetchBestOffers } from "@libHooks/useFetchBestOffers";
import dynamic from "next/dynamic";
import { getTwidPayableAmount } from "@checkoutLib/Payment/HelperFunc";

const BestOffersForPaymentMethod = dynamic(() => import("@libComponents/Common/BestOffers"), {
  ssr: false,
});

interface TwidProps {
  handleCreateOrder: (arg1: PaymentType, arg2: any) => void;
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
  disabled: boolean;
  downtimeMsg?: string;
  twidDetails?: any;
}

const TwidPay = ({ setActiveTab, activeTab, downtimeMsg, name, disabled, twidDetails, handleCreateOrder }: TwidProps) => {
  const { t } = useTranslation();

  const { payableAmount, twidData, appliedGlammPoints } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    twidData: store.paymentReducer.TWID,
    appliedGlammPoints: store.cartReducer.cart.appliedGlammPoints,
  }));

  const twidBalance = twidData?.balance ?? 0;

  /* get best offers for UPI */
  const { bestOffer, offerApplicable } = useFetchBestOffers({ paymentMethodType: "REWARD" });

  if (twidData && twidData?.balance > 0 && twidData?.isEligible) {
    return (
      <details
        className={`bg-white rounded py-3 px-2 mb-2 text-sm ${disabled ? "pointer-events-none opacity-50" : ""}`}
        open={SHOP.ENABLE_JUSPAY && activeTab === name}
      >
        <summary
          className="outline-none"
          onClick={e => {
            if (SHOP.ENABLE_JUSPAY) {
              e.preventDefault();
              if (activeTab === name) {
                setActiveTab("");
              } else {
                setActiveTab(name);
              }
            }
          }}
        >
          <img src={twidDetails?.imageUrl} width="30px" height="30px" alt="credLogo" className="inline mr-4" />

          {t("twidRewards") || "Pay with Rewards"}

          {twidBalance > 0 && (
            <span className="p-2 bg-green-50 ml-4">
              <span className="text-green-700 font-semibold ">{`${t("save")} ₹${
                bestOffer?.effective_amount ? bestOffer.effective_amount + twidBalance : twidBalance
              }`}</span>
            </span>
          )}
        </summary>

        <div className="px-4">
          <DowntimeMsg downtimeMsg={downtimeMsg} />

          <WhatsappEnabeCheckbox />
        </div>

        {twidBalance > 0 && (
          <div className="flex items-center mb-2 ml-5 mt-3">
            <div>
              <OfferTag />
            </div>
            <p className="text-xs ml-2" style={{ color: "#00977b" }}>
              {t("save")} <span className="font-bold">₹{twidBalance}</span> by paying using reward points.
            </p>
          </div>
        )}

        {/* Display best offers for twid */}
        <BestOffersForPaymentMethod bestOffer={bestOffer} />

        <button
          type="button"
          onClick={() =>
            handleCreateOrder("juspay", {
              method: twidDetails.code,
            })
          }
          className="text-white mt-3 font-bold uppercase my-1 text-sm px-4 py-3 w-full rounded _analytics-gtm-payment-info bg-ctaImg"
        >
          {t("pay")} {getTwidPayableAmount({ payableAmount, bestOffer, offerApplicable, twidBalance })}
        </button>
      </details>
    );
  }
  return null;
};

export default TwidPay;
