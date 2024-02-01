import React from "react";
import PopupModal from "./PopupModal";
import dynamic from "next/dynamic";
import useTranslation from "@libHooks/useTranslation";

const GiftCardTermsAndConditions = dynamic(() => import(/* gift card terms and condition  */ "../GiftCardTerms&Condtions"));

const GiftCardDetails = ({
  show,
  onClose,
  selectedProduct,
  handleAddToBag,
  minBillAmount,
  hideAddToBagCta = false,
}: {
  show: boolean;
  onClose: () => void;
  selectedProduct?: any;
  handleAddToBag?: (product: any) => void;
  minBillAmount?: number;
  hideAddToBagCta?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <PopupModal show={show} onRequestClose={onClose} additionClass="p-3 bg-white rounded-t-lg">
      <GiftCardTermsAndConditions minBillAmount={minBillAmount} />
      {!hideAddToBagCta && (
        <button
          type="button"
          className="mt-4 flex justify-center items-center bg-ctaImg capitalize text-sm text-white font-semibold w-full py-4 rounded-sm outline-none relative"
          onClick={() => {
            handleAddToBag && handleAddToBag(selectedProduct);
            onClose();
          }}
        >
          {t("addToBag")}
        </button>
      )}
    </PopupModal>
  );
};

export default GiftCardDetails;
