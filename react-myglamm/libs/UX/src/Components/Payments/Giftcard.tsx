import React, { useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import dynamic from "next/dynamic";

import { useSnapshot } from "valtio";

import { GIFT_CARDS } from "@libStore/valtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useGiftCard } from "@checkoutLib/Payment/useGiftCard";

import { ValtioStore } from "@typesLib/ValtioStore";

import Cancel from "../../../public/svg/cancel.svg";
import { formatPrice } from "@libUtils/format/formatPrice";

const GiftcardModal = dynamic(() => import(/* webpackChunkName: "GiftCardModal" */ "@libComponents/PopupModal/GiftcardModal"), {
  ssr: false,
});

interface GiftCardProps {
  handleCreateOrder: (arg1: "cash") => void;
}

const Giftcard = ({ handleCreateOrder }: GiftCardProps) => {
  const { t } = useTranslation();

  const giftCards = useSnapshot(GIFT_CARDS).cards;

  const { addGiftCard, removeGiftCard } = useGiftCard();

  const { payableAmount, isPincodeServiceable, isUserWatchingOrderConfirmationScreen } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    isPincodeServiceable: store.cartReducer.cart.payableAmount,
    isUserWatchingOrderConfirmationScreen: store.paymentReducer.isUserWatchingOrderConfirmationScreen,
  }));
  const [showGiftcardModal, setShowGiftcardModal] = useState<boolean | undefined>();

  /* Disable Redeem if 5 giftcards applied or initHook(only in zeropayable screen this appears) not present */
  const DISABLE_REDEEM = giftCards.length === 5 || payableAmount === 0;

  const handleRemoveGiftCard = (e: Event, cardNumber: string) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to remove  Gift Card")) {
      return;
    }

    removeGiftCard(cardNumber);
  };

  if (!isUserWatchingOrderConfirmationScreen) {
    return (
      <section
        role="presentation"
        className={`rounded py-4 px-4 mb-2 w-full payShadow ${!isPincodeServiceable ? "pointer-events-none opacity-50" : ""}`}
        onClick={() => setShowGiftcardModal(!DISABLE_REDEEM)}
      >
        <div className="flex items-center text-sm">
          <img
            width={32}
            className="mr-4 ml-2"
            alt="GiftCard Logo"
            src="https://files.myglamm.com/site-images/original/giftcard.png"
          />
          Have a Gift Card ?
          <button
            disabled={DISABLE_REDEEM}
            className={`ml-auto uppercase font-semibold ${DISABLE_REDEEM ? "text-gray-400" : "text-color1"}`}
          >
            {t("redeem")}
          </button>
        </div>

        {/* Show Only the Used/Utilized giftscards from the applied ones */}
        {giftCards
          .filter(x => x.used)
          .map(giftcard => (
            <div key={giftcard.cardNumber} className="flex pl-14 mt-2 font-semibold justify-between items-center text-xs">
              <span>{giftcard.cardNumber}</span>
              <span className="text-green-600">Redeem {formatPrice(giftcard.used, true, false)}</span>
              <Cancel width="15" height="15" onClick={(e: any) => handleRemoveGiftCard(e, giftcard.cardNumber)} />
            </div>
          ))}

        {/* Show Warning Only in case all the 5 giftcards are utilized in current order */}
        {giftCards.length === 5 && !giftCards.find(x => !x.used) && (
          <span className="flex text-red-600 text-11 mt-2">{t("maxGiftCardWarning")}</span>
        )}

        {typeof showGiftcardModal === "boolean" && (
          <GiftcardModal
            show={showGiftcardModal}
            addGiftCard={addGiftCard}
            removeGiftCard={removeGiftCard}
            handleCreateOrder={handleCreateOrder}
            hide={() => setShowGiftcardModal(false)}
          />
        )}
      </section>
    );
  }

  return null;
};

export default Giftcard;
