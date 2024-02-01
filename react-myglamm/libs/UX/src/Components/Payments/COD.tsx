import React, { useState } from "react";

import { GiCash2Ico1 } from "@libComponents/GlammIcons";

import { SHOP } from "@libConstants/SHOP.constant";

import dynamic from "next/dynamic";

import { useSelector } from "@libHooks/useValtioSelector";
import { useSplit } from "@libHooks/useSplit";
import useTranslation from "@libHooks/useTranslation";

import { ValtioStore } from "@typesLib/ValtioStore";
import { PaymentType } from "@typesLib/Payment";

import clsx from "clsx";

import OrderSummaryScreen from "./OrderSummaryScreen";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

const FreeShippingStrip = dynamic(() => import("@libComponents/Cart/FreeShippingStrip"), { ssr: false });
const GetFreeShippingCTA = dynamic(() => import("./GetFreeShippingCTA"), { ssr: false });
const WhatsappEnabeCheckbox = dynamic(() => import("@libComponents/Payments/WhatsappEnableCheckbox"), { ssr: false });
const OnlyMobileLogin = dynamic(() => import("@libComponents/Auth/OnlyMobileLogin.Modal"), { ssr: false });

interface CODProps {
  handleCreateOrder: (arg1: PaymentType) => any;
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
}

const COD = ({ handleCreateOrder, setActiveTab, name, activeTab }: CODProps) => {
  const { t } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState<boolean | null>(null);
  const [showOrderConfirmationScreen, setShowOrderConfirmationScreen] = useState(false);
  const variants = useSplit({ experimentsList: [{ id: "orderReConfirmationPage" }, { id: "codCta" }], deps: [] });
  const {
    isPincodeServiceable,
    codDisableMessage,
    isCodEnable,
    showUpsellOnPaymentsPage,
    userRedeemedGlammPoints,
    payableAmount,
  } = useSelector((store: ValtioStore) => ({
    isPincodeServiceable: store.userReducer.isPincodeServiceable,
    isCodEnable: store.paymentReducer.isCodEnable,
    codDisableMessage: store.paymentReducer.codDisableMessage,
    firstOrder: store.cartReducer.cart.firstOrder,
    paymentOrder: store.paymentReducer.paymentOrder,
    showUpsellOnPaymentsPage: store.paymentReducer.showUpsellOnPaymentsPage,
    userRedeemedGlammPoints: store.paymentReducer.userRedeemedGlammPoints,
    payableAmount: store.cartReducer.cart.payableAmount,
  }));

  const handleOrder = () => {
    if (variants?.orderReConfirmationPage === "1") setShowOrderConfirmationScreen(true);
    else handleCreateOrder("cash");
  };

  const getCodMessage = () => {
    if (userRedeemedGlammPoints) return "COD disabled with glammCoins";
    if (isCodEnable) return t("codWarning");
    return codDisableMessage;
  };

  const handlePopupClose = () => {
    const btn = document.getElementById("codBtn") as HTMLButtonElement;
    if (btn) btn.disabled = false;
    setShowLoginModal(null);
  };

  return (
    <>
      <details
        className={`bg-white rounded py-3 px-2 mb-2 text-sm ${
          !isPincodeServiceable && SHOP.REGION != "MIDDLE_EAST" ? "pointer-events-none opacity-50" : ""
        }`}
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
          <GiCash2Ico1
            className="inline mr-4"
            width="30px"
            height="30px"
            fill="#01c717"
            viewBox="0 50 500 700"
            role="img"
            aria-labelledby="Cash On Delivery"
          />
          {t("cod")}
        </summary>
        <p className="text-sm mt-6 mb-4">{getCodMessage()}</p>
        <WhatsappEnabeCheckbox />
        {showUpsellOnPaymentsPage && <FreeShippingStrip showStripOnPayments={true} />}
        <div className={clsx("", showUpsellOnPaymentsPage ? "flex items-center justify-between mt-2" : "")}>
          {showUpsellOnPaymentsPage && <GetFreeShippingCTA />}
          <button
            type="button"
            id="codBtn"
            disabled={!isCodEnable || userRedeemedGlammPoints}
            onClick={e => {
              e.currentTarget.disabled = true;
              const isGuestPaymentFlow = "v1|true" === getSessionStorageValue(SESSIONSTORAGE.GUEST_PAYMENT_FLOW_VARIANT, true);
              if (isGuestPaymentFlow) {
                setShowLoginModal(true);
              } else {
                handleOrder();
              }
            }}
            className="text-white font-bold uppercase my-1 text-sm px-4 py-2 w-full rounded _analytics-gtm-payment-info bg-ctaImg"
          >
            {variants?.codCta === "1"
              ? `${t("payOnDelivery") || "Pay on Delivery"} ${formatPrice(payableAmount, true, false)}`
              : t("confirmPlaceOrder")}
          </button>
        </div>
        {showOrderConfirmationScreen && <OrderSummaryScreen handleCreateOrder={handleCreateOrder} />}
      </details>
      {typeof showLoginModal === "boolean" && (
        <OnlyMobileLogin
          show={showLoginModal}
          hide={() => handlePopupClose()}
          mergeCart={false}
          verifiedPhoneNumberPendingLogin
          onLoginSuccess={() => handleOrder()}
          onFailure={() => setShowLoginModal(null)}
        />
      )}
    </>
  );
};

export default COD;
