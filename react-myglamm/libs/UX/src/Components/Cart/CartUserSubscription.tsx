import React, { useEffect, useState } from "react";
import { checkUserLoginStatus, getCartIdentifier } from "@checkoutLib/Storage/HelperFunc";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import CartAPI from "@libAPI/apis/CartAPI";
import { showError } from "@libUtils/showToaster";

import CartSecretStoreSubscription from "@libComponents/Cart/CartSecretStoreSubscription";
import CartNextOrderSubscription from "@libComponents/Cart/CartNextOrderSubscription";

interface subsProps {
  updateCheckout: () => void;
}

const CartUserSubscription = ({ updateCheckout }: subsProps) => {
  const [memberSubscriptions, setMemberSubscriptions] = useState<any>();

  const subscriptionDetails = useSelector((store: ValtioStore) => store.cartReducer.cart.subscriptionDetails);
  const payableAmount = useSelector((store: ValtioStore) => store.cartReducer.cart.payableAmount);
  const currentApplicableSubscription = useSelector(
    (store: ValtioStore) => store.cartReducer.cart.applicableSubscriptionDetails
  );

  useEffect(() => {
    updateMemberSubscription();
  }, [payableAmount, currentApplicableSubscription]);

  /**
   * fetch Updated member subscription data & check variant & logged In status
   */
  const updateMemberSubscription = () => {
    if (
      (!subscriptionDetails || Object.keys(subscriptionDetails).length === 0) &&
      (!currentApplicableSubscription || Object.keys(currentApplicableSubscription).length === 0)
    ) {
      getAvailableSubscription();
    } else {
      setMemberSubscriptions({ applicableSubscriptions: currentApplicableSubscription, existingSubscription: null });
    }
  };

  /**
   * API call for get applicable subscription
   */
  const getAvailableSubscription = async () => {
    const cartApi = new CartAPI();
    try {
      const { memberId } = checkUserLoginStatus() || {};
      if (memberId) {
        const { data: result } = await cartApi.getApplicableSubscriptions(memberId, payableAmount);
        setMemberSubscriptions(result.data);
      }
    } catch (err: any) {
      showError(err.response?.data?.message || "Error");
      return;
    }
  };

  if (memberSubscriptions?.applicableSubscriptions) {
    switch (memberSubscriptions?.applicableSubscriptions.offerType) {
      case "NEXT_ORDER_DISCOUNT":
      case "SAME_AND_NEXT_ORDER_DISCOUNT":
        return (
          <CartNextOrderSubscription
            availableSubscriptions={memberSubscriptions?.applicableSubscriptions}
            updateCheckout={updateCheckout}
          />
        );

      case "SECRET_STORE":
        return (
          <CartSecretStoreSubscription
            availableSubscriptions={memberSubscriptions?.applicableSubscriptions}
            updateCheckout={updateCheckout}
          />
        );

      default:
        return null;
    }
  } else {
    return null;
  }
};

export default CartUserSubscription;
