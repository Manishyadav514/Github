import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import OrderAPI from "@libAPI/apis/OrderAPI";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import useTranslation from "@libHooks/useTranslation";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

const OrderPending = dynamic(() => import("@libComponents/OrderSummary/OrderPending"), { ssr: false });

const OrderProcessing = ({ orderDetails }: any) => {
  const router = useRouter();

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [showOrderInPending, setShowOrderInPending] = useState(false);

  let statusInterval: NodeJS.Timer;

  const getOrderStatus = async (): Promise<boolean> => {
    try {
      const orders = new OrderAPI();
      const result = await orders.getOrderStatus(orderDetails.id);
      const { amount, status } = result.data.data;
      const paymentExpVariantNo = result.data.data.paymentExperimentVariant;

      if (status === "CAPTURED") {
        setIsLoading(false);
        clearInterval(statusInterval);

        /* For Specific Juspay Case updating payable amount(payment Offer usecase handled) */
        if (amount) {
          const adobeDataLS = getLocalStorageValue("adobeDataCartSummary", true);
          adobeDataLS.shoppingBag.netPayable = result.data.data.amount;
          setLocalStorageValue("adobeDataCartSummary", adobeDataLS, true);
        }

        router.push("/order-summary?status=success");

        return true;
      } else if (status === "FAILED" && paymentExpVariantNo === "1") {
        setIsLoading(false);
        clearInterval(statusInterval);
        router.push({
          pathname: "/order-summary",
          query: {
            status: "success",
            paymentStatus: "inPending",
          },
        });
        return true;
      } else if (status === "FAILED") {
        setIsLoading(false);
        clearInterval(statusInterval);
        router.push("/order-summary?status=failed");
        return true;
      }

      return false;
    } catch (error: any) {
      setIsLoading(false);
      clearInterval(statusInterval);
      setShowOrderInPending(true);

      return true;
    }
  };

  /* fetch order status */
  useEffect(() => {
    if (orderDetails) {
      setIsLoading(true);
      /* Return False in only case the api return no status otherwise true */
      getOrderStatus().then(state => {
        if (!state) {
          let count = 0;
          statusInterval = setInterval(async () => {
            await getOrderStatus();

            count++;

            if (count >= 3) {
              clearInterval(statusInterval);
              setIsLoading(false);
              setShowOrderInPending(true);
            }
          }, 2000);
        }
      });
    }

    return () => clearInterval(statusInterval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center text-center bg-themeGray z-50 fixed inset-0">
        <LoadSpinner className="w-16 h-16 mx-auto" />
        <h2
          className="font-bold text-2xl mt-6"
          style={{
            color: "#ff9797",
          }}
        >
          {t("holdOn") || "Hold on"}!
        </h2>
        <p className="text-gray-600 mt-2">{t("orderPendingMsg1") || "We are verifying your payment status."}</p>
        <p className="text-gray-600 mt-2">{t("orderPendingMsg2") || "Do not close or navigate away from this page."}</p>
      </div>
    );
  }

  if (showOrderInPending) {
    return <OrderPending />;
  }
  return null;
};

export default OrderProcessing;
