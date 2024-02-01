import React, { useState } from "react";

import CartAPI from "@libAPI/apis/CartAPI";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { cartCustomRepsonseLayer, fetchAndUpdatedCart } from "@checkoutLib/Cart/HelperFunc";
import { analyticsPrmoCode, promoCodeFailedAdobeEvent } from "@checkoutLib/Cart/Analytics";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { updateCart } from "@libStore/actions/cartActions";

import { showError } from "@libUtils/showToaster";
import { GAOfferAppliedFailed } from "@libUtils/analytics/gtm";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { ValtioStore } from "@typesLib/ValtioStore";

import DiscountIcon from "../../../public/svg/discount.svg";

const CheckoutApplyCoupon = () => {
  const { t } = useTranslation();

  const { cart } = useSelector((store: ValtioStore) => store.cartReducer);
  const { shippingAddress } = useSelector((store: ValtioStore) => store.userReducer);

  const [loader, setLoader] = useState(false);
  const [couponCode, setCouponCode] = useState(cart.couponData.couponCode || "");

  const applyCoupon = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cart.couponData?.couponCode === couponCode) return; // early return for same coupon hit

    const couponStr = couponCode.toUpperCase();

    if (couponStr.length) {
      setLoader(true);
      const glammpoints = getLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS);

      const cartApi = new CartAPI();
      cartApi
        .updateCart(couponStr, glammpoints, shippingAddress?.zipcode, true)
        .then(({ data: res }) => {
          updateCart(res);
          analyticsPrmoCode(cartCustomRepsonseLayer(res.data));
          setLocalStorageValue(LOCALSTORAGE.COUPON, couponStr);

          setLoader(false);
        })
        .catch(err => {
          const message = err.response?.data?.message || err;
          setLoader(false);
          setCouponCode("");
          showError(message);
          promoCodeFailedAdobeEvent(message, couponStr);
          GAOfferAppliedFailed(cart, message, couponStr);

          removeLocalStorageValue(LOCALSTORAGE.COUPON);
          removeLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS);

          fetchAndUpdatedCart();
        });
    } else {
      alert(t("plsEnterPromoCode"));
    }
  };

  return (
    <>
      <p className="pb-2.5 font-bold">{t("applyPromoCode")}</p>

      <form className="relative w-full flex" onSubmit={applyCoupon}>
        <DiscountIcon className="absolute inset-y-0 my-auto left-5" />
        <input
          type="text"
          spellCheck="false"
          autoComplete="false"
          autoCapitalize="true"
          placeholder={t("promoCode") || "PROMO CODE"}
          onChange={e => setCouponCode(e.target.value)}
          value={couponCode || cart.couponData?.couponCode || ""}
          className="uppercase bg-white rounded-l border border-gray-300 h-16 flex-grow pl-14 tracking-wide"
        />
        <button
          type="submit"
          disabled={loader}
          style={{ width: "28%" }}
          className="bg-ctaImg h-16 relative rounded-r text-white font-bold"
        >
          {loader && <LoadSpinner className="w-10 inset-0 m-auto absolute" />}
          {t("apply")}
        </button>
      </form>
    </>
  );
};

export default CheckoutApplyCoupon;
