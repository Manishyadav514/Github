import React, { useState, useEffect, ReactElement, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Script from "next/script";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import useTranslation from "@libHooks/useTranslation";

import OrderAPI from "@libAPI/apis/OrderAPI";
import ScratchCardAPI from "@libAPI/apis/ScratchCardAPI";

import { getClientQueryParam } from "@libUtils/_apputils";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getLocalStorageValue, removeLocalStorageValueOnOrderPlaced } from "@libUtils/localStorage";
import { initoOrderSummaryEvent } from "@libAnalytics/OrderSummary.Analytics";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import {
  fetchUserProfile,
  getAndStoreSegmentTags,
  removeGuestTokens,
  switchUserFromGuestToLogin,
} from "@libUtils/login/HelperFunc";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { FEATURES } from "@libStore/valtio/FEATURES.store";

const OrderFailed = dynamic(() => import(/* webpackChunkName: "OrderFailed" */ "@libComponents/OrderSummary/OrderFailed"), {
  ssr: false,
});
const OrderSuccess = dynamic(() => import(/* webpackChunkName: "OrderSuccess" */ "@libComponents/OrderSummary/OrderSuccess"), {
  ssr: false,
});
const ScratchCardModal = dynamic(
  () => import(/* webpackChunkName: "ScratchCardModal" */ "@libComponents/ScratchCard/ScratchCardModal"),
  { ssr: false }
);

const OrderFailedForSimpl = dynamic(
  () => import(/* webpackChunkName: "OrderFailed for simpl" */ "@libComponents/OrderSummary/orderFailedForSimpl")
);

const OrderProcessing = dynamic(() => import("@libComponents/OrderSummary/OrderProcessing"), { ssr: false });

const ConfettiModal = dynamic(() => import("@libComponents/OrderSummary/ConfettiModal"), { ssr: false });

