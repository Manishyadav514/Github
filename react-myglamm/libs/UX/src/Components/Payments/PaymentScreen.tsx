import React, { Fragment, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSnapshot } from "valtio";

import { useSelector } from "@libHooks/useValtioSelector";
import { useCreateOrder } from "@checkoutLib/Payment/useCreateOrder";
import { checkIfCouponOrPointsAvailable } from "@checkoutLib/Payment/HelperFunc";
import { GIFT_CARDS } from "@libStore/valtioStore";
import { ValtioStore } from "@typesLib/ValtioStore";
import PaymentMethods from "./PaymentMethods";
import { fetchIsPincodeServiceable } from "@libStore/actions/userActions";
import { fetchAllPaymentMethodsOffers, fetchDeliveryDate } from "@libStore/actions/paymentActions";
import { SHOP } from "@libConstants/SHOP.constant";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { UserAddress } from "@typesLib/Consumer";
import RedeemGlammCash from "./RedeemGlammCash";
import ShippingChargesCashback from "@libComponents/Cart/ShippingChargesCashback";
import UpsellOnPayments from "./UpsellOnPayments";
import ZeroPayableAmountGlammCash from "./ZeroPayableAmountGlammCash";
import PaymentCTA from "./PaymentCTA";
import { useSplit } from "@libHooks/useSplit";
import AddGiftCard from "./AddGiftCard";

const PayShippingAddress = dynamic(() => import("./PayShippingAddress"), { ssr: false });
const AvailableOffers = dynamic(() => import("./AvailableOffers"), { ssr: false });
const Giftcard = dynamic(() => import(/* webpackChunkName: "Giftcard" */ "./Giftcard"), { ssr: false });
const PaymentSpinner = dynamic(() => import(/* webpackChunkName: "Spinner" */ "./PaymentSpinner"), { ssr: false });
const OtherPaymentModes = dynamic(() => import(/* webpackChunkName: "OtherPayModes" */ "./OtherPaymentModes"), { ssr: false });
const ZeroPayableAmount = dynamic(() => import(/* webpackChunkName: "ZeroPayScreen" */ "./ZeroPayableAmount"), { ssr: false });
const CouponExpiredScreen = dynamic(() => import(/* webpackChunkName: "CouponExpireScreen" */ "./CouponExpiredScreen"), {
  ssr: false,
});
const PaymentSummary = dynamic(() => import(/* webpackChunkName: "payment Screen" */ "./PaymentSummary"));

const SavedCards = dynamic(() => import("./SavedCards"));

const PaymentStatusScreen = dynamic(() => import(/* webpackChunkName: "Paypal" */ "./PaymentStatusScreen"), { ssr: false });

