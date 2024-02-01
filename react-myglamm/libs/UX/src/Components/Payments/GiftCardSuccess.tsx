import React, { useRef, Fragment } from "react";

import { useSnapshot } from "valtio";
import { useSelector } from "@libHooks/useValtioSelector";

import { GIFT_CARDS } from "@libStore/valtioStore";

import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";

import Cancel from "../../../public/svg/cancel.svg";
import { formatPrice } from "@libUtils/format/formatPrice";

interface SuccessProps {
  hide: () => void;
  showGiftCardForm: () => void;
  removeGiftCard: (cardNumber: string) => void;
  handleCreateOrder: (arg1: "cash") => void;
}

const GiftCardSuccess = ({ hide, showGiftCardForm, removeGiftCard, handleCreateOrder }: SuccessProps) => {
  const { t } = useTranslation();

  const giftcards = useSnapshot(GIFT_CARDS).cards;
  const latestCard = useRef(giftcards[giftcards.length - 1]);

  const { payableAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const handleRemoveGiftCard = (cardNumber: string) => {
    if (!confirm("Are you sure you want to remove  Gift Card")) {
      return;
    }

    removeGiftCard(cardNumber);

    if (giftcards.length === 1) hide();
  };

  return (
    <Fragment>
      {giftcards
        .filter(x => x.used)
        .map(giftcard => (
          <div className="font-semibold flex justify-between items-center mb-2 text-xs" key={giftcard.cardNumber}>
            <span> {t("giftCardApplied")}</span>
            <span>{giftcard.cardNumber}</span>
            <span className="text-green-600">Redeem {formatPrice(giftcard.used, true, false)}</span>
            <Cancel
              width="15"
              height="15"
              className="flex justify-center items-center"
              onClick={() => handleRemoveGiftCard(giftcard.cardNumber)}
            />
          </div>
        ))}

      <div className="relative">
        <img src="https://files.myglamm.com/site-images/original/giftcardbackground.png" className="w-full" />
        <img className="absolute m-auto inset-0" src="https://files.myglamm.com/site-images/original/success.png" />
      </div>

      <span className="text-center text-lg mb-2 font-bold flex mx-auto justify-center">{t("giftCardAppliedSuceessfully")}</span>
      <p className="mb-2 text-center text-sm font-semibold text-green-600">
        Redeemed {formatPrice(latestCard.current.used, true, false)}
      </p>

      <p className="mb-2 text-center text-xs">
        {t("giftCardNumber") || "Gift Card Number"}&nbsp;{latestCard.current.cardNumber}
      </p>

      {giftcards?.length === 5 && (
        <span className="block text-sm text-center text-red-600 mb-2">{t("maxGiftCardWarning")}</span>
      )}

      {payableAmount === 0 && (
        <span style={{ color: "#ffac36" }} className="block text-sm  mb-2 font-bold text-center px-2">
          Gift Card Balance {formatPrice(latestCard.current.balance - latestCard.current.used, true, false)}
        </span>
      )}

      {payableAmount > 0 && (
        <Fragment>
          <button
            type="button"
            onClick={showGiftCardForm}
            disabled={giftcards.length === 5}
            className="mt-4 py-3 my-2 text-sm rounded font-bold capitalize w-full text-white bg-ctaImg"
          >
            {t("haveAnotherGiftCard") || "Have another Gift Card"}
          </button>
          <p className="bg-black text-center m-4" style={{ height: "1px" }}>
            <span className="p-2 text-sm relative bg-white mx-auto capitalize font-semibold -top-3">{t("or")}</span>
          </p>

          <button
            type="button"
            onClick={hide}
            className="py-3 my-2 text-sm rounded font-semibold capitalize w-full bg-ctaImg text-white"
          >
            Pay {formatPrice(payableAmount, true, false)} by Using Other Payment Mode
          </button>
        </Fragment>
      )}

      {payableAmount === 0 && (
        <button
          type="button"
          onClick={() => handleCreateOrder("cash")}
          className="py-3 uppercase text-sm rounded font-bold w-full bg-ctaImg text-white _analytics-gtm-payment-info"
        >
          {t("placeOrder")}
        </button>
      )}
    </Fragment>
  );
};

export default GiftCardSuccess;
