import React from "react";
import useTranslation from "@libHooks/useTranslation";
import { PaymentType } from "@typesLib/Payment";
import { SHOP } from "@libConstants/SHOP.constant";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import dynamic from "next/dynamic";

const WhatsappEnabeCheckbox = dynamic(() => import("@libComponents/Payments/WhatsappEnableCheckbox"), { ssr: false });
interface PaypalProps {
  handleCreateOrder: (arg1: PaymentType) => void;
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
}

function Paypal({ handleCreateOrder, activeTab, name, setActiveTab }: PaypalProps) {
  const { t } = useTranslation();

  const isPincodeServiceable = useSelector((store: ValtioStore) => store.userReducer.isPincodeServiceable);

  return (
    <details
      className={`bg-white rounded p-4 mb-2 text-sm ${!isPincodeServiceable ? "pointer-events-none opacity-50" : ""}`}
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
        <img
          alt="Paypal"
          width="30px"
          height="30px"
          src="https://files.myglamm.com/site-images/original/paypal.png"
          className="inline mr-4 my-auto _analytics-gtm-payment-info"
        />
        {t("paypal")}
      </summary>

      <div className="pt-4">
        <WhatsappEnabeCheckbox />

        <p className="text-sm">{t("paypalMessage")}</p>

        <button
          type="button"
          onClick={() => handleCreateOrder("paypal")}
          className="bg-ctaImg p-4 w-full text-white uppercase my-1 mt-3 text-sm px-4 py-3 rounded _analytics-gtm-payment-info"
        >
          {t("confirmPlaceOrder")}
        </button>
      </div>
    </details>
  );
}

export default Paypal;
