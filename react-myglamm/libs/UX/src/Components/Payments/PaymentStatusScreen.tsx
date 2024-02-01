import React, { useEffect, useRef, useState } from "react";
import CountDownTimer from "@libComponents/CountDownTimer";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import useTranslation from "@libHooks/useTranslation";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import { useRouter } from "next/router";
import OrderAPI from "@libAPI/apis/OrderAPI";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const PaymentStatusScreen = () => {
  const getOrderStatus: any = useRef();
  const router = useRouter();

  const controller = new AbortController();
  const { t } = useTranslation();

  const [showUpiIntentBtn, setShowUpiIntentBtn] = useState<boolean>(false);

  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + 5 * 60000);

  const { upiAppDetails, upiIntentFlowUrl } = useSelector((store: ValtioStore) => ({
    upiAppDetails: store.paymentReducer.upiAppDetails,
    upiIntentFlowUrl: store.paymentReducer.upiIntentFlowUrl,
  }));

  const orderDetails = getLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, true);

  useEffect(() => {
    /* Once the user initiates intent upi flow and presses back button 
    we need to cancel the get order status polling request */
    return () => {
      /**  Ask user for confirmation to go back */
      router.beforePopState(() => {
        if (confirm("Are you sure you want to go back?")) {
          return true;
        }
        return false;
      });

      controller.abort();
      clearInterval(getOrderStatus.current);
    };
  }, []);

  useEffect(() => {
    if (orderDetails.id) fetchOrderStatus(orderDetails.id);

    setTimeout(() => setShowUpiIntentBtn(true), 10000);
  }, []);

  /* fetch order status during UPI intent flow */
  const fetchOrderStatus = async (id: string) => {
    let count = 0;
    getOrderStatus.current = setInterval(async () => {
      try {
        const orders = new OrderAPI();
        const result = await orders.getOrderStatus(id).catch(error => console.error("error", error));

        const status = (result as any)?.data?.data?.status;

        if (status && status.match(/CAPTURED|FAILED/)) {
          clearInterval(getOrderStatus.current);
          router.push("/order-summary?status=pending");
        }
      } catch (error: any) {
        clearInterval(getOrderStatus.current);
        router.push("/order-summary?status=failed");
      }

      /* Stop the API call if we don't get any status within 3 minutes */
      count++;

      if (count >= 150) {
        clearInterval(getOrderStatus.current);
      }
    }, 2000);
  };

  const handlePaymentAdobeClick = () => {
    /* ADOBE - CLICK - Payment */
    (window as any).digitalData = {
      common: {
        linkName: "web|order checkout|proceed to checkout|payment processing",
        linkPageName: "web|order checkout|payment processing",
        ctaName: "Open Intent URL",
        newLinkPageName: "payment processing",
        subSection: "payment processing",
        assetType: "payment",
        newAssetType: "payment",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  if (upiAppDetails && upiIntentFlowUrl) {
    return (
      <div className="flex flex-col justify-center items-center text-center bg-white z-50 fixed inset-0">
        <img src={upiAppDetails.imageUrl} alt={upiAppDetails.name} className="w-14 h-14" />

        <h2 className="font-bold text-lg text-center mt-4 max-w-xs">{`Open ${upiAppDetails?.name} mobile app and approve payment of`}</h2>

        <p className="text-gray-800 mt-2 text-center font-bold text-2xl">{formatPrice(upiAppDetails.amount, true, false)}</p>
        <div className="mt-6 flex items-center">
          <span className="text-gray-500">Approve payment within</span>
          <div className="mt-3">
            <CountDownTimer source="paymentStatus" expiryTimestamp={futureDate} />
          </div>
        </div>
        {showUpiIntentBtn && (
          <div className="mt-20">
            <p>{t("appNotLaunched") || "App not launched?"}</p>
            <button
              onClick={() => {
                handlePaymentAdobeClick();

                window.location = upiIntentFlowUrl;
              }}
              className="mt-5 relative w-full text-sm flex justify-evenly items-center text-white font-semibold uppercase px-20 py-2 rounded bg-ctaImg"
            >
              {`${t("open") || "Open"} ${upiAppDetails.name}`}
            </button>
          </div>
        )}
        <div className="absolute bottom-0 p-7	bg-gray-200 w-full flex items-center justify-center">
          <img src={getStaticUrl("/global/images/secureIcon.png")} alt="secure icon" />
          <p className="font-bold text-gray-500 ml-3">100 % Secure Payments </p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentStatusScreen;
