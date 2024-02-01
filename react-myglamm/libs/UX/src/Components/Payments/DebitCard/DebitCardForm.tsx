import React, { ChangeEvent, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { isNumber } from "@libUtils/validation";

import WhatsappEnabeCheckbox from "@libComponents/Payments/WhatsappEnableCheckbox";

import { ValtioStore } from "@typesLib/ValtioStore";
import { CreditFromValues, PaymentType, PaymentData } from "@typesLib/Payment";

import { formatExpiry, formatCardNumber, getCardImageProps } from "@checkoutLib/Payment/cardUtils";
import { formatPrice } from "@libUtils/format/formatPrice";

interface FormProps {
  isBin?: boolean;
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => void;
}

const DebitCardForm = ({ isBin, handleCreateOrder }: FormProps) => {
  const { t } = useTranslation();

  const { payableAmount, binSeriesData } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const [binREGEX, setBinREGEX] = useState<RegExp>();

  const handleSubmitCreditCard = (value: CreditFromValues) => {
    const cardNumber = value.cardNumber.split(/\s/).join("");
    const [month, year] = value.expiryDate.split("/").map(ele => ele.trim());

    handleCreateOrder("razorpay", {
      method: "card",
      card: {
        name: value.name,
        number: cardNumber,
        cvv: value.cvc,
        expiry_month: month,
        expiry_year: year,
      },
    });
  };

  const { register, formState, handleSubmit, setError, setValue, watch, trigger } = useForm({
    defaultValues: {
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
    mode: "onChange",
    shouldFocusError: true,
  });

  const { errors, touchedFields } = formState;

  /* Format and Trigger Card Number Check onChange */
  const handleOnChangeCard = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value.split(" ").join("");
    const newvalue = formatCardNumber(currentValue);

    /* In-Case of Bin-Series test the number with created REGEX and setError if test fails */
    if (binREGEX && currentValue.length > 7 && !currentValue.match(binREGEX)) {
      setError("cardNumber", {
        type: "validate",
        message: "Applied coupon code is not valid for entered card number",
      });
      if (newvalue) setValue("cardNumber", newvalue);
    } else if (newvalue) {
      /* If Card Number Matches any format set the value in proper format else throw error */
      setValue("cardNumber", newvalue);
      trigger("cardNumber");
    } else {
      setError("cardNumber", { type: "validate", message: t("plsEnterValidCardNum") });
    }
  };

  /* Format and Trigger Exp Date Check onChange */
  const handleOnChangeExpiry = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = formatExpiry(e);

    setValue("expiryDate", newDate);

    trigger("expiryDate");
  };

  /* Creating Regex from binseries data if present or applicable */
  useEffect(() => {
    if (isBin) {
      const bin = binSeriesData?.binSeries?.value;
      setBinREGEX(new RegExp((bin as Array<string>)?.map((b: any) => `^${b}`).join("|"), "g"));
    }
  }, []);

  const cardNumber = watch("cardNumber");

  return (
    <form onSubmit={handleSubmit(handleSubmitCreditCard)} className="mb-4 w-full">
      <div className="mb-4">
        <input
          {...register("name", {
            required: t("plsEnterValidCardName"),
          })}
          type="text"
          aria-label="Name on Card"
          required
          autoComplete="cc-name"
          placeholder={t("nameOnCard")}
          className="p-2 border-gray-500 border rounded w-full"
          role="textbox"
        />
        {errors.name && touchedFields.name && <span className="text-sm text-red-600">{errors.name.message}</span>}
      </div>

      <div className="items-center bg-white rounded flex h-10 px-2.5 py-1.5 border border-gray-300 shadow-inner">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <svg {...getCardImageProps(cardNumber)} />
        <input
          {...register("cardNumber", { required: t("plsEnterValidCardNum"), minLength: 18 })}
          onChange={handleOnChangeCard}
          onKeyPress={isNumber}
          required
          aria-label="Card Number"
          autoComplete="cc-number"
          placeholder={t("cardNumber")}
          className="my-4 p-2 pl-3 bg-transparent rounded w-full outline-none"
          maxLength={19}
          role="textbox"
        />
      </div>
      {errors.cardNumber && touchedFields.cardNumber && (
        <span className="text-sm text-red-600">{errors.cardNumber.message}</span>
      )}

      <div className="flex justify-between">
        <div className="my-4 mr-4 w-2/3">
          <input
            {...register("expiryDate", {
              pattern: {
                value: /[0-1][0-9]\s\/\s[0-9]{2}/,
                message: t("plsEnterValidExpiry"),
              },
              required: t("plsEnterValidExpiry"),
            })}
            onChange={handleOnChangeExpiry}
            onKeyPress={isNumber}
            required
            autoComplete="cc-exp"
            aria-label="Expiry date in format MM YY"
            inputMode="numeric"
            placeholder={t("mmyy")}
            className="p-2 border-gray-500 border rounded w-full"
            role="textbox"
          />
          {errors.expiryDate && touchedFields.expiryDate && (
            <span className="text-sm text-red-600">{errors.expiryDate.message}</span>
          )}
        </div>

        <div className="inline-block my-4 w-1/3">
          <input
            {...register("cvc", {
              pattern: {
                value: /^\d{3,4}$/,
                message: t("plsEnterValidCvv"),
              },
              required: t("plsEnterValidCvv"),
            })}
            required
            autoComplete="cc-csc"
            type="password"
            aria-label="CVV Number"
            placeholder={t("cvv")}
            onKeyPress={isNumber}
            inputMode="numeric"
            maxLength={4}
            className="w-full p-2 border-gray-500 border rounded"
            role="textbox"
          />
          {errors.cvc && touchedFields.cvc && <span className="text-sm text-red-600">{errors.cvc.message}</span>}
        </div>
      </div>

      <WhatsappEnabeCheckbox />

      <button
        type="submit"
        disabled={!formState.isValid}
        className="mt-3 py-3 rounded font-bold uppercase w-full bg-ctaImg text-white _analytics-gtm-payment-info"
      >
        {t("pay")} {formatPrice(payableAmount, true, false)}
      </button>
    </form>
  );
};

export default DebitCardForm;
