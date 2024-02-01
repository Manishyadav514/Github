import React, { useState, useRef, memo, RefObject, useEffect } from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { binSeries } from "@typesLib/Cart";
import { ValtioStore } from "@typesLib/ValtioStore";
import { PaymentType, PaymentData } from "@typesLib/Payment";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getLocalStorageValue } from "@libUtils/localStorage";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import clsx from "clsx";

import { useJuspaycard } from "@checkoutLib/Payment/useJuspayCard";
import { isSavedCardEnabled } from "@checkoutLib/Payment/HelperFunc";
import { COMMON_FORM_STYLES } from "@checkoutLib/constant/PaymentCommon.constant";

import OfferDescription from "./OfferDesctiption";
import { SavePaymentDetails } from "../UPI/UpiHelperComponents";

const FreeShippingStrip = dynamic(() => import("@libComponents/Cart/FreeShippingStrip"), { ssr: false });
const GetFreeShippingCTA = dynamic(() => import("../GetFreeShippingCTA"), { ssr: false });
const WhatsappEnabeCheckbox = dynamic(() => import("@libComponents/Payments/WhatsappEnableCheckbox"), { ssr: false });

interface FormProps {
  isBin?: boolean;
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => any;
  defaultOfferId?: string;
}

function JuspayDebitCardForm({ isBin, handleCreateOrder, defaultOfferId = "" }: FormProps) {
  const { t } = useTranslation();

  const [concentToSaveCard, setConcentToSaveCard] = useState<boolean>(true);

  const { payableAmount, vendorMerchantId, paymentOrder, showUpsellOnPaymentsPage } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    vendorMerchantId: store.paymentReducer.vendorMerchantId,
    paymentOrder: store.paymentReducer.paymentOrder,
    showUpsellOnPaymentsPage: store.paymentReducer.showUpsellOnPaymentsPage,
  }));

  const orderIdRef: RefObject<HTMLInputElement> = useRef(null);

  const handleOrder = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await handleCreateOrder("juspay", {
        method: "creditCard",
        saveCardDetails: saveCard ? concentToSaveCard : false,
      });

      // const orderDetails = getLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, true);

      // if (orderDetails) {
      //   (orderIdRef.current as HTMLInputElement).value = orderDetails.id;

      //   /* submit the juspay form */
      //   jusPaySetup.current.submit_form();
      // }
    } catch (error) {
      console.error(error, "--------");
    }
    /*  PUT call to create order  */
  };

  const onOrderSuccess = () => {
    const orderDetails = getLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, true);

    if (orderDetails) {
      (orderIdRef.current as HTMLInputElement).value = orderDetails.id;

      /* submit the juspay form */
      jusPaySetup.current.submit_form();
    }
  };

  useEffect(() => {
    addEventListener("creditDebitSuccess", onOrderSuccess);
    return () => {
      removeEventListener("creditDebitSuccess", onOrderSuccess);
    };
  }, []);

  const { CARD_STATES, discountedAmount, offerDescription, offerId, binError, jusPaySetup, isTokenizeSupportApplicable } =
    useJuspaycard(isBin, defaultOfferId);

  const { isCardNumberValid, isCvvCodeValid, isMonthValid, isCardValid, isYearValid } = CARD_STATES;

  const saveCard = paymentOrder && isSavedCardEnabled(paymentOrder) && isTokenizeSupportApplicable;

  return (
    <div className="mt-8">
      <form
        className="juspay_inline_form"
        id="payment_form"
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <input type="hidden" className="merchant_id" value={vendorMerchantId} />
        <input ref={orderIdRef} type="hidden" className="order_id" id="order_id" />
        <input type="hidden" className="offers" value={offerId} />

        <input type="hidden" className="tokenize" value={`${isTokenizeSupportApplicable}`} />
        <input type="hidden" className="payment_channel" value="MWEB" />
        <input
          type="hidden"
          className="juspay_locker_save"
          value={`${saveCard ? concentToSaveCard : false}`}
          checked={saveCard ? concentToSaveCard : false}
          readOnly
        />
        <div className="name_on_card_div" style={COMMON_FORM_STYLES} />
        <div className="card_number_div" style={COMMON_FORM_STYLES} />
        {isBin && binError && <span className="block text-sm mb-3 text-red-600">{t("binSeriesCardNumberErrorMsg")}</span>}

        {!isBin && !binError && isCardNumberValid && (
          <span className="block text-sm mb-3 text-red-600">{t("plsEnterValidCardNum")}</span>
        )}

        {/* Display offer description */}
        <OfferDescription offerDescription={offerDescription} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="card_exp_month_div" style={COMMON_FORM_STYLES} />
            {isMonthValid && <span className="block text-sm  mb-3 text-red-600">{t("plsEnterValidExpiry")}</span>}
          </div>
          <div>
            <div className="card_exp_year_div" style={COMMON_FORM_STYLES} />
            {isYearValid && <span className="block text-sm mb-3 text-red-600">{t("plsEnterValidExpiry")}</span>}
          </div>
        </div>

        <div className="security_code_div" style={COMMON_FORM_STYLES} />
        {isCvvCodeValid && <span className="block text-sm mb-3 text-red-600">{t("plsEnterValidCvv")}</span>}
        <input type="hidden" className="redirect" value="true" />
        <div className="px-2">
          <WhatsappEnabeCheckbox />
        </div>

        {saveCard && (
          <SavePaymentDetails
            title={t("saveCardDetails") || "Securely save this card for faster payments."}
            consentChecked={concentToSaveCard}
            setConsentChecked={setConcentToSaveCard}
          />
        )}

        {showUpsellOnPaymentsPage && <FreeShippingStrip showStripOnPayments={true} />}

        <div className={clsx("mt-2", showUpsellOnPaymentsPage ? "flex items-center justify-between" : "")}>
          {showUpsellOnPaymentsPage && <GetFreeShippingCTA />}
          <button
            className="py-2 rounded font-bold uppercase w-full bg-ctaImg text-white _analytics-gtm-payment-info"
            disabled={!isCardValid || isCardNumberValid || isCvvCodeValid}
            type="submit"
            id="common_pay_btn"
            onClick={e => {
              e.currentTarget.disabled = true;
              handleOrder(e);
            }}
          >
            {t("pay")}&nbsp;
            {formatPrice(discountedAmount ? discountedAmount : payableAmount, true, false)}
          </button>
        </div>
      </form>
    </div>
  );
}

export default memo(JuspayDebitCardForm);
