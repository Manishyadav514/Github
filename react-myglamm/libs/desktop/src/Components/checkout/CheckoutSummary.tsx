import React, { useEffect, useState } from "react";
import Router from "next/router";

import CartAPI from "@libAPI/apis/CartAPI";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getLocalStorageValue } from "@libUtils/localStorage";

import { useCreateOrder } from "@checkoutLib/Payment/useCreateOrder";

import CheckoutApplyCoupon from "./CheckoutApplyCoupon";

const CheckoutSummary = () => {
  const { t } = useTranslation();

  const { cart } = useSelector((store: ValtioStore) => store.cartReducer);
  const { isPincodeServiceable } = useSelector((store: ValtioStore) => store.userReducer);

  const [loader, setLoader] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const { handleCreateOrder } = useCreateOrder();

  const handleProceedToPay = async () => {
    setLoader(true);

    if (cart.payableAmount === 0) {
      // exception case of zero order value
      try {
        await handleCreateOrder("cash");
      } catch {
        setLoader(false);
      }
    } else {
      Router.push("/payment");
    }
  };

  useEffect(() => {
    if (SHOP.IS_MYGLAMM && getLocalStorageValue(LOCALSTORAGE.MEMBER_ID)) {
      const cartApi = new CartAPI();
      cartApi
        .getCommission(getLocalStorageValue(LOCALSTORAGE.MEMBER_ID), cart.payableAmount * 100 - cart.tax)
        .then(({ data }) => setEarnedPoints(data.data.commissionEarnings));
    }
  }, [cart.payableAmount]);

  return (
    <section className="bg-themeGray w-2/5 p-5 rounded-md h-max">
      <p className="text-22 capitalize mb-2.5">{t("orderSummary")}</p>
      <ul className="list-none">
        <li className="flex py-2 items-center justify-between">
          <span>{t("subTotal") || "MRP"}</span>
          <span className="text-sm">{formatPrice(cart.grossAmount, true, false)}</span>
        </li>

        <li className="flex py-2 items-center justify-between">
          <span>{t("additionalDiscount")}</span>
          <span className="text-sm">- {formatPrice(cart.additionalDiscount, true, false)}</span>
        </li>

        <li className="py-3">
          <CheckoutApplyCoupon />
        </li>

        {cart.couponData?.couponCode && (
          <li className="flex py-2 items-center justify-between">
            <p>
              {t("discount")}&nbsp;<span className="uppercase text-xs">{cart.couponData.couponCode}</span>
            </p>
            <span className="text-sm">(- {formatPrice(cart.couponData.userDiscount as number, true, false)})</span>
          </li>
        )}

        <li className="flex py-2 items-center justify-between">
          <span>{t("shippingCharges")}</span>
          <span className="text-sm uppercase">
            {cart.shippingCharges ? formatPrice(cart.shippingCharges, true, false) : t("free")}
          </span>
        </li>

        {(cart.shippingChargesDiscount as number) > 0 && (
          <li className="py-2">
            <div className="mb flex items-center justify-between">
              <span>{t("shippingChargesAfterDiscount") || "Shipping charges Discount"}</span>
              <span className="text-sm">{`(- ${formatPrice(cart?.shippingChargesDiscount as number, true)})`}</span>
            </div>

            {cart.shippingChargesAfterDiscount === 0 && (
              <p className="text-xs opacity-50 mt-1">
                {t("availedFreeShipping") || "You have availed FREE shipping on this order."}
              </p>
            )}
          </li>
        )}

        <li className="flex pt-6 pb-3 font-bold items-center justify-between">
          <span>{t("amountPayable")}</span>
          <span className="text-xl uppercase">{formatPrice(cart.payableAmount, true, false)}</span>
        </li>

        <li className="flex py-2 items-center justify-between">
          <span>{t("youSaved") || "You Saved"}</span>
          <span className="text-sm">
            {formatPrice((cart.couponData.userDiscount || 0) + (cart.appliedGlammPoints || 0), true, false)}
          </span>
        </li>

        {earnedPoints > 0 && (
          <li className="flex py-2 items-center justify-between">
            <span>{t("youEarn")}</span>
            <span className="text-sm">{formatPrice(earnedPoints)}</span>
          </li>
        )}
      </ul>
      <button
        type="button"
        onClick={handleProceedToPay}
        disabled={!isPincodeServiceable || loader}
        className="bg-ctaImg h-12 text-white font-bold tracking-wide uppercase w-full rounded-sm relative mt-2"
      >
        {loader && <LoadSpinner className="inset-0 absolute m-auto w-10" />}
        {t("proceedPayment")}
      </button>
    </section>
  );
};

export default CheckoutSummary;
