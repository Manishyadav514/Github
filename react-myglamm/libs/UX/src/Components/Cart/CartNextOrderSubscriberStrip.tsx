import React from "react";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import FireWorks from "../../../public/svg/fire-works.svg";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import { subscriptionModel } from "@typesLib/Cart";

const CartNextOrderSubscriberStrip = () => {
  const isLoggedIn = checkUserLoginStatus();
  const { subscriptionDetails, subscriptionDiscountValue } = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const currentApplicableSubscription = useSelector(
    (store: ValtioStore) => store.cartReducer.cart.applicableSubscriptionDetails
  );
  const { t } = useTranslation();

  const subscriptionText =
    t("subscribedMsgBelowCartAOV") ||
    "You have a subscription of {{subscriptionAmount}} and can get an additional {{discountValue}} off on purchase of {{cartAOV}}";

  const subscriptionClaimedText =
    t("subscribedMsgAboveCartAOV") ||
    "Congratulations! You have availed an additional {{discountValue}} off on this Order as part of the Subscription.";

  // get subscription Offer price
  const getSubscriptionOfferPrice = () => {
    let subscriptionPrice;
    // if user already subscribed & logged in
    if (subscriptionDetails && Object.keys(subscriptionDetails).length > 0) {
      if (subscriptionDetails?.subscriptionOfferPrice) {
        subscriptionPrice = formatPrice(subscriptionDetails?.subscriptionOfferPrice, true);
      } else {
        const { subscriptionOfferPrice } = subscriptionDetails?.meta && JSON.parse(subscriptionDetails?.meta);
        subscriptionPrice = formatPrice(subscriptionOfferPrice, true);
      }
      // if user not already subscribed & this will be in case of same_and_next_order type [logged in + guest user both]
    } else {
      if (currentApplicableSubscription?.subscriptionOfferPrice) {
        subscriptionPrice = formatPrice(currentApplicableSubscription?.subscriptionOfferPrice, true);
      } else {
        const { subscriptionOfferPrice } =
          currentApplicableSubscription?.meta && JSON.parse(currentApplicableSubscription?.meta);
        subscriptionPrice = formatPrice(subscriptionOfferPrice, true);
      }
    }
    return subscriptionPrice;
  };

  // if subscription offertype is same & next order and user is not subscribed yet.
  if (
    subscriptionDetails &&
    Object.keys(subscriptionDetails)?.length === 0 &&
    currentApplicableSubscription?.offerType === "SAME_AND_NEXT_ORDER_DISCOUNT"
  ) {
    return (
      <>
        <div className="sticky w-full text-sm p-2 mt-2 bg-color2 inset-x-0 flex justify-start items-center bottom-16 z-20">
          <FireWorks className="mr-2 w-6" />
          {/* If subscription discount applied  */}
          {subscriptionDiscountValue && subscriptionDiscountValue > 0 ? (
            <p
              dangerouslySetInnerHTML={{
                __html: subscriptionClaimedText?.replace(
                  "{{discountValue}}",
                  `<b class="text-color1"> ${formatPrice(subscriptionDiscountValue, true, false)} </b>`
                ),
              }}
            ></p>
          ) : (
            <p
              dangerouslySetInnerHTML={{
                __html: subscriptionText
                  ?.replace("{{subscriptionAmount}}", `${getSubscriptionOfferPrice()}`)
                  ?.replace(
                    "{{cartAOV}}",
                    `${formatPrice(currentApplicableSubscription?.minCartValueAfterSubscription as number, true, false)}`
                  )
                  ?.replace(
                    "{{discountValue}}",
                    `<b class="text-color1"> ${formatPrice(currentApplicableSubscription?.discountValue, true, false)} </b>`
                  ),
              }}
            ></p>
          )}
        </div>
      </>
    );
  }

  // If user is already subscribed with cart subscription
  if (
    (isLoggedIn &&
      subscriptionDetails &&
      Object.keys(subscriptionDetails)?.length > 0 &&
      subscriptionDetails?.offerType === "NEXT_ORDER_DISCOUNT") ||
    subscriptionDetails?.offerType === "SAME_AND_NEXT_ORDER_DISCOUNT"
  ) {
    return (
      <>
        <div className="sticky w-full text-sm p-2 mt-2 bg-color2 inset-x-0 flex justify-start items-center bottom-16 z-20">
          <FireWorks className="mr-2 w-6" />
          {/* If subscription discount applied  */}
          {subscriptionDiscountValue && subscriptionDiscountValue > 0 ? (
            <p
              dangerouslySetInnerHTML={{
                __html: subscriptionClaimedText?.replace(
                  "{{discountValue}}",
                  `<b class="text-color1"> ${formatPrice(subscriptionDiscountValue, true, false)} </b>`
                ),
              }}
            ></p>
          ) : (
            <p
              dangerouslySetInnerHTML={{
                __html: subscriptionText
                  ?.replace("{{subscriptionAmount}}", `${getSubscriptionOfferPrice()}`)
                  ?.replace(
                    "{{cartAOV}}",
                    `${formatPrice(subscriptionDetails?.minCartValueAfterSubscription as number, true, false)}`
                  )
                  ?.replace(
                    "{{discountValue}}",
                    `<b class="text-color1"> ${formatPrice(subscriptionDetails?.discountValue, true, false)} </b>`
                  ),
              }}
            ></p>
          )}
        </div>
      </>
    );
  }
  return null;
};

export default CartNextOrderSubscriberStrip;
