import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSnapshot } from "valtio";
import { useSelector } from "@libHooks/useValtioSelector";
import { v4 as uuid4 } from "uuid";
import io from "socket.io-client";
import CartAPI from "@libAPI/apis/CartAPI";
import OrderAPI from "@libAPI/apis/OrderAPI";
import { LOCALSTORAGE, SESSIONSTORAGE, XTOKEN } from "@libConstants/Storage.constant";
import useTranslation from "@libHooks/useTranslation";
import { GIFT_CARDS } from "@libStore/valtioStore";
import { showError } from "@libUtils/showToaster";
import { GA4AddPaymentInfoEvent, GAPaymentInit } from "@libUtils/analytics/gtm";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { checkUserLoginStatus, getCouponandPoints } from "../Storage/HelperFunc";
// import { setUpiIntentUrl } from "@libStore/actions/paymentActions";
import { paymentSuggestion, ReduxStore } from "@typesLib/Redux";
import { PaymentOrder, PaymentType, PaymentData, SuggestedPaymentPayload } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";

import {
  customAdobePayMethodClick,
  getOrderCreationData,
  handleEnableWhatsapp,
  setAnalyticsLocally,
  createOrderPayload,
  createPayTmForm,
  createRazorPayForm,
  isGiftCardFromPhase1,
} from "./HelperFunc";
import { getClientQueryParam } from "@libUtils/_apputils";
import { adobePayErrMessageEvent, adobeSocketNoMessageEvent } from "./Payment.Analytics";
import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSplit } from "@libHooks/useSplit";
import { updateProducts } from "../Cart/HelperFunc";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

