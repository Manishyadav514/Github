import React from "react";
import useTranslation from "@libHooks/useTranslation";
import PayTmLogo from "../../../public/svg/payTm-logo.svg";
import { PaymentType } from "@typesLib/Payment";
import { SHOP } from "@libConstants/SHOP.constant";
import dynamic from "next/dynamic";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const WhatsappEnabeCheckbox = dynamic(() => import("@libComponents/Payments/WhatsappEnableCheckbox"), { ssr: false });

interface PaytmProps {
  handleCreateOrder: (arg1: PaymentType) => void;
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
}

function Paytm({ handleCreateOrder, activeTab, name, setActiveTab }: PaytmProps) {
  const { t } = useTranslation();

  const isPincodeServiceable = useSelector((store: ValtioStore) => store.userReducer.isPincodeServiceable);

  return (
    <details
      className={`bg-white rounded py-3 px-2 mb-2 text-sm ${!isPincodeServiceable ? "pointer-events-none opacity-50" : ""}`}
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
        <PayTmLogo className="inline mr-4" />
        {t("payByPayTm")}
      </summary>

      <WhatsappEnabeCheckbox />

      <button
        type="button"
        onClick={() => handleCreateOrder("paytm")}
        className="bg-ctaImg p-4 w-full text-white uppercase my-1 mt-3 text-sm px-4 py-3 rounded _analytics-gtm-payment-info"
      >
        {t("confirmPlaceOrder")}
      </button>
    </details>
  );
}

export default Paytm;
