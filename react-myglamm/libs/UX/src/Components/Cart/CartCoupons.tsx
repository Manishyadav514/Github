import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { buildCongratsMessage, cartCustomRepsonseLayer, fetchRecommendedCoupons } from "@checkoutLib/Cart/HelperFunc";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { eventInfo } from "@typesLib/Cart";
import { ValtioStore } from "@typesLib/ValtioStore";
import Discount from "../../../public/svg/discount.svg";
import DeleteIcon from "../../../public/svg/dustbinIcon.svg";
import ArrowRight from "../../../public/svg/arrow-right.svg";
import { showError } from "@libUtils/showToaster";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { GA4promoCodeRemove } from "@libUtils/analytics/gtm";
import { useSplit } from "@libHooks/useSplit";
import dynamic from "next/dynamic";

const ApplyPromoCodeNewUI = dynamic(() => import("./ApplyPromoCodeNewUI"));
interface couponProps {
  showLoginModal: () => void;
  updateCheckout: (initiateLoader: boolean, eventInfo: eventInfo) => void;
  hasRecommendedCoupons: any[];
  bestCouponCode?: {
    couponCode: string;
    couponDescription: string;
    couponName: string;
    message: string;
  };
}

const CartCoupons = ({ showLoginModal, updateCheckout, hasRecommendedCoupons, bestCouponCode }: couponProps) => {
  const router = useRouter();

  const { instantDiscountCode, couponData } = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const userProfile = useSelector((store: ValtioStore) => store.userReducer.userProfile);
  const { autoApply, couponCode } = couponData;

  const variants = useSplit({
    experimentsList: [
      {
        id: "applyPromoCode",
        condition: !!(
          typeof userProfile !== null &&
          ((hasRecommendedCoupons?.length > 0 && bestCouponCode !== undefined) || autoApply)
        ),
      },
    ],
    deps: [userProfile, hasRecommendedCoupons, bestCouponCode, autoApply],
  });

  /* Hanlde Onclick of Apply PromoCode */
  const handleApplyPromo = () => {
    if (checkUserLoginStatus()) {
      return router.push("/apply-promocode");
    }
    return showLoginModal();
  };

  /* Handle Removal of Coupon for autoapply/instantDiscount and normal case */
  const removeCoupon = () => {
    SOURCE_STATE.previousCoupon = "";
    if (instantDiscountCode) {
      showError("You cannot avail other discounts with the Flash Sale products.");
    } else if (autoApply) {
      const ignoreCoupons = JSON.parse(getLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT) || "[]");
      setLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT, [...ignoreCoupons, couponCode], true);
    }

    removeLocalStorageValue(LOCALSTORAGE.COUPON);
    removeLocalStorageValue(LOCALSTORAGE.DISCOUNT_PRODUCT_ID);
    removeLocalStorageValue(LOCALSTORAGE.BEST_COUPON_AUTO_APPLIED);
    if (couponCode) GA4promoCodeRemove(couponCode);

    updateCheckout(true, "promocode remove");
  };

  if (variants?.applyPromoCode) {
    if (couponCode) {
      if (variants?.applyPromoCode === "1" && checkUserLoginStatus())
        return (
          <ApplyPromoCodeNewUI
            removeCoupon={removeCoupon}
            handleApplyPromo={handleApplyPromo}
            variant={variants.applyPromoCode}
            bestCouponCode={bestCouponCode}
          />
        );
      return <CouponAppliedOldUI removeCoupon={removeCoupon} />;
    } else if (variants?.applyPromoCode === "1" && checkUserLoginStatus() && bestCouponCode)
      return (
        <ApplyPromoCodeNewUI
          removeCoupon={removeCoupon}
          handleApplyPromo={handleApplyPromo}
          variant={variants.applyPromoCode}
          bestCouponCode={bestCouponCode}
        />
      );
    return <CouponNotAppliedOldUI handleApplyPromo={handleApplyPromo} />;
  }

  return null;
};

const CouponAppliedOldUI = ({ removeCoupon }: { removeCoupon: () => void }) => {
  const { t } = useTranslation();
  const { couponData } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  return (
    <div className="bg-white rounded p-3 mb-2 flex relative items-center">
      <Discount className="w-6 h-6 mr-4 ml-2" role="img" aria-labelledby="offer" />

      <div className="flex flex-col justify-around font-semibold">
        <p className="text-xs leading-relaxed">
          {couponData.couponCode} {t("applied")}
        </p>
        <p className="text-green-600 text-sm">{buildCongratsMessage(couponData, t)}</p>
      </div>

      <DeleteIcon onClick={removeCoupon} className="absolute right-3 top-3" role="img" aria-labelledby="remove" />
    </div>
  );
};

export const CouponNotAppliedOldUI = ({ handleApplyPromo }: { handleApplyPromo: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={handleApplyPromo}
        className="text-sm w-full bg-white py-4 px-3  flex items-center text-left"
      >
        <Discount className="w-6 h-6 mr-4 ml-2" role="img" aria-labelledby="offer" />
        <p className="w-11/12 text-sm">
          <strong>{t("applyPromoCode")}</strong>
          <ArrowRight className="float-right align-middle p-0.5" role="img" aria-labelledby="apply promo code" />
        </p>
      </button>
    </div>
  );
};

export default CartCoupons;
