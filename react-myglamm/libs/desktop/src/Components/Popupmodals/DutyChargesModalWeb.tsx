import React from "react";
import Router from "next/router";

import { DutyModalProps } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { updateCart } from "@libStore/actions/cartActions";
import { USER_REDUCER } from "@libStore/valtio/REDUX.store";

import { formatPrice } from "@libUtils/format/formatPrice";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { removeLocalStorageValue } from "@libUtils/localStorage";

import PopupModal from "@libComponents/PopupModal/PopupModal";

import CloseIcon from "../../../public/svg/ic_close.svg";

interface DutyPopupProps {
  show: boolean;
  hide: () => void;
  dutyData: DutyModalProps;
}

const DutyChargesModalWeb = ({ show, hide, dutyData }: DutyPopupProps) => {
  const { t } = useTranslation();

  const { rawCartData, cartData, shippingAddress } = dutyData;

  const { payableAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const DUTY_DIFFERENCE = cartData.payableAmount - payableAmount;

  const handleProceedToPay = () => {
    USER_REDUCER.shippingAddress = shippingAddress;
    updateCart(rawCartData);

    hide();

    Router.replace("/checkout");
  };

  const DUTY_SIGN = Math.sign(DUTY_DIFFERENCE);

  return (
    <PopupModal
      show={show}
      type="center-modal"
      onRequestClose={() => {
        hide();
        removeLocalStorageValue(SESSIONSTORAGE.CITY_ID);
      }}
    >
      <section className="relative bg-white rounded-md px-10 py-8 max-w-lg">
        <CloseIcon className="absolute right-4 top-4 cursor-pointer" onClick={hide} />

        <p className="font-bold text-xl">Additional Charges</p>
        <p className="text-sm text-gray-400 mb-4 w-3/4">Please review the updated payable amount for the selected address.</p>

        <p className="flex items-center justify-between mb-4">
          <span>{t("shoppinBagValue")}</span>
          <span>{formatPrice(payableAmount, true, false)}</span>
        </p>
        <p className="flex items-center justify-between mb-0.5">
          <span>Cross border Charges</span>
          <span className={DUTY_SIGN < 1 ? "text-green-600" : "text-red-500"}>
            {DUTY_SIGN === 1 ? "+" : "-"}&nbsp;
            {formatPrice(Math.abs(DUTY_DIFFERENCE), true, false)}
          </span>
        </p>
        <p className="text-xs text-gray-400 mb-4 w-3/5">
          {(() => {
            switch (DUTY_SIGN) {
              /* Additional Duty Applied */
              case 1:
                return `This includes custom fees and duties for shipping to ${shippingAddress.cityName}`;

              case -1:
                /* Additional Duty was Applied but now it's reduced */
                if (cartData?.totalDutyCharges) return "Amount revised as per the selected address.";
                /* Additional Duty was Applied but now it's completely removed */
                return "Not applicable for the selected address.";

              default:
                return "";
            }
          })()}
        </p>

        <p className="font-bold flex justify-between items-center">
          <span>{t("amountToPay")}</span>
          <span>{formatPrice(cartData.payableAmount, true, false)}</span>
        </p>

        <button
          type="button"
          onClick={handleProceedToPay}
          className="uppercase bg-ctaImg h-12 text-sm tracking-wide rounded w-full font-bold text-white"
        >
          {t("proceedToPay") || "Proceed to pay"}
        </button>
      </section>
    </PopupModal>
  );
};

export default DutyChargesModalWeb;
