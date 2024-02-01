import React, { useState, useEffect } from "react";

import { ValtioStore } from "@typesLib/ValtioStore";
import { PaymentMethodProps } from "@typesLib/Payment";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { formatPrice } from "@libUtils/format/formatPrice";
import { isNumber } from "@libUtils/validation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { INPUT_STYLES_WEB } from "@checkoutLib/constant/PaymentCommon.constant";

const CardPayment = ({ handleCreateOrder, payment }: PaymentMethodProps) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<any[]>([]);
  const [errorFlag, setErrorFlag] = useState(true);

  const { cart, paymentReducer } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    paymentReducer: store.paymentReducer,
  }));

  const [loader, setLoader] = useState(false);

  const { isBin } = payment;
  const { binSeriesData, payableAmount, couponData } = cart;

  const [cardDetails, setCardDetails] = useState({
    cvv: "",
    name: "",
    number: "",
    expiry_month: "",
    expiry_year: "",
  });
  const [showForm, setShowForm] = useState(true);
  const [binREGEX, setBinREGEX] = useState<any>(null);
  const [binError, setBinError] = useState(false);

  const { cvv, name: Name, number, expiry_month, expiry_year } = cardDetails;

  useEffect(() => {
    if (isBin) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }, []);

  /* Creating Regex from binseries data if present or applicable */
  useEffect(() => {
    if (payment.isBin) {
      const bin = binSeriesData?.binSeries?.value;
      setBinREGEX(new RegExp((bin as Array<string>)?.map((b: any) => `^${b}`).join("|"), "g"));
    }
  }, []);

  useEffect(() => {
    if (binSeriesData && payment.isBin && cardDetails && binREGEX) {
      const cardNum = cardDetails.number.split(" ").join("");
      if (cardNum.length > 7 && !cardNum.match(binREGEX)) {
        setBinError(true);
      } else {
        setBinError(false);
      }
    }
  }, [cardDetails.number]);

  useEffect(() => {
    const emptyVal = Object.values(cardDetails).filter(x => x === "");
    if (emptyVal.length) {
      setErrorFlag(true);
    } else {
      setErrorFlag(false);
    }
  }, [cardDetails]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const details = {
      name: name === "name" ? value : Name,
      number: name === "cardNumber" ? value : number,
      cvv: name === "cvv" ? value : cvv,
      expiry_month: name === "expiryMonth" ? value : expiry_month,
      expiry_year: name === "expiryYear" ? value : expiry_year,
    };
    setCardDetails(details);
  };

  const handleKeyUp = (e: any) => {
    const { name, value } = e.target;
    if (
      (name === "name" && value.trim() !== "") ||
      (name === "cardNumber" && value.length === 16) ||
      (name === "expiryYear" && value.length === 2) ||
      (name === "expiryMonth" && value.length === 2 && value < 13) ||
      (name === "cvv" && value.length >= 3)
    ) {
      setErrors(errors.filter(x => x !== name));
    } else {
      setErrors([...Array.from(new Set([...errors, name]))]);
    }
  };

  return (
    <>
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

      {showForm && (
        <>
          <div className="tab-pane active" id="credit-debit-card">
            {!isBin && <h6 className="font-bold">New Card</h6>}
            <div className={` ${isBin ? "ml-20 w-11/12" : "payment-container"}  pull-left`}>
              <form name="cardpayform" className="form-horizontal js-newcardform form-button-disable has-validation-callback">
                <div className="form-group flex items-center mb-6">
                  <label className="font-bold w-1/5">{t("cardNumber")}</label>
                  <div className="w-4/5 relative">
                    <input
                      className="w-full h-14"
                      name="cardNumber"
                      type="text"
                      maxLength={16}
                      style={INPUT_STYLES_WEB}
                      placeholder="XXXX - XXXX - XXXX - XXXX"
                      onChange={handleChange}
                      onKeyUp={handleKeyUp}
                      onKeyPress={isNumber}
                    />
                    <span id="js-card-logo" className="card-sign" />
                    {errors.find(x => x === "cardNumber") && (
                      <span className="text-sm text-red-500 absolute -bottom-5 left-0">{t("plsEnterValidCardNum")}</span>
                    )}
                    {isBin && binError && cardDetails.number && (
                      <span className="block text-sm mt-1 text-red-600">
                        Applied coupon code is not valid for entered card number
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group flex items-center mb-6">
                  <label className="font-bold w-1/5 relative">Cardholder’s Name</label>
                  <div className="w-4/5">
                    <input
                      name="name"
                      className="grey form-control w-full h-14"
                      style={INPUT_STYLES_WEB}
                      type="text"
                      placeholder="eg. Jennifer Gomes"
                      maxLength={30}
                      onChange={handleChange}
                      onKeyUp={handleKeyUp}
                    />
                    {errors.find(x => x === "name") && (
                      <span className="text-sm text-red-500 absolute -bottom-5 left-0">{t("plsEnterValidCardName")}</span>
                    )}
                  </div>
                </div>

                <div className="form-group flex items-center w-full justify-between mb-6">
                  <label className="font-bold w-1/5">Validity till</label>
                  <div className="w-4/5 flex items-center justify-between">
                    <div className="pull-left flex w-1/2 gap-4 relative">
                      <input
                        name="expiryMonth"
                        className="w-32 h-14"
                        style={INPUT_STYLES_WEB}
                        type="text"
                        placeholder="MM"
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        onKeyPress={isNumber}
                        maxLength={2}
                      />

                      <input
                        name="expiryYear"
                        className="w-32 h-14"
                        style={INPUT_STYLES_WEB}
                        type="text"
                        placeholder="YY"
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        onKeyPress={isNumber}
                        maxLength={2}
                      />
                      {errors.find(x => x.match(/expiryMonth|expiryYear/)) && (
                        <span className="text-sm text-red-500 absolute -bottom-6">{t("plsEnterValidExpiry")}</span>
                      )}
                    </div>

                    <div className="cvv-feild pull-right w-1/2 relative">
                      <label className="control-label pull-left font-bold pr-4">{t("cvv")}</label>
                      <input
                        name="cvv"
                        className="h-14"
                        type="text"
                        placeholder="* * *"
                        style={INPUT_STYLES_WEB}
                        onChange={handleChange}
                        onKeyPress={isNumber}
                        onKeyUp={handleKeyUp}
                        maxLength={4}
                      />
                      {errors.find(x => x === "cvv") && (
                        <span className="text-sm text-red-500 absolute -bottom-6 left-12">{t("plsEnterValidCvv")}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`${isBin ? "ml-96" : ""} mt-10`}>
                  <button
                    type="button"
                    onClick={async () => {
                      setLoader(true);
                      await handleCreateOrder("razorpay", {
                        method: "card",
                        card: cardDetails,
                      });
                      setLoader(false);
                    }}
                    disabled={errorFlag || !!errors.length || loader || binError}
                    className="bg-ctaImg ml-44 uppercase h-14 w-52 relative text-white font-bold rounded-sm"
                  >
                    {!isBin ? (
                      t("proceedPay")
                    ) : (
                      <span>
                        {t("pay") || "pay"} {formatPrice(payableAmount, true, false)}
                      </span>
                    )}

                    {loader && <LoadSpinner className="w-10 inset-0 absolute m-auto" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CardPayment;
