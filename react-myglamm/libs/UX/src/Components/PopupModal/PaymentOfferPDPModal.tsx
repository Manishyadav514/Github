import React from "react";
import PopupModal from "./PopupModal";
import Close from "../../../public/svg/ic-close.svg";
import useTranslation from "@libHooks/useTranslation";

const PaymentOfferPDPModal = ({ activeOffer, show, onRequestClose }: any) => {
  const { t } = useTranslation();
  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <div className="bg-white w-full rounded-t-3xl p-4">
        <span className="flex items-center justify-between pb-3 ">
          <p> {t("offerDetailsTitle") || "Offer Details"} </p>
          <button onClick={onRequestClose}>
            <Close />
          </button>
        </span>
        <div className="border border-color1 rounded-3">
          <div className="flex items-center bg-color2 px-3 py-2">
            <img src={activeOffer?.imageURL} alt={activeOffer?.title} className="bg-white w-11 h-11" />
            <div className="ml-3">
              <div className="text-sm overflow-hidden line-clamp-1">{activeOffer?.title}</div>
              <div className="font-bold text-sm  overflow-hidden line-clamp-1">{activeOffer?.subTitle}</div>
            </div>
          </div>
          <div className="bg-white m-3 text-sm overflow-hidden">{activeOffer?.description}</div>
        </div>
      </div>
    </PopupModal>
  );
};

export default PaymentOfferPDPModal;
