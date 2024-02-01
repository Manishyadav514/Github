import React from "react";
import Router from "next/router";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";
import { DutyModalProps } from "@typesLib/Payment";

import { formatPrice } from "@libUtils/format/formatPrice";

import { updateCart } from "@libStore/actions/cartActions";
import { USER_REDUCER } from "@libStore/valtio/REDUX.store";

import PopupModal from "./PopupModal";

import CloseIcon from "../../../public/svg/ic-close.svg";

interface DutyPopupProps {
  show: boolean;
  hide: () => void;
  dutyData: DutyModalProps;
}

const DutyChargesModal = ({ show, hide, dutyData }: DutyPopupProps) => {
  const { t } = useTranslation();

  const { rawCartData, cartData, shippingAddress } = dutyData;

  const { payableAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const DUTY_DIFFERENCE = cartData.payableAmount - payableAmount;

  const handleProceedToPay = () => {
    USER_REDUCER.shippingAddress = shippingAddress;
    updateCart(rawCartData);

    hide();

    Router.replace("/payment");
  };

  const DUTY_SIGN = Math.sign(DUTY_DIFFERENCE);

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className="px-4 py-7 relative rounded-t-2xl">
        <CloseIcon className="absolute right-4 top-4" onClick={hide} />

        <p className="font-bold">
          {DUTY_SIGN === 1 ? t("additionalCharges") || "Additional charges" : t("amountRevised") || "Amount Revised"}
        </p>
        <p className="text-xs text-gray-400 mb-4 w-4/5">
          {t("additionalChargesInfo") || "Please review the updated payable amount for the selected address."}
        </p>

        <p className="flex items-center justify-between text-sm mb-4">
          <span>{t("shoppinBagValue")}</span>
          <span>{formatPrice(payableAmount, true, false)}</span>
        </p>
        <p className="flex items-center justify-between text-sm mb-0.5">
          <span>{t("crossBorderCharges") || "Cross border Charges"}</span>
          <span className={DUTY_SIGN < 1 ? "text-green-600" : "text-red-500"}>
            {DUTY_SIGN === 1 ? "+" : "-"}&nbsp;
            {formatPrice(Math.abs(DUTY_DIFFERENCE), true, false)}
          </span>
        </p>
        <p className="text-xs text-gray-400 mb-4 w-3/5">
          {(() => {
            const { additonalDutyApplied, dutyReduced, dutyRemoved } = t("crossBorderMsgs") || {};

            switch (DUTY_SIGN) {
              /* Additional Duty Applied */
              case 1:
                return (
                  additonalDutyApplied || `This includes custom fees and duties for shipping to ${shippingAddress.cityName}`
                );

              case -1:
                /* Additional Duty was Applied but now it's reduced */
                if (cartData.totalDutyCharges) return dutyReduced || "Amount revised as per the selected address.";
                /* Additional Duty was Applied but now it's completely removed */
                return dutyRemoved || "Not applicable for the selected address.";

              default:
                return "";
            }
          })()}
        </p>

        <p className="font-bold text-sm flex justify-between items-center">
          <span>{t("amountToPay")}</span>
          <span>{formatPrice(cartData.payableAmount, true, false)}</span>
        </p>
      </section>

      <div className="p-2 bg-white border-t">
        <button
          type="button"
          onClick={handleProceedToPay}
          className="uppercase bg-ctaImg h-11 text-sm tracking-wide rounded-sm w-full font-bold text-white"
        >
          {t("proceedToPay") || "Proceed to pay"}
        </button>
      </div>
    </PopupModal>
  );
};

export default DutyChargesModal;
