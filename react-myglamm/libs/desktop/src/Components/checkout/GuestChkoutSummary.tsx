import React, { useState } from "react";
import Router from "next/router";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { formatPrice } from "@libUtils/format/formatPrice";

import { ValtioStore } from "@typesLib/ValtioStore";

import { SHOP } from "@libConstants/SHOP.constant";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { fetchAndUpdatedCart } from "@checkoutLib/Cart/HelperFunc";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import CheckoutApplyCoupon from "./CheckoutApplyCoupon";

const GuestChkoutSummary = () => {
  const { t } = useTranslation();

  const { netAmount, shippingCharges, couponData, payableAmount, allowIntShipping } = useSelector(
    (store: ValtioStore) => store.cartReducer.cart
  );

  const [loader, setLoader] = useState(false);

  const handleProceedToPay = async () => {
    setLoader(true);
    if (SHOP.REGION === "MIDDLE_EAST" || SHOP.ENABLE_GUEST_CHECKOUT || allowIntShipping) {
      Router.push("/add-shipping-address");
    } else if (!checkUserLoginStatus()) {
      SHOW_LOGIN_MODAL({ show: true, onSuccess: fetchAndUpdatedCart });
      setLoader(false);
    }
  };

  return (
    <section className="bg-themeGray w-2/5 p-5 rounded-md h-max">
      <CheckoutApplyCoupon />

      <p className="text-xl capitalize mt-5 mb-3 font-bold">{t("orderSummary")}</p>

      <ul className="list-none pb-8">
        <li className="flex py-2 items-center justify-between">
          <span>{t("actualAmount")}</span>
          <span className="text-sm">{formatPrice(netAmount, true, false)}</span>
        </li>

        <li className="flex py-2 items-center justify-between">
          <span>{t("shippingCharges")}</span>
          <span className="text-sm uppercase">{shippingCharges ? formatPrice(shippingCharges, true, false) : t("free")}</span>
        </li>

        {couponData?.couponCode && (
          <li className="flex py-2 items-center justify-between">
            <p>
              {t("discount")}&nbsp;<span className="uppercase text-xs">{couponData.couponCode}</span>
            </p>
            <span className="text-sm">(- {formatPrice(couponData.userDiscount as number, true, false)})</span>
          </li>
        )}
      </ul>

      <div className="flex items-center justify-between pb-8">
        <div className="flex flex-col leading-tight">
          <strong>{t("amountPay")}</strong>
          <span className="text-color1 text-sm">{t("noteInclusiveTaxes") || "Note: Inclusive of all taxes"}</span>
        </div>

        <strong className="text-xl">{formatPrice(payableAmount, true, false)}</strong>
      </div>

      <button
        type="button"
        disabled={loader}
        onClick={handleProceedToPay}
        className="bg-ctaImg h-12 text-white font-bold tracking-wide uppercase w-full rounded-sm relative mt-2"
      >
        {loader && <LoadSpinner className="inset-0 absolute m-auto w-10" />}
        {t("proceedPayment")}
      </button>
    </section>
  );
};

export default GuestChkoutSummary;