export function useCreateOrder(initAll = true, paymentOrder?: PaymentOrder[]) {
  const router = useRouter();
  const { t } = useTranslation();

  const orderApi = new OrderAPI();
  const giftCards = useSnapshot(GIFT_CARDS).cards;
  const isNewOrderFlowEnabled = t("newOrderFlowEnabled");

  const splitVariants =
    useSplit({
      experimentsList: [{ id: "highRtoRiskExperiment" }, { id: "cancellationReasonExp" }, { id: "changeShadeAndAddress" }],
      deps: [],
    }) || {};

  const {
    highRtoRiskExperiment: rtoRiskExperimentBucket,
    cancellationReasonExp,
    changeShadeAndAddress: changeShadeAddressVariant,
  } = splitVariants || {};
  const pdpRecurringSubscriptionVariant = (window as any).evars?.evar157;
  const socketResponseRef = useRef<any>(null);
  const [rtoRiskExperimentText, setRtoRiskExperimentText] = useState("");
  const experimentVariants = {
    pdpRecurringSubscriptionVariant,
    changeShadeAddressVariant,
    cancellationReasonExp,
  };

  const {
    userCart,
    shippingAddress,
    dsExpectedDeliveryDate,
    binSeriesData,
    codEnabledForSubscription,
    userRedeemedGlammPoints,
  } = useSelector((store: ValtioStore) => ({
    userCart: store.cartReducer.cart,
    shippingAddress: store.userReducer.shippingAddress,
    dsExpectedDeliveryDate: store.paymentReducer.expectedDelivery?.dsExpectedDeliveryDate,
    binSeriesData: store.cartReducer.cart.binSeriesData,
    codEnabledForSubscription: store.cartReducer.cart.codEnabledForSubscription,
    userRedeemedGlammPoints: store.paymentReducer.userRedeemedGlammPoints,
  }));

  /* Simpl Logic After Redirected from Simpl Webview */
  useEffect(() => {
    if (initAll) {
      const id = getClientQueryParam("id");
      const simplToken = getClientQueryParam("simplToken");

      const verificationId = checkUserLoginStatus()?.memberId || getLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS)?.phoneNumber;

      if (simplToken && id === verificationId) {
        setLocalStorageValue(LOCALSTORAGE.SIMPL_TOKEN, simplToken);
        handleCreateOrder("simpl");
      }
    }
  }, []);

  useEffect(() => {
    if (rtoRiskExperimentBucket && rtoRiskExperimentBucket !== "no-variant") {
      (window as any).evars.evar169 = `${rtoRiskExperimentBucket}-${rtoRiskExperimentText}`;
    }
  }, [rtoRiskExperimentText]);

  /**
   * Check for COD Avability - Need to add condition for binseries
   */
  useEffect(() => {
    if (userCart.payableAmount && rtoRiskExperimentBucket) {
      /* Avoid Enable COD Check in case on Bin-Series and any giftcard applied(used) */
      if (!binSeriesData?.paymentMethods?.value?.length && !giftCards?.filter(x => x.used)?.length) {
        if (LOCALSTORAGE.ENABLE_COD in localStorage) {
          PAYMENT_REDUCER.isCodEnable = true;
        } else {
          checkIsCodAvailable();
        }
      } else if (!userCart.products.find(x => x.productMeta?.isPreOrder) && userCart.payableAmount > 199) {
        PAYMENT_REDUCER.isCodEnable = true;
      } else {
        PAYMENT_REDUCER.isCodEnable = false;
        PAYMENT_REDUCER.codDisableMessage = "Cash on delivery is currently unavailable";
      }
    }
  }, [userCart?.payableAmount, shippingAddress, rtoRiskExperimentBucket]);

  /* check if is COD available */
  const checkIsCodAvailable = async () => {
    const cartApis = new CartAPI();
    try {
      if (shippingAddress && userCart.payableAmount) {
        const utmParams = getLocalStorageValue(LOCALSTORAGE?.UTM_PARAMS, true) || {};
        const response = await cartApis.getCODAvailabilityV2(
          shippingAddress?.zipcode,
          userCart.couponData?.couponCode || "",
          userCart.appliedGlammPoints || 0,
          rtoRiskExperimentBucket,
          utmParams
        );

        if (response?.data?.status) {
          const { isCoD, label, messageOnCheckout } = response.data.data;
          PAYMENT_REDUCER.isCodEnable = isCoD;

          PAYMENT_REDUCER.shippingMessage = messageOnCheckout;
          setRtoRiskExperimentText(`COD ${isCoD ? "enabled" : "disabled"}`);
          if (label) {
            PAYMENT_REDUCER.codDisableMessage = label;
          }
        }
      }
    } catch (err) {
      console.error(err);

      /* In-case a preorder Product Available in Cart disable COD */
      if (userCart.products.find(x => x.productMeta.isPreOrder)) {
        PAYMENT_REDUCER.isCodEnable = false;
        return;
      }

      PAYMENT_REDUCER.isCodEnable = true;
    }
  };

  const addGiftCardToBag = async () => {
    const giftCard = getLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT, true);
    const upsellData = getLocalStorageValue(LOCALSTORAGE.UPSELL_DATA, true);

    try {
      const response = await updateProducts(
        { ...giftCard, type: giftCard.subProductType, upsellKey: upsellData?.key, variantValue: upsellData?.variantValue },
        1
      );

      if (response) return response;
    } catch (err) {
      console.error(err);
    }
  };

  // /**
  //  * Middlewate
  //  * Creates and Patches data based on the gateway selected and required by it
  //  */

  const handleCreateOrder = async (
    payType: PaymentType,
    payData?: PaymentData | paymentSuggestion,
    isSuggestedPaymentOrder?: boolean,
    consent = true
  ) => {
    // @ts-ignore - Generating the data required to create order;
    const { methodData, metaData } =
      getOrderCreationData(
        payData as PaymentData | paymentSuggestion,
        paymentOrder as PaymentOrder[],
        isSuggestedPaymentOrder,
        consent
      ) || {};

    // dispatch(setPaymentProcessing(true));

    if (payType) {
      const giftCardVariant = getSessionStorageValue(SESSIONSTORAGE.GIFT_CARD_VARIANT);

      if (giftCardVariant === "2" && userCart.shippingCharges > 0 && !isGiftCardFromPhase1(userCart.products)) {
        await addGiftCardToBag();
      }

      const _createOrder = await createOrder(
        payType as PaymentType,
        methodData as PaymentData,
        metaData as unknown as SuggestedPaymentPayload
      );

      return _createOrder;
    }
  };

  /**
   * Create Order Function for placing an order
   * @param type - Type of payment
   * @param razorPayData - Razorpay Simpl Options
   */

  const createOrder = async (type: PaymentType, razorPayData?: PaymentData, otherPayload?: SuggestedPaymentPayload) => {
    /* Creating Hash Id for FB Conversion Tracking */
    sessionStorage.setItem(SESSIONSTORAGE.FB_EVENT_ID, uuid4());

    /**
     * whatsApp opt in api call
     */
    handleEnableWhatsapp();

    customAdobePayMethodClick(type);

    GAPaymentInit(userCart);

    GA4AddPaymentInfoEvent(userCart);

    const socketToken = getLocalStorageValue(XTOKEN()) || getLocalStorageValue(LOCALSTORAGE.GUEST_TOKEN);

    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}?token=${socketToken}`, {
      transports: ["websocket"],
      timeout: 5000, // 5 seconds
    });

    if (userCart.identifier && socketToken) {
      socket.connect();
      socket.on("server", (_: any) => console.info(_));
      socket.on("error", (socket_error: any) => console.error({ socket_error }));
      socket.on("reconnect", (socket_reconnect: any) => console.error({ socket_reconnect }));
      socket.on("reconnect_attempt", (socket_attempt: any) => console.error({ socket_attempt }));
      socket.on("connect_error", (connect_error: any) => console.error({ connect_error }));
      socket.on("reconnecting", (reconnecting: any) => console.error({ reconnecting }));
      socket.on("reconnect_failed", (reconnect_failed: any) => console.error({ reconnect_failed }));
      socket.on("reconnect_error", (socket_reconnect_error: any) => console.error({ socket_reconnect_error }));
      socket.on("connect_timeout", (connect_timeout: any) => {
        adobeSocketNoMessageEvent(); // event165
        console.error({ connect_timeout });
      });
      socket.on("connect", async (_: any) => {
        try {
          PAYMENT_REDUCER.isPaymentProcessing = true;

          await orderApi
            .createOrder(
              createOrderPayload({
                dsExpectedDeliveryDate,
                userCart,
                shippingAddress,
                type,
                otherPayload,
                isNewOrderFlowEnabled,
                codEnabledForSubscription,
                experimentVariants,
                userRedeemedGlammPoints,
              })
            )
            .then(({ data: orderData }: any) => {
              if (orderData?.code === 200) {
                sessionStorage.removeItem(LOCALSTORAGE.ORDER_CREATED_THROUGH_COD_PROMPT);

                return new Promise((resolve, reject) => {
                  const sockInt = setInterval(() => {
                    if (socketResponseRef?.current && socketResponseRef?.current?.status === "Success") {
                      console.log("SOCKET RESPONSE", JSON.stringify(socketResponseRef.current));
                      console.log("order summary", socketResponseRef.current.data);
                      /* Storing Socket Response for Order Summary Page */
                      setLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, socketResponseRef.current.data, true);

                      /* Once Order Created remove forceCOD option from localstorage */
                      removeLocalStorageValue(LOCALSTORAGE.ENABLE_COD);

                      /**
                       * Set the Data for Analytics
                       */
                      setAnalyticsLocally(socketResponseRef.current.data, type);
                      // return socket response if payment method is card
                      if (otherPayload?.paymentMethod.method === "creditCard" && type === "juspay") {
                        clearInterval(sockInt);
                        dispatchEvent(new Event("creditDebitSuccess"));
                        return resolve(socketResponseRef.current.data);
                      }

                      // link to open app for upi intent flow
                      const UpiIntentAppUrl =
                        socketResponseRef.current.data.paymentDetails?.paymentMode?.[0]?.gatewayResponse?.logs?.data?.intentUrl;

                      if (UpiIntentAppUrl) {
                        socket.close();

                        var a = document.createElement("a");
                        a.href = UpiIntentAppUrl;
                        a.style.display = "none";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();

                        // window.location.href = UpiIntentAppUrl;

                        PAYMENT_REDUCER.upiIntentFlowUrl = UpiIntentAppUrl;

                        PAYMENT_REDUCER.isUpiPaymentScreenLoading = true;
                      }

                      /* link to open juspay sandbox for payment */
                      const jusPayPaymentLink = socketResponseRef.current.data?.paymentDetails?.paymentMode?.find(
                        (link: any) => {
                          if (link?.gatewayResponse.linkUrl) {
                            return link?.gatewayResponse;
                          }
                          return null;
                        }
                      );

                      let gatewayResponselogs: any;
                      if (type !== "cash") {
                        const [paymentDetails] =
                          socketResponseRef.current.data.paymentDetails?.paymentMode?.filter(
                            (mode: any) => !mode.type.match(/glamm|giftCard/)
                          ) || [];

                        gatewayResponselogs = paymentDetails?.gatewayResponse?.logs;
                      }

                      switch (type) {
                        case "cash":
                        case "simpl": {
                          router.push("/order-summary?status=success");
                          break;
                        }

                        case "paypal": {
                          const location = gatewayResponselogs.links.filter((link: any) => link.rel === "approve")[0];
                          resolve((window.location.href = location.href));
                          break;
                        }

                        case "razorpay": {
                          resolve(
                            createRazorPayForm({ gatewayResponselogs, socketResponse: socketResponseRef.current, razorPayData })
                          );
                          break;
                        }

                        case "payu": {
                          document.open();
                          document.write(atob(gatewayResponselogs?.templateUrl));
                          resolve(document.close());
                          break;
                        }

                        case "paytm": {
                          resolve(createPayTmForm(gatewayResponselogs));
                          break;
                        }

                        case "juspay":
                          if (otherPayload?.paymentMethod.method !== "creditCard" && !UpiIntentAppUrl) {
                            const location = jusPayPaymentLink?.gatewayResponse?.linkUrl;
                            resolve((window.location.href = location));
                          }
                          break;
                        default: {
                          throw new Error("Invalid Payment Method Selected");
                        }
                      }
                      clearInterval(sockInt);
                    } else if (socketResponseRef?.current && socketResponseRef?.current?.status === "Error") {
                      adobePayErrMessageEvent(`socket|${socketResponseRef.current.error}`);
                      handlePaymentError(socketResponseRef.current.error || "Something Went Wrong");
                      clearInterval(sockInt);
                      return;
                    }
                  }, 200);
                });
              }
            })
            .catch(e => {
              adobePayErrMessageEvent(
                `order put call|${e.response?.status || ""}|${e.response?.data?.message || e.message || ""}`
              ); // event166
              return handlePaymentError(e.response?.data?.message || e.message);
            });
        } catch (error: any) {
          handlePaymentError(error.message);
          console.error(`Error: ${error.message}`);
        }
      });
      socket.on("message", (socketResponse: any) => {
        socketResponseRef.current = socketResponse;
        socket.close();
      });
    }
  };

  /**
   * In Case User Prompts to Remove the coupon of bin series and pay normally using
   * other payment modes
   */
  const removeBinSeries = async () => {
    PAYMENT_REDUCER.isPaymentProcessing = true;

    const cartApis = new CartAPI();
    return await cartApis
      .updateCart(undefined, getCouponandPoints().gp, shippingAddress?.zipcode)
      .then(({ data: res }) => {
        /* Clear local storage related to Coupon */
        removeLocalStorageValue(LOCALSTORAGE.COUPON);
        removeLocalStorageValue(LOCALSTORAGE.DISCOUNT_PRODUCT_ID);

        return res;
      })
      .catch(err => handlePaymentError(err.response?.data?.message || err))
      .finally(() => (PAYMENT_REDUCER.isPaymentProcessing = false));
  };

  /**
   * Handle Erros from Create Order And Socket
   * @param errorMessage {String}
   */
  function handlePaymentError(errorMessage: string) {
    PAYMENT_REDUCER.isPaymentProcessing = false;

    removeLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS);

    /** If instant discount offer expire then show Expired UX */
    if (errorMessage?.includes("you just missed this")) {
      PAYMENT_REDUCER.isCouponExpired = true;
      return;
    }

    /* Show Toaster incase any payment error occurs */
    console.error(errorMessage);
    return showError(errorMessage);
  }

  return {
    handleCreateOrder,
    removeBinSeries,
    checkIsCodAvailable,
  };
}
