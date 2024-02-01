import { useEffect } from "react";
import Router from "next/router";

import PaymentAPI from "@libAPI/apis/PaymentAPI";

import { SHOP } from "@libConstants/SHOP.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { fetchPaymentOrder, fetchPaymentOrderJuspay, fetchClientAuthDetails } from "@libStore/actions/paymentActions";

import { removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { getDowntimeStatus } from "./HelperFunc";
import { checkUserLoginStatus } from "../Storage/HelperFunc";
import { adobePaymentLoadEvent, adobeScCheckoutEvent } from "./Payment.Analytics";

export function usePaymentOnMount() {
  const { t } = useTranslation();

  const {
    cartLoaded,
    paymentOrder,
    profile,
    cart,
    isCodEnable,
    codDisableMessage,
    isCredEligible,
    isSimplEligible,
    simplEligibleMessage,
  } = useSelector((store: ValtioStore) => ({
    cartLoaded: store.cartReducer.cartLoaded,
    paymentOrder: store.paymentReducer.paymentOrder,
    profile: store.userReducer.userProfile,
    cart: store.cartReducer.cart,
    isCodEnable: store.paymentReducer.isCodEnable,
    codDisableMessage: store.paymentReducer.codDisableMessage,
    isCredEligible: store.paymentReducer.isCredEligible,
    isSimplEligible: store.paymentReducer.isSimplEligible,
    simplEligibleMessage: store.paymentReducer.simplEligibleMessage,
  }));

  useEffect(() => {
    if (cartLoaded && cart.allProducts?.length) {
      // before anything cart needs to be loaded

      /* Fetch client auth token for card payment */
      if (SHOP.ENABLE_JUSPAY && profile) {
        fetchClientAuthDetails(profile);
      }

      /* fetch list of payment methods */
      if (SHOP.ENABLE_JUSPAY) {
        fetchPaymentOrderJuspay();
      } else {
        fetchPaymentOrder();
      }

      /* check if this is user's first order */
      if (checkUserLoginStatus() && cart.firstOrder) {
        setLocalStorageValue(LOCALSTORAGE.FIRST_ORDER_FLAG, "true");
      } else {
        removeLocalStorageValue(LOCALSTORAGE.FIRST_ORDER_FLAG);
      }
    } else if (cartLoaded) {
      Router.push("/");
    }

    return () => {
      PAYMENT_REDUCER.isCodEnable = undefined;
      PAYMENT_REDUCER.codDisableMessage = undefined;
      PAYMENT_REDUCER.isCredEligible = undefined;
      PAYMENT_REDUCER.isSimplEligible = undefined;
      PAYMENT_REDUCER.simplEligibleMessage = undefined;
    };
  }, [cartLoaded]);

  // Adobe Analytics[29] - Page Load - Checkout Payment Combined
  useEffect(() => {
    if (
      "adobeDataCartSummary" in localStorage &&
      paymentOrder &&
      typeof isCodEnable === "boolean" &&
      typeof isCredEligible === "boolean" &&
      typeof isSimplEligible === "boolean"
    ) {
      !IS_DESKTOP && adobeScCheckoutEvent();

      adobePaymentLoadEvent(
        getDowntimeStatus(paymentOrder, isCodEnable, codDisableMessage, isCredEligible, isSimplEligible, simplEligibleMessage)
      );
    }
  }, [paymentOrder, isCodEnable, isCredEligible, isSimplEligible]);

  /* Call only if in payment order CRED or TWID is included and active */
  useEffect(() => {
    if (paymentOrder?.find(x => x.name.match(/CRED|TWID/)) && profile?.id) {
      const paymentApi = new PaymentAPI();

      // CRED call
      if (paymentOrder?.find(x => x.name === "CRED" && x.active)) {
        paymentApi.checkEligibility({ paymentMethod: "CRED" }).then(({ data: res }) => {
          PAYMENT_REDUCER.CRED = res.data[0].metaData;
          PAYMENT_REDUCER.isCredEligible = res.data[0].metaData?.isEligible;
        });
      }
      // TWID call
      if (paymentOrder?.find(x => x.name === "Pay with Rewards" && x.active)) {
        paymentApi
          .checkEligibility({ paymentMethod: "TWID", orderAmount: cart.payableAmount })
          .then(({ data: res }) => (PAYMENT_REDUCER.TWID = res.data[0].metaData));
      }
    }
  }, [paymentOrder]);
}
