import React, { useEffect, useState } from "react";
import { analyticsPrmoCode, promoCodeFailedAdobeEvent } from "@checkoutLib/Cart/Analytics";
import { buildCongratsMessage, cartCustomRepsonseLayer, fetchRecommendedCoupons } from "@checkoutLib/Cart/HelperFunc";
import CartAPI from "@libAPI/apis/CartAPI";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { updateCart, updateCartLoader } from "@libStore/actions/cartActions";
import { GAOfferAppliedFailed } from "@libUtils/analytics/gtm";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { showError } from "@libUtils/showToaster";
import { ValtioStore } from "@typesLib/ValtioStore";
import Discount from "../../../public/svg/discount.svg";
import { formatPrice } from "@libUtils/format/formatPrice";
import OfferAppliedIcon from "../../../public/svg/green-tick.svg";

const ApplyPromoCodeNewUI = ({
  removeCoupon,
  handleApplyPromo,
  variant,
  bestCouponCode,
}: {
  removeCoupon: () => void;
  handleApplyPromo: () => void;
  variant: string;
  bestCouponCode?: {
    couponCode: string;
    couponDescription: string;
    couponName: string;
    message: string;
  };
}) => {
  const { t } = useTranslation();

  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const handleCoupon = (event: any, recommendCoupon?: string) => {
    event.preventDefault();

    updateCartLoader(true);

    const couponStr = recommendCoupon?.toUpperCase();

    if (couponStr?.length) {
      const glammpoints = getLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS);

      const cartApi = new CartAPI();
      cartApi
        .updateCart(couponStr, glammpoints, undefined)
        .then(({ data: res }) => {
          updateCart(res);
          analyticsPrmoCode(cartCustomRepsonseLayer(res.data));
          setLocalStorageValue(LOCALSTORAGE.COUPON, couponStr);

          updateCartLoader(false);
        })
        .catch(err => {
          updateCartLoader(false);
          showError(err.response?.data?.message, 3000);
          promoCodeFailedAdobeEvent(err.response?.data?.message, couponStr);
          GAOfferAppliedFailed(cart, err.response?.data?.message, couponStr);
          console.log(err.response);
        });
    }
  };

  return (
    <div className="bg-white mb-2">
      <div className="flex items-center justify-between bg-white p-2 border-dashed border-b-2 ">
        <div className=" rounded flex relative items-center">
          {cart?.couponData?.couponCode ? (
            <OfferAppliedIcon className="w-6 h-6 mr-4 ml-2" role="img" aria-labelledby="offer" />
          ) : (
            <Discount className="w-6 h-6 mr-4 ml-2" role="img" aria-labelledby="offer" />
          )}

          <div className="">
            <p className="text-green-600 text-sm leading-tight mb-2 font-bold">
              {cart?.couponData?.couponCode ? buildCongratsMessage(cart.couponData, t) : bestCouponCode?.message}
            </p>
            <p className="text-xs leading-relaxed">
              {t("code") || "Code"}:{" "}
              {cart?.couponData?.couponCode
                ? `${cart?.couponData?.couponCode} ${t("applied")}`
                : cart.couponData.couponCode || bestCouponCode?.couponCode}
            </p>
          </div>
        </div>

        <button
          onClick={e => {
            if (variant === "1" && cart.couponData.couponCode) {
              removeCoupon();
            } else {
              handleCoupon(e, bestCouponCode?.couponCode);
            }
          }}
          className="border border-black  font-semibold rounded bg-white uppercase px-4 py-1  my-2 text-sm text-right text-black mr-2"
        >
          {variant === "1" && cart.couponData.couponCode ? t("remove") : t("apply")}
        </button>
      </div>
      <p onClick={handleApplyPromo} className="p-1 py-2 text-sm text-right text-color1 mr-2">
        {t("viewMoreCoupons") || "View More Coupons"}
      </p>
    </div>
  );
};

export default ApplyPromoCodeNewUI;
