import React from "react";
import { PaymentType } from "@typesLib/Payment";
import { SHOP } from "@libConstants/SHOP.constant";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import dynamic from "next/dynamic";
import { formatPrice } from "@libUtils/format/formatPrice";
import OfferTag from "../../../public/svg/offer-tag.svg";
import clsx from "clsx";

const FreeShippingStrip = dynamic(() => import("@libComponents/Cart/FreeShippingStrip"), { ssr: false });
const GetFreeShippingCTA = dynamic(() => import("./GetFreeShippingCTA"), { ssr: false });

const WhatsappEnabeCheckbox = dynamic(() => import("@libComponents/Payments/WhatsappEnableCheckbox"), {
  ssr: false,
});

const DowntimeMsg = dynamic(() => import("./DowntimeMsg"), { ssr: false });

interface CredProps {
  handleCreateOrder: (arg1: PaymentType, arg2: any) => void;
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
  disabled: boolean;
  downtimeMsg?: string;
  credDetails: {
    code: string;
    imageUrl: string;
    name: string;
  };
}

const Cred = ({ setActiveTab, activeTab, downtimeMsg, name, disabled, credDetails, handleCreateOrder }: CredProps) => {
  const { t } = useTranslation();

  const { payableAmount, CRED, showUpsellOnPaymentsPage, appliedGlammPoints } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    CRED: store.paymentReducer.CRED,
    showUpsellOnPaymentsPage: store.paymentReducer.showUpsellOnPaymentsPage,
    appliedGlammPoints: store.cartReducer.cart.appliedGlammPoints,
  }));

  const showCredOffer = (
    <div className="flex items-center mb-2 ml-4 mt-3">
      <div>
        <OfferTag />
      </div>
      <p className="text-xs ml-2" style={{ color: "#00977b" }}>
        {CRED?.layout?.sub_text ?? ""}
      </p>
    </div>
  );

  if (CRED?.isEligible) {
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
          <img src={CRED?.layout?.icon} width="30px" height="30px" alt="credLogo" className="inline mr-4 rounded" />

          {CRED?.layout?.title}
        </summary>

        <div className="px-4">
          <DowntimeMsg downtimeMsg={downtimeMsg} />

          <WhatsappEnabeCheckbox />
        </div>

        {/* Cred offer */}
        {showCredOffer}

        {showUpsellOnPaymentsPage && <FreeShippingStrip showStripOnPayments={true} />}

        <div className={clsx("mt-3", showUpsellOnPaymentsPage ? "flex items-center justify-between" : "")}>
          {showUpsellOnPaymentsPage && <GetFreeShippingCTA />}
          <button
            type="button"
            onClick={() =>
              handleCreateOrder("juspay", {
                method: credDetails.code,
              })
            }
            className="text-white  font-bold uppercase my-1 text-sm px-4 py-2 w-full rounded _analytics-gtm-payment-info bg-ctaImg"
          >
            {t("pay")}
            {formatPrice(payableAmount, true, false)}
          </button>
        </div>
      </details>
    );
  }

  return null;
};

export default Cred;