const OrderSummary = () => {
  const router = useRouter();
  const { t, isConfigLoaded } = useTranslation();

  const [showConfetti, setShowConfetti] = useState(false);

  const orderStatus = router.query.status;

  const paymentStatus = router.query.paymentStatus;

  const SimplPaymentOrderStatus = getClientQueryParam("SimplPaymentStatus");

  const [orderDetails, setOrderDetails] = useState<any>();
  const [scratchCard, setScratchCard] = useState<any>({});

  const [showScratchCardModal, setShowScratchCardModal] = useState<boolean | undefined>();
  const disableGoKwik = FEATURES?.disableGoKwik;
  const goKwikConfig = t("gokwik");

  useLayoutEffect(() => {
    const temporaryLoginData = getSessionStorageValue(SESSIONSTORAGE.TEMP_LOGIN_DETAILS, true);
    if (temporaryLoginData?.userId) {
      switchUserFromGuestToLogin();
      removeGuestTokens();
      fetchUserProfile(temporaryLoginData.userId);
      getAndStoreSegmentTags(temporaryLoginData.userId);
    }
  }, []);

  useEffect(() => {
    if (showScratchCardModal) {
      setTimeout(() => setShowConfetti(true), 1000);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [showScratchCardModal]);

  useEffect(() => {
    const orderData = getLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, true);
    if (orderData) {
      setOrderDetails(orderData);

      /* Send data to GoKwik */
      if (!disableGoKwik && checkUserLoginStatus()) {
        const orderApi = new OrderAPI();
        const goKwikInterval = setInterval(() => {
          try {
            orderApi.getGoKwikDetails(orderData?.orderNumber).then(({ data: goKwikResponse }) => {
              if (goKwikResponse?.data?.goQwikResp?.msgType === "2") {
                let merchantInfo = {
                  order_type: goKwikResponse?.data?.goQwikResp?.data?.order_type,
                  mid: goKwikResponse?.data?.goQwikResp?.data?.mid,
                  moid: goKwikResponse?.data?.goQwikResp?.data?.moid,
                  environment: goKwikConfig?.environment || "sandbox",
                  request_id: goKwikResponse?.data?.goQwikResp?.data?.request_id,
                  gokwik_oid: goKwikResponse?.data?.goQwikResp?.data?.gokwik_oid,
                  css: {},
                  showModal: false,
                };
                if ((window as any).gokwikSdk) {
                  //@ts-ignore
                  gokwikSdk.initPayment(merchantInfo);
                }
                clearInterval(goKwikInterval);
              }
            });
          } catch (error: any) {
            console.error(error);
          }
        }, goKwikConfig?.interval || 1000);

        setTimeout(() => {
          clearInterval(goKwikInterval);
        }, goKwikConfig?.timeout || 4000);
      }
    } else if (!SimplPaymentOrderStatus) {
      router.push("/");
    }

    (window as any).sc = setShowConfetti;
  }, []);

  /**
   * Start Polling of Scratch Card API on mount
   * Except in case MGXO(gamificationDiscountCodes) is being used to place the order
   * Note: No scract card for gamificationDiscountCodes users
   */
  const gamificationDiscountCodes = t("gamificationDiscountCodes");

  useEffect(() => {
    let scratchPollInterval: NodeJS.Timer;
    if (
      checkUserLoginStatus() &&
      SHOP.ENABLE_SCRATCHCARD &&
      orderStatus === "success" &&
      orderDetails &&
      gamificationDiscountCodes &&
      !gamificationDiscountCodes.includes(orderDetails.paymentDetails?.discountCode)
    ) {
      scratchPollInterval = setInterval(async () => {
        try {
          const scratchCardAPI = new ScratchCardAPI();
          const result = await scratchCardAPI.getScratchCardByOrderId(
            getLocalStorageValue(LOCALSTORAGE.MEMBER_ID) || orderDetails?.userInfo?.phoneNumber,
            orderDetails?.id
          );
          if (result.data.data) {
            setScratchCard(result.data.data);
            setShowScratchCardModal(true);
            clearInterval(scratchPollInterval);
          }
        } catch (error: any) {
          clearInterval(scratchPollInterval);
        }
      }, 1000);
    }

    return () => clearInterval(scratchPollInterval);
  }, [orderDetails, gamificationDiscountCodes]);

  useEffect(() => {
    if (paymentStatus !== "inPending") {
      initoOrderSummaryEvent(orderStatus as string);
      removeLocalStorageValueOnOrderPlaced(orderStatus as string);
    }
  }, [orderStatus, paymentStatus]);

  return (
    <main className="bg-color1 orderSummary">
      {showConfetti && <ConfettiModal show={showConfetti} />}

      {(() => {
        /* Failed screen for  simpl payment method  */
        if (!orderDetails && SimplPaymentOrderStatus) {
          return <OrderFailedForSimpl />;
        }

        if (orderDetails && isConfigLoaded) {
          switch (orderStatus) {
            case "pending":
              return <OrderProcessing orderDetails={orderDetails} />;
            case "failed":
              return <OrderFailed orderAmount={formatPrice(orderDetails?.paymentDetails?.netAmount) as number} />;
            case "success":
              return (
                <OrderSuccess
                  orderDetails={orderDetails}
                  orderStatus={orderStatus as string}
                  isPaymentPending={paymentStatus === "inPending"}
                />
              );
            default:
              return null;
          }
        }

        return <LoadSpinner className="inset-0 h-screen m-auto w-16" />;
      })()}

      {showScratchCardModal && (
        <ScratchCardModal
          show={showScratchCardModal}
          onRequestClose={() => setShowScratchCardModal(false)}
          scratchCardData={scratchCard}
          scratchIndex={0}
          pageName="Order Confirmation"
        />
      )}
      {!disableGoKwik && <Script src="https://checkout.gokwik.co/integration.js" />}
    </main>
  );
};

OrderSummary.getLayout = (children: ReactElement) => children;

export default OrderSummary;
