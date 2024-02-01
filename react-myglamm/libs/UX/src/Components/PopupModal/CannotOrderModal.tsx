import React from "react";

import useTranslation from "@libHooks/useTranslation";

import PopupModal from "./PopupModal";

const CannotOrderModal = ({ CannotOrder, setCannotOrder, onRequestClose }: any) => {
  const { t } = useTranslation();

  return (
    <PopupModal
      show={CannotOrder}
      onRequestClose={() => {
        if (onRequestClose) {
          onRequestClose();
        } else {
          setCannotOrder(false);
        }
      }}
      type="center-modal"
    >
      <div className="bg-white p-4 pt-6 w-64 rounded-xl">
        <span>{t("maxOrderQuantitylimit")}</span>
        <div className="flex justify-end w-full">
          <button
            type="button"
            className="rounded p-2 mt-2 outline-none"
            onClick={() => {
              if (onRequestClose) {
                onRequestClose();
              } else {
                setCannotOrder(false);
              }
            }}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </PopupModal>
  );
};
export default CannotOrderModal;
