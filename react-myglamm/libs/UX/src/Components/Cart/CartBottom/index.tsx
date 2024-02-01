import React, { useEffect, useState } from "react";
import { fetchIsPincodeServiceable, fetchShippingAddress } from "@libStore/actions/userActions";
import { useSelector } from "@libHooks/useValtioSelector";
import CartFixedStrips from "../CartFixedStrips";
import CartFixedBottomStrip from "./CartFixedBottomStrip";
import SuggestedPayments from "./SuggestedPayments";
import useTranslation from "@libHooks/useTranslation";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { checkPrefixCouponsExist } from "@checkoutLib/Cart/HelperFunc";
import { checkUserLoginStatus, getCouponandPoints } from "@checkoutLib/Storage/HelperFunc";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { ValtioStore } from "@typesLib/ValtioStore";
import { adobeEventForSuggestedPayments } from "@checkoutLib/Cart/Analytics";
import CartAPI from "@libAPI/apis/CartAPI";
import { paymentSuggestion } from "@typesLib/Redux";
import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { getClientQueryParam } from "@libUtils/_apputils";
import PaymentByCOD from "./PaymentByCOD";
import { useSplit } from "@libHooks/useSplit";

interface FixedBottomProps {
  showLoginModal: () => void;
  updateCheckout: () => void;
  couponFreeProductData: any;
}

const CartBottom = ({ showLoginModal, updateCheckout, couponFreeProductData }: FixedBottomProps) => {
  const { t } = useTranslation();
  const isUserEditingCart = "USER_EDITING_CART" in sessionStorage;

  const splitVariants = useSplit({ experimentsList: [{ id: "suggestedPaymentsVariant" }], deps: [] }) || {};
  const { suggestedPaymentsVariant } = splitVariants || {};
  const prefixCoupons = t("hideXOUserfromCart") || ["PAR"];

  const [showMoreProductsModal, setShowMoreProductsModal] = useState<boolean>(false);
  const [suggestedPaymentsList, setSuggestedPaymentsList] = useState<paymentSuggestion[]>([]);

  const { shippingAddress, payableAmount, isBinSeries, coupon } = useSelector((store: ValtioStore) => ({
    shippingAddress: store.userReducer.shippingAddress,
    payableAmount: store.cartReducer.cart.payableAmount,
    isBinSeries: store.cartReducer.cart.binSeriesData?.paymentMethods?.value.length,
    coupon: store.cartReducer.cart.couponData.couponCode,
  }));

  useEffect(() => {
    SOURCE_STATE.previousCoupon = coupon ?? "";

    SOURCE_STATE.isXoUser =
      t("partnershipSource").includes(getLocalStorageValue(LOCALSTORAGE.UTM_PARAMS, true)?.utmSource.toLowerCase()) ||
      checkPrefixCouponsExist(prefixCoupons, coupon);
  }, [coupon]);

  useEffect(() => {
    const fetchSuggestedPayments = async () => {
      if (!shippingAddress) {
        await fetchShippingAddress().then(address => {
          if (!address) adobeEventForSuggestedPayments(suggestedPaymentsVariant, undefined, address);
        }); // if no address stored get it and retrigger
        return;
      }
      if (shippingAddress) {
        const isServiceable = await fetchIsPincodeServiceable(shippingAddress);

        if (isServiceable) {
          try {
            const cartApi = new CartAPI();
            let response = await cartApi.getSuggestedPayments(payableAmount);
            if (response?.status === 200) {
              setSuggestedPaymentsList(response.data.data);
              PAYMENT_REDUCER.vendorMerchantId = response?.data?.data[0]?.merchant_id;
            }

            return adobeEventForSuggestedPayments(suggestedPaymentsVariant, response.data.data, shippingAddress);
          } catch (e) {
            console.error(e);
          }
        }
      }

      adobeEventForSuggestedPayments(suggestedPaymentsVariant, undefined, shippingAddress);
    };

    /* Fetch suggested payment list */
    if (suggestedPaymentsVariant === "1" && !isBinSeries && checkUserLoginStatus()) {
      fetchSuggestedPayments();
    } else if (suggestedPaymentsVariant && (suggestedPaymentsVariant !== "1" || !checkUserLoginStatus())) {
      adobeEventForSuggestedPayments(suggestedPaymentsVariant, suggestedPaymentsList);
      dispatchEvent(new CustomEvent("suggestedPayments"));
    }
  }, [suggestedPaymentsVariant, isBinSeries, shippingAddress]);

  useEffect(() => {
    if (showMoreProductsModal) {
      setShowMoreProductsModal(!showMoreProductsModal);
    }
  }, [payableAmount]);

  useEffect(() => {
    if (!shippingAddress && isUserEditingCart) {
      fetchShippingAddress();
    }
  }, [shippingAddress]);

  const displayCartBottomLayer = () => {
    if (isUserEditingCart) {
      return <PaymentByCOD />;
    }

    if (suggestedPaymentsList.length > 0 && shippingAddress) {
      return <SuggestedPayments suggestedPaymentList={suggestedPaymentsList} />;
    }

    return <CartFixedBottomStrip showLoginModal={showLoginModal} showMoreProductsModal={showMoreProductsModal} />;
  };

  return (
    <div
      className={`sticky bottom-0 inset-x-0 w-full z-10 rounded-t-lg`}
      style={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px -4px 4px 0px" }}
    >
      {/* Fixed Bottom strip to display info and offers */}
      <CartFixedStrips />

      {/* display the cart bottom based on the variants */}
      {displayCartBottomLayer()}
    </div>
  );
};

export default CartBottom;
