import * as React from "react";
import PopupModal from "./PopupModal";

const FreeGiftStrip = ({ show, onRequestClose, id, type, openModal, t }: any) => (
  <PopupModal show={show} onRequestClose={() => onRequestClose(false)}>
    <section>
      <div
        aria-hidden
        className="flex justify-between items-center p-4 bg-black text-white text-base"
        onClick={() => {
          openModal(id, type);
        }}
      >
        <div className="flex">
          <img
            src="https://files.myglamm.com/site-images/original/giftwrap.png"
            alt="giftwrap"
            style={{ marginRight: "10px", width: "18px" }}
          />
          <strong>{t("congratulations")}</strong>
        </div>
        <div>
          <div className="offer-txt">
            <span>Select your</span>
            <br />
            <strong>Free makeup here</strong>
          </div>
        </div>
        <img
          src="https://files.myglamm.com/site-images/original/white-arrow.png"
          alt="whiteArrow"
          style={{ width: "16px", height: "24px" }}
        />
      </div>
    </section>
  </PopupModal>
);

export default FreeGiftStrip;