const PaymentScreen = () => {
  const {
    shippingAddress,
    profile,
    payableAmount,
    vendorMerchantId,
    paymentOrder,
    cart,
    isUpiPaymentScreenLoading,
    isPaymentProcessing,
    isCouponExpired,
    userRedeemedGlammPoints,
    thresHoldCartValueForGlammCoins,
  } = useSelector((store: ValtioStore) => ({
    shippingAddress: store.userReducer.shippingAddress,
    profile: store.userReducer.userProfile,
    payableAmount: store.cartReducer.cart.payableAmount,
    vendorMerchantId: store.paymentReducer.vendorMerchantId,
    paymentOrder: store.paymentReducer.paymentOrder,
    cart: store.cartReducer.cart,
    isUpiPaymentScreenLoading: store.paymentReducer.isUpiPaymentScreenLoading,
    isPaymentProcessing: store.paymentReducer.isPaymentProcessing,
    isCouponExpired: store.paymentReducer.isCouponExpired,
    userRedeemedGlammPoints: store.paymentReducer.userRedeemedGlammPoints,
    thresHoldCartValueForGlammCoins: store.cartReducer.cart.thresHoldCartValueForGlammCoins,
  }));

  const glammCoinsVariant = useSplit({
    experimentsList: [
      {
        id: "glammCoins",
        condition: payableAmount >= thresHoldCartValueForGlammCoins,
      },
    ],
    deps: [],
  });
  const variants = useSplit({
    experimentsList: [{ id: "shippingChargesCashback", condition: cart.shippingCharges > 0 }],
    deps: [cart],
  });

  const zeroPayableAmount = cart.payableAmount === 0;

  const isBinSeries = cart.binSeriesData?.paymentMethods?.value?.length;

  const { handleCreateOrder, removeBinSeries } = useCreateOrder(true, paymentOrder);

  const giftCards = useSnapshot(GIFT_CARDS).cards;

  useEffect(() => {
    /* check if pincode is serviceable */
    if (SHOP.REGION !== "MIDDLE_EAST") {
      fetchIsPincodeServiceable(shippingAddress as UserAddress);
    }
  }, [shippingAddress]);

  /* Get estimated delivery dates */
  useEffect(() => {
    fetchDeliveryDate(cart);
  }, [cart.deliverDates]);

  useEffect(() => {
    /* In-case of Zero Amount, some kind of coupon or points should be there otherwise redirect user */
    checkIfCouponOrPointsAvailable({ zeroPayableAmount, giftCards, cart });

    if (SHOP.ENABLE_JUSPAY && SHOP.REGION !== "MIDDLE_EAST" && vendorMerchantId && profile) {
      fetchAllPaymentMethodsOffers({ profile, vendorMerchantId, payableAmount });
    }

    return () => {
      PAYMENT_REDUCER.isPaymentProcessing = false;
      PAYMENT_REDUCER.isUpiPaymentScreenLoading = false;
    };
  }, [payableAmount]);

  return (
    <Fragment>
      <ShippingChargesCashback shippingChargeCashbackVariant={variants?.shippingChargesCashback} />
      <PayShippingAddress displayExpectedDelivery={false} />

      {FEATURES.enableGPonPayment && glammCoinsVariant?.glammCoins === "1-true" && <RedeemGlammCash />}

      <AddGiftCard />

      {!FEATURES.hideShippingChargesOnPayment && (
        <PaymentSummary shippingChargeCashbackVariant={variants?.shippingChargesCashback} />
      )}

      {!zeroPayableAmount && SHOP.ENABLE_JUSPAY && !FEATURES?.hideAvailableOffers && <AvailableOffers />}

      {!zeroPayableAmount && <UpsellOnPayments />}

      {isPaymentProcessing && <PaymentSpinner />}

      {isUpiPaymentScreenLoading && <PaymentStatusScreen />}

      {userRedeemedGlammPoints && zeroPayableAmount && <ZeroPayableAmountGlammCash />}

      {/* Rendering based on conditons and priority */}
      {(() => {
        if (isCouponExpired) {
          return <CouponExpiredScreen />;
        }

        if (!zeroPayableAmount) {
          return (
            <Fragment>
              {/* Save Cards functionality */}
              <SavedCards handleCreateOrder={handleCreateOrder} />

              <PaymentMethods handleCreateOrder={handleCreateOrder} key={payableAmount} />
            </Fragment>
          );
        }

        return null;
      })()}

      {!isPaymentProcessing && !isBinSeries && cart.productCount > 0 && !userRedeemedGlammPoints && (
        <Fragment>
          {/* @ts-ignore */}
          {paymentOrder.find(x => x.active && x.name === "giftCard") && <Giftcard handleCreateOrder={handleCreateOrder} />}

          {zeroPayableAmount && <ZeroPayableAmount handleCreateOrder={handleCreateOrder} />}
        </Fragment>
      )}

      {userRedeemedGlammPoints && zeroPayableAmount && <PaymentCTA handleCreateOrder={handleCreateOrder} />}

      {/* REMOVE BIN SERIES - OTHER PAY MODES */}
      {isBinSeries && <OtherPaymentModes removeBinSeries={removeBinSeries} />}
    </Fragment>
  );
};

export default PaymentScreen;
