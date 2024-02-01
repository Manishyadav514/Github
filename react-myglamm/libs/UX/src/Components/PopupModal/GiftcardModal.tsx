import React, { useState, useEffect } from "react";

import useTranslation from "@libHooks/useTranslation";

import { GiCloseIco } from "@libComponents/GlammIcons";
import GiftCardForm from "@libComponents/Payments/GiftcardForm";
import GiftCardSuccess from "@libComponents/Payments/GiftCardSuccess";

import { GiftCardFormValues } from "@typesLib/Payment";

import PopupModal from "./PopupModal";

interface GCardModalProps {
  show: boolean;
  hide: () => void;
  removeGiftCard: (arg1: string) => void;
  addGiftCard: (arg1: GiftCardFormValues, arg2: number) => void;
  handleCreateOrder: (arg1: "cash") => void;
}

const GiftcardModal = ({ show, hide, addGiftCard, removeGiftCard, handleCreateOrder }: GCardModalProps) => {
  const { t } = useTranslation();

  const [showSuccesScreen, setShowSuccessScreen] = useState(false);

  useEffect(() => {
    if (!show) {
      setShowSuccessScreen(false);
    }
  }, [show]);

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className="px-4 py-6 relative rounded-t-md">
        <GiCloseIco
          height="25"
          width="25"
          fill="#000000"
          onClick={hide}
          className="absolute right-1 top-3"
          role="img"
          aria-labelledby="close modal"
        />

        <h4 className="font-semibold">{t("applyGiftCard") || "Apply Gift Card "}</h4>
        <p className="text-sm mb-2">{t("applyGiftCardSubtitle") || "You can apply max 5 gift cards."}</p>

        {showSuccesScreen ? (
          <GiftCardSuccess
            hide={hide}
            removeGiftCard={removeGiftCard}
            handleCreateOrder={handleCreateOrder}
            showGiftCardForm={() => setShowSuccessScreen(false)}
          />
        ) : (
          <GiftCardForm showSuccesScreen={() => setShowSuccessScreen(true)} addGiftCard={addGiftCard} />
        )}
      </section>
    </PopupModal>
  );
};

export default GiftcardModal;
