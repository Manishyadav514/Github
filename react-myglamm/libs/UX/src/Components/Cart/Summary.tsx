import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { SHOP } from "@libConstants/SHOP.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import { setLocalStorageValue } from "@libUtils/localStorage";
import { formatPrice } from "@libUtils/format/formatPrice";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { cartProduct } from "@typesLib/Cart";

const Summary = () => {
  const { t } = useTranslation();
  const {
    couponData,
    shippingCharges,
    appliedGlammPoints,
    additionalDiscount,
    grossAmount,
    payableAmount,
    freeShippingThreshold,
    isShippingChargeCashBack,
    shippings,
    virtualProductSubscriptionAmount,
    subscriptionDiscountValue,
    subscriptionDetails,
    shippingChargesAfterDiscount,
    shippingChargesDiscount,
    cartShippingCharges,
    applicableSubscriptionDetails,
    isGiftCardSku,
    miscellaneousProducts,
  } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const { youHaveAvailedFreeShipping, additionalInfo } = t("shipping") || {};

  const [showShippingPopup, setShowShippingPopup] = useState(false);
  const [glammClubMembershipProduct, setGlammClubMembershipProduct] = useState<cartProduct>();

  useEffect(() => {
    if (isShippingChargeCashBack) {
      setLocalStorageValue("isShippingChargeCashBack", isShippingChargeCashBack, true);
    }
  }, [isShippingChargeCashBack]);

  const displayShippingCharges = () => {
    if (!FEATURES.hideShippingChargesOnPayment) {
      return <p className="text-green-600">{t("calculatedOnNextStep") || "Calculated on next step"}</p>;
    } else if (cartShippingCharges === 0) {
      return (
        <div className="flex">
          <del className="text-gray-400 mr-2 h-min">{formatPrice(shippings?.[0]?.shippingCharges, true, false)}</del>
          <span className="uppercase text-green-600">{t("free")}</span>
        </div>
      );
    } else {
      return <div className="w-1/2 text-right">{cartShippingCharges && formatPrice(cartShippingCharges, true, false)}</div>;
    }
  };

  useEffect(() => {
    if (miscellaneousProducts && miscellaneousProducts.length > 0) {
      const memberShipProduct = miscellaneousProducts.find(miscProduct => miscProduct?.moduleName === 1);
      memberShipProduct ? setGlammClubMembershipProduct(memberShipProduct) : setGlammClubMembershipProduct(undefined);
    }
  }, [miscellaneousProducts]);
  return (
    <div className="py-3 mb-2 bg-white text-sm rounded text-gray-700">
      <h3 className="pt-2 px-5 mb-3 font-semibold">{t("orderSummary")}</h3>
      <div className="flex px-5 mb-3">
        <div className="w-1/2">{t("subtotal")}</div>
        <div className="w-1/2 text-right">{formatPrice(grossAmount, true, false)}</div>
      </div>
      {/* SUBSCRIPTION CHARGES SUMMARY - [logged in user is not subscribed] If product is in cart currently*/}
      {!!virtualProductSubscriptionAmount && virtualProductSubscriptionAmount > 0 && !isGiftCardSku && (
        <div className="flex px-5 mb-3">
          <div className="w-1/2">
            {t("glammPlusSubscriptionText") || "Subscription of"}&nbsp;
            {formatPrice(virtualProductSubscriptionAmount, true, true)}
          </div>
          <div className="w-1/2 text-right">+{formatPrice(virtualProductSubscriptionAmount, true, true)}</div>
        </div>
      )}

      {additionalDiscount !== undefined && additionalDiscount > 0 && (
        <div className="flex px-5 mb-3">
          <div className="w-1/2">{t("additionalDiscount") || "Additional Discount"}</div>
          <div className="w-1/2 text-right text-green-600">- {formatPrice(additionalDiscount, true, false)}</div>
        </div>
      )}
      {/* GLAMMPOINTS SUMMARY */}
      {/* {appliedGlammPoints !== undefined && appliedGlammPoints > 0 && (
        <div className="flex px-5 mb-3">
          <div className="w-1/2">{t("redeemGlammPoints")}</div>
          <div className="w-1/2 text-right font-semibold text-green-600 opacity-80">- {Math.round(appliedGlammPoints)}</div>
        </div>
      )} */}
      {/* COUPON SUMMARY */}
      {couponData?.couponCode && (
        <div className="flex px-5 mb-3 justify-between">
          <div>
            {t("promoCodeApplied")}&nbsp;&quot;{couponData.couponCode}&quot;
          </div>
          <div className="text-right text-green-600">-{formatPrice(couponData.userDiscount as number, true, false)}</div>
        </div>
      )}
      {/* SUBSCRIPTION DISCOUNT SUMMARY - If logged in user is already subscribed will display as additional discount */}
      {subscriptionDiscountValue !== undefined &&
        subscriptionDiscountValue > 0 &&
        Object.keys(subscriptionDetails || {}).length > 0 &&
        (subscriptionDetails?.offerType === "NEXT_ORDER_DISCOUNT" ||
          subscriptionDetails?.offerType === "SAME_AND_NEXT_ORDER_DISCOUNT") && (
          <div className="flex px-5 mb-3">
            <div className="w-1/2">{t("glammPlusSubscriptionDiscount") || "Additional Discount"}</div>
            <div className="w-1/2 text-right text-green-600">- {formatPrice(subscriptionDiscountValue, true, false)}</div>
          </div>
        )}
      {/* SUBSCRIPTION DISCOUNT SUMMARY - For SAME_AND_NEXT_ORDER_DISCOUNT Type - for samer order discount case */}
      {subscriptionDiscountValue !== undefined &&
        subscriptionDiscountValue > 0 &&
        Object.keys(applicableSubscriptionDetails || {}).length > 0 &&
        applicableSubscriptionDetails?.offerType === "SAME_AND_NEXT_ORDER_DISCOUNT" && (
          <div className="flex px-5 mb-3">
            <div className="w-1/2">{t("glammPlusSubscriptionDiscount") || "Additional Discount"}</div>
            <div className="w-1/2 text-right text-green-600">- {formatPrice(subscriptionDiscountValue, true, false)}</div>
          </div>
        )}
      {glammClubMembershipProduct && (
        <div className="flex px-5 mb-3">
          <div className="w-1/2 truncate">{glammClubMembershipProduct?.name || "Glamm Club Membership"}</div>
          <div className="w-1/2 text-right text-green-600">
            {glammClubMembershipProduct?.price === glammClubMembershipProduct?.offerPrice && "FREE"}
          </div>
        </div>
      )}
      {/* SHIPPING CHARGES SUMMARY */}
      <div className="flex px-5 justify-between">
        <div className="mb-3">
          <p className="flex items-center">
            {t("shippingCharges")}

            {/* Btn with popup to show any additional info if present */}
            {additionalInfo && (
              <button
                type="button"
                onClick={() => setShowShippingPopup(prev => !prev)}
                className="rounded-full w-4 h-4 border border-color1 text-xs flex justify-center items-center ml-1.5 text-color1 relative"
              >
                i
                {showShippingPopup && (
                  <div
                    style={{ boxShadow: "0px 2.08333px 4.16667px rgba(0, 0, 0, 0.15)" }}
                    className="rounded-lg text-xs text-color1 border border-color1 p-2 pl-3 absolute my-auto w-44 text-left shadow bg-white -right-48"
                  >
                    {additionalInfo}
                    <div className="absolute inset-y-0 my-auto border-b border-l border-color1 w-3 h-3 bg-white -left-1.5 ltr:rotate-45 rtl:-rotate-45" />
                  </div>
                )}
              </button>
            )}
          </p>
          {shippingCharges !== 0 && isShippingChargeCashBack && (
            <p className="text-xs font-semibold mt-1 text-green-600">{`Shipping charges ${formatPrice(
              shippingCharges,
              true,
              false
            )} will be instantly credited as GoodPoints`}</p>
          )}

          {FEATURES.hideShippingChargesOnPayment && cartShippingCharges === 0 && payableAmount >= freeShippingThreshold && (
            <p className="text-xs opacity-50 mt-1">
              {youHaveAvailedFreeShipping?.replace(/\{\{(.*?)\}\}/, freeShippingThreshold)}
            </p>
          )}
        </div>

        {/* Display shipping charges */}
        {displayShippingCharges()}
      </div>
      {FEATURES.hideShippingChargesOnPayment && shippingChargesDiscount !== undefined && shippingChargesDiscount > 0 && (
        <div className="px-5 mb-3">
          <div className="flex items-center justify-between ">
            <p>{t("shippingChargesAfterDiscount") || "Shipping charges Discount"}</p>
            <p className="text-green-600">- {formatPrice(shippingChargesDiscount, true)}</p>
          </div>
          {shippingChargesAfterDiscount === 0 && <p className="text-xs opacity-50 mt-1">{t("availedFreeShipping")}</p>}
        </div>
      )}
      {SHOP.REGION === "MIDDLE_EAST" && (
        <div className="flex px-5 border-t text-sm pt-3 items-center justify-between font-bold border-gray-100">
          <p>{t("totalAmount")}</p>
          <p>
            {!FEATURES.hideShippingChargesOnPayment
              ? formatPrice(payableAmount - shippingCharges, true, false)
              : formatPrice(payableAmount, true, false)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Summary;
