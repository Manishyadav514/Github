import React, { Fragment, RefObject, useEffect, useRef, useState } from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";
import { PaymentMethodProps } from "@typesLib/Payment";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getLocalStorageValue } from "@libUtils/localStorage";

import { COMMON_FORM_STYLES } from "@checkoutLib/constant/PaymentCommon.constant";

import { useJuspaycard } from "@checkoutLib/Payment/useJuspayCard";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import OfferDescription from "@libComponents/Payments/DebitCard/OfferDesctiption";

import DownTimeMessage from "./downTimeMessage";

const JPDebitCreditCard = ({ handleCreateOrder, payment }: PaymentMethodProps) => {
  const { t } = useTranslation();

  const { paymentReducer, cart } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    paymentReducer: store.paymentReducer,
  }));

  const orderIdRef: RefObject<HTMLInputElement> = useRef(null);

  const { isBin } = payment;

  const [loading, setLoading] = useState(false);

  const { CARD_STATES, discountedAmount, offerDescription, offerId, binError, jusPaySetup } = useJuspaycard(isBin);

  const { isCardNumberValid, isCvvCodeValid, isMonthValid, isCardValid, isYearValid } = CARD_STATES;

  const handleOrder = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    setLoading(true);
    try {
      await handleCreateOrder("juspay", {
        method: "creditCard",
        saveCardDetails: false,
      });
    } catch (error) {
      console.error(error, "------");
      setLoading(false);
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

    setLoading(false);
  };

  useEffect(() => {
    addEventListener("creditDebitSuccess", onOrderSuccess);
    return () => {
      removeEventListener("creditDebitSuccess", onOrderSuccess);
    };
  }, []);

  return (
    <Fragment>
      {isBin && (
        <button type="button" className="w-full bg-white outline-0 pr-20">
          <div className="flex justify-between mt-7">
            <div className=" flex px-2">
              <div>
                <i className="ico icon-credit-card text-3xl" />
              </div>
              <div className="ml-5 text-2xl">
                <p className="inline-block  font-bold">
                  Pay by&nbsp;
                  {paymentReducer.razorPayData?.RazorBankList?.find(x => x.value === cart.binSeriesData?.bankName?.value)
                    ?.name || ""}
                  &nbsp; Credit/Debit Card
                </p>
                <p className="text-green-400  block text-left ">
                  Get flat
                  {formatPrice(cart.couponData?.userDiscount || 0, true, false)} off
                </p>
              </div>
            </div>

            <p className="font-bold text-2xl capitalize">
              {t("pay") || "pay"} {formatPrice(cart.payableAmount, true, false)}
            </p>
          </div>
        </button>
      )}

      <DownTimeMessage downtimeMsg={payment.downtimes?.message} />

      {!isBin && <h6 className="font-bold">{t("newCard") || "New Card"}</h6>}

      <form
        className="juspay_inline_form"
        id="payment_form"
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <input type="hidden" className="merchant_id" value={paymentReducer.vendorMerchantId} />
        <input ref={orderIdRef} type="hidden" className="order_id" />
        <input type="hidden" className="offers" value={offerId} />
        <input type="hidden" className="payment_channel" value="WEB" />
        <input className="redirect" value="true" type="hidden" />
        <div className="flex justify-between">
          <label className="mt-8 font-bold">{t("cardNumber")} :</label>
          <div className="w-3/4">
            <div className="card_number_div" style={COMMON_FORM_STYLES} />
            {!isBin && !binError && isCardNumberValid && (
              <span className="block text-xl mb-3 text-red-600">Enter Valid Card Number</span>
            )}
            {isBin && binError && (
              <span className="block text-xl mb-3 text-red-600">Applied coupon code is not valid for entered card number</span>
            )}

            {/* Display offer description */}
            <OfferDescription offerDescription={offerDescription} />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <label className="mt-8 font-bold">{t("cardHoldersName") || "Cardholder’s Name"} :</label>
          <div className="w-3/4">
            <div className="name_on_card_div" style={COMMON_FORM_STYLES} />
          </div>
        </div>

        <div className="flex justify-between">
          <label className="mt-8 font-bold">{t("validity") || "Validity"} :</label>
          <div className=" flex justify-between w-3/4">
            <div className="flex">
              <div className="w-32">
                <div className="card_exp_month_div" style={COMMON_FORM_STYLES} />
                {isMonthValid && <span className="block text-xl  mb-3 text-red-600">Enter valid Month</span>}
              </div>

              <div className="w-32 mx-3">
                <div className="card_exp_year_div" style={COMMON_FORM_STYLES} />
                {isYearValid && <span className="block text-xl mb-3 text-red-600">Enter valid Year</span>}
              </div>
            </div>
            <div className="flex justify-between">
              <label className="mt-8 mx-3 font-bold">{t("cvv") || "CVV"} :</label>
              <div className="w-32">
                <div className="security_code_div" style={COMMON_FORM_STYLES} />
                {isCvvCodeValid && <span className="block text-xl mb-3 text-red-600">Enter valid CVV Code</span>}
              </div>
            </div>
          </div>
        </div>

        <div className={`${isBin ? "ml-96" : ""} mt-4`}>
          <button
            type="submit"
            id="common_pay_btn"
            onClick={handleOrder}
            disabled={!isCardValid || loading}
            className="bg-ctaImg h-14 relative w-52 rounded-sm text-white font-bold ml-56 uppercase"
          >
            {!isBin &&
              (discountedAmount ? (
                <span>
                  {t("pay") || "pay"}&nbsp;{formatPrice(discountedAmount, true, false)}
                </span>
              ) : (
                <span>
                  {t("pay") || "pay"}&nbsp;{formatPrice(cart.payableAmount, true, false)}
                </span>
              ))}

            {isBin && (
              <span>
                {t("pay") || "pay"}&nbsp;{formatPrice(cart.payableAmount, true, false)}
              </span>
            )}

            {loading && <LoadSpinner className="inset-0 absolute m-auto w-10" />}
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default JPDebitCreditCard;
