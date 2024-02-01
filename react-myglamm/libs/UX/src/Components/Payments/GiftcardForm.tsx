import React, { useState, ChangeEvent } from "react";

import { useForm } from "react-hook-form";

import PaymentAPI from "@libAPI/apis/PaymentAPI";

import { isNumber } from "@libUtils/validation";
import { getLocalStorageValue } from "@libUtils/localStorage";

import useTranslation from "@libHooks/useTranslation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { GiftCard, GiftCardFormValues } from "@typesLib/Payment";

import { formatCardNumber } from "@checkoutLib/Payment/giftCardUtils";

interface GiftCardFormProps {
  showSuccesScreen: () => void;
  addGiftCard: (arg1: GiftCardFormValues, arg2: number) => void;
}

const GiftCardForm = ({ showSuccesScreen, addGiftCard }: GiftCardFormProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const { register, formState, handleSubmit, setError, setValue, trigger, clearErrors } = useForm({
    defaultValues: {
      cardNumber: "",
      cardPin: "",
    },
    mode: "onChange",
    shouldFocusError: true,
  });

  const { errors, touchedFields } = formState;

  const handleOnChangeCard = (e: ChangeEvent<HTMLInputElement>) => {
    clearErrors();
    setValue("cardNumber", formatCardNumber(e.target.value));
    trigger("cardNumber");
  };

  const handleOnChangePin = (e: ChangeEvent<HTMLInputElement>) => {
    clearErrors();
    let cardPinNumber: any = e.target.value;
    cardPinNumber = cardPinNumber.match(/^\d{1,6}/g);
    setValue("cardPin", cardPinNumber);
    trigger("cardPin");
  };

  /**
   * Submit Gift Card and Validate it, as well as check the balance left and
   * process it further
   */
  const submitGiftCard = (value: GiftCardFormValues) => {
    value.cardNumber = value.cardNumber.replace(/\s/g, "");

    const giftCards: Array<GiftCard> = getLocalStorageValue(LOCALSTORAGE.GIFT_CARDS, true)?.cards;

    /* Check if the User had already redeemed giftcard it or not */
    if (giftCards?.find(x => x.cardNumber === value.cardNumber)) {
      setError("cardNumber", { type: "alreadyUsed", message: t("cardAlreadyUsed") });
    } else {
      setLoading(true);
      const paymentApi = new PaymentAPI();
      paymentApi
        .giftCardBalance(value)
        .then(({ data: giftcard }) => {
          if (giftcard.code === 200 && giftcard.data.amount) {
            addGiftCard(value, giftcard.data.amount);
            showSuccesScreen();
          } else {
            setError("cardNumber", { type: "alreadyUsed", message: t("cardAlreadyUsed") });
          }
        })
        .catch(err => setError("cardNumber", { type: "inValid", message: err.response?.data?.message || "" }))
        .finally(() => setLoading(false));
    }
  };

  const disableButton = formState.isSubmitting || !formState.isValid || loading;

  return (
    <form className="mt-4 w-full" onSubmit={handleSubmit(submitGiftCard)}>
      <div className="relative mb-4">
        <span className="text-xs ml-2 absolute font-bold -top-2 px-1 left-0.5 bg-white">{t("giftCardNumberHint")}</span>
        <input
          {...register("cardNumber", {
            required: true,
            minLength: { message: "Minimum 16 Digits Gift Card Number", value: 19 },
          })}
          type="text"
          maxLength={19}
          onKeyPress={isNumber}
          aria-label="Card Number"
          onChange={handleOnChangeCard}
          className="h-12 border border-black rounded-sm w-full mb-1  outline-none px-4 font-semibold tracking-widest"
          role="textbox"
        />
        {errors.cardNumber && touchedFields.cardNumber && (
          <span className="block text-xs text-red-600">{errors.cardNumber.message}</span>
        )}
      </div>

      <div className="relative mb-4">
        <span className="text-xs ml-2 absolute font-bold -top-2 px-1 left-0.5 bg-white">{t("giftCardPinHint")}</span>
        <input
          {...register("cardPin", {
            // pattern: {
            //   value: /^\d{1,6}$/,
            //   message: "Please Enter Card Pin",
            // },
            required: true,
            maxLength: 6,
            minLength: 6,
          })}
          required
          maxLength={6}
          type="password"
          inputMode="numeric"
          aria-label="Card Pin"
          onKeyPress={isNumber}
          onChange={handleOnChangePin}
          className="h-12 border border-black rounded-sm w-full mb-1  outline-none px-4 font-semibold tracking-widest"
          role="textbox"
        />
        {errors.cardPin && touchedFields.cardPin && (
          <span className="block text-xs text-red-600">{errors.cardPin.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={disableButton}
        className="mt-2 h-12 rounded font-semibold uppercase w-full text-white bg-ctaImg _analytics-gtm-payment-info"
      >
        {loading ? <LoadSpinner className="relative w-6 mx-auto" /> : t("redeem")}
      </button>
    </form>
  );
};

export default GiftCardForm;
