import React, { Fragment, useEffect, useState } from "react";
import Script from "next/script";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";

import PaymentAPI from "@libAPI/apis/PaymentAPI";

import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { BASE_URL } from "@libConstants/COMMON.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { PaymentType, SimplState } from "@typesLib/Payment";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { SHOP } from "@libConstants/SHOP.constant";
import dynamic from "next/dynamic";
import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import clsx from "clsx";
import { formatPrice } from "@libUtils/format/formatPrice";

const FreeShippingStrip = dynamic(() => import("@libComponents/Cart/FreeShippingStrip"), { ssr: false });
const GetFreeShippingCTA = dynamic(() => import("./GetFreeShippingCTA"), { ssr: false });

const WhatsappEnabeCheckbox = dynamic(() => import("@libComponents/Payments/WhatsappEnableCheckbox"), { ssr: false });

interface SimplProps {
  handleCreateOrder: (arg1: PaymentType) => void;
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
}

const Simpl = ({ handleCreateOrder, activeTab, name, setActiveTab }: SimplProps) => {
  const { t } = useTranslation();

  const [simplState, setSimplState] = useState<SimplState>();

  const { payableAmount, isPincodeServiceable, showUpsellOnPaymentsPage } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    isPincodeServiceable: store.userReducer.isPincodeServiceable,
    showUpsellOnPaymentsPage: store.paymentReducer.showUpsellOnPaymentsPage,
    shippingCharges: store.cartReducer.cart.shippingCharges,
  }));

  /**
   * Generate Fingerprint Token to get the user's Eligibility for Simpl
   */
  const onSimplScriptLoad = () => {
    const profile = JSON.parse(localStorage.getItem(LOCALSTORAGE.PROFILE) || "{}");
    const guestData = JSON.parse(localStorage.getItem(LOCALSTORAGE.GUEST_DETAILS) || "{}");

    const email = profile?.email || guestData?.email;
    const phone = profile?.phoneNumber || guestData?.phoneNumber;

    (window as any)?.SimplFingerprint?.generateFingerprint(phone, email, (fingerprint: any) => {
      /* `payload(fingerprint)` has implemented AES (CBC/PKCS7Padding) encryption. */
      const paymentApi = new PaymentAPI();
      paymentApi
        .checkSimplEligibilty({
          phone,
          fingerprint,
          amount: parseInt((payableAmount * 100).toFixed(2)) as number,
        })
        .then(({ data }) => {
          const { success, redirection, token, message, available_credit_in_paise } = data.data || {};
          PAYMENT_REDUCER.isSimplEligible = success;
          PAYMENT_REDUCER.simplEligibleMessage = message;

          /**
           * If user is Eligible for Payment then place the order with
           * recieved chargeToken
           */
          if (success) {
            setSimplState({ chargeToken: token, message: message, creditLimit: available_credit_in_paise });
            setLocalStorageValue(LOCALSTORAGE.SIMPL_TOKEN, token);
          }

          /**
           * If user is Eligible but requires furthur actions to proceed
           * then redirect user to Simpl WebPage to compelete the payment
           */
          if (redirection) {
            setSimplState({ redirectionURL: redirection, message: message, creditLimit: available_credit_in_paise });
          }
        })
        .catch(err => console.info(err.message));
    });
  };

  const handleOnClickPaySimpl = () => {
    const { chargeToken, redirectionURL } = simplState || {};

    if (redirectionURL) {
      const redirectSuccessURL = `${BASE_URL()}/payment`;
      const redirectFailedURL = `${BASE_URL()}/order-summary?SimplPaymentStatus=failed`;

      const guestData = JSON.parse(getLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS) || "{}");

      const merchant_payload = {
        deviceType: "mobile_website",
        redirectURL: {
          success: redirectSuccessURL,
          failed: redirectFailedURL,
        },
        id: checkUserLoginStatus()?.memberId || guestData?.phoneNumber,
      };

      window.location.href = `${redirectionURL}&merchant_payload=${JSON.stringify(merchant_payload)}`;
    } else if (chargeToken) {
      handleCreateOrder("simpl");
    }
  };

  const displayMessage = () => {
    if (simplState?.message === "pending_dues") return "Insufficient credit. Settle bill to place order";
    if (simplState?.message === "linking_required") return "Link to enable 1-tap checkout";
    if (simplState?.message === "Eligible")
      return `Credit left for this cycle: ${simplState?.creditLimit && formatPrice(simplState.creditLimit, true)}`;

    return "";
  };

  return (
    <Fragment>
      <Script
        src="https://cdn.getsimpl.com/simpl-fingerprint-v1.min.js"
        strategy="lazyOnload"
        id="-SimplScript"
        type="text/javascript"
        onReady={onSimplScriptLoad}
      />

      {simplState && (
        <details
          className={`bg-white rounded px-2 mb-2 text-sm ${!isPincodeServiceable ? "pointer-events-none opacity-50" : ""}`}
          open={SHOP.ENABLE_JUSPAY && activeTab === name}
        >
          <summary
            className="outline-none  after:hidden"
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
            <div className={clsx("flex items-start mt-2", simplState.message ? "mb-2" : "")}>
              <img
                width={40}
                height={40}
                className="mt-2"
                src="https://files.myglamm.com/site-images/original/Simpl.png"
                alt="Simpl"
              />
              <div className="ml-5">
                <h2>{t("payLater")}</h2>
                <div className="text-gray-400 mt-1">{displayMessage()}</div>
              </div>
            </div>
          </summary>

          <WhatsappEnabeCheckbox />

          <div className="text-sm text-gray-500 leading-5 pt-3 pb-3 clear-both">{t("simplTermsAndConditions")}</div>

          {showUpsellOnPaymentsPage && <FreeShippingStrip showStripOnPayments={true} />}

          <div className={clsx("mt-2", showUpsellOnPaymentsPage ? "flex items-center justify-between" : "")}>
            {showUpsellOnPaymentsPage && <GetFreeShippingCTA />}
            <button
              type="button"
              onClick={handleOnClickPaySimpl}
              className="bg-ctaImg text-white uppercase my-1 text-sm px-3 py-3 w-full rounded _analytics-gtm-payment-info"
            >
              {t("confirmPlaceOrder")}
            </button>
          </div>
        </details>
      )}
    </Fragment>
  );
};

export default Simpl;
