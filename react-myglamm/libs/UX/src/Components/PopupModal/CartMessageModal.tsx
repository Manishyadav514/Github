import React from "react";

import PopupModal from "./PopupModal";

interface cartMsgProps {
  show: boolean;
  hide: () => void;
  modalTexts: {
    title: string;
    message: string;
    buttonLabel: string;
  };
}

const CartMessageModal = ({ show, hide, modalTexts }: cartMsgProps) => {
  const { title, message, buttonLabel } = modalTexts || {};

  return (
    <PopupModal show={show} onRequestClose={() => console.log("Clicked Outside")}>
      <section className="p-3">
        <h2 className="flex item-center justify-center font-semibold text-lg">{title}</h2>
        <div className="py-3 text-center">{message}</div>
        <div className="flex item-center justify-center">
          <button type="button" onClick={hide} className="bg-black text-white w-full py-2 rounded uppercase">
            {buttonLabel}
          </button>
        </div>
      </section>
    </PopupModal>
  );
};

export default CartMessageModal;
