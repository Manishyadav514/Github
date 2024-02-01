import PaymentAPI from "@libAPI/apis/PaymentAPI";
import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE_REDUCER, PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { formatPrice } from "@libUtils/format/formatPrice";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { showError } from "@libUtils/showToaster";
import { getClientQueryParam } from "@libUtils/_apputils";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import PaymentLinkExpired from "@libComponents/Payments/PaymentLinkExpired";

const PaymentSpinner = dynamic(() => import("@libComponents/Payments/PaymentSpinner"), { ssr: false });
const OrderPending = dynamic(() => import("@libComponents/OrderSummary/OrderPending"), { ssr: false });
const PaymentStatusScreen = dynamic(() => import("@libComponents/Payments/PaymentStatusScreen"), { ssr: false });

const ProcessOrder = () => {
  const router = useRouter();
  const paymentApi = new PaymentAPI();

  const token = getClientQueryParam("token") as string;

  const paymentMethod = getClientQueryParam("method") as string;

  const paymentType = getClientQueryParam("type") as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isOrderPending, setIsOrderPending] = useState(false);
  const [upiPaymentStatus, setUpiPaymentStatus] = useState<boolean>(false);
  const [paymentLinkExpired, setPaymentLinkExpired] = useState(false);

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web| order checkout| mark order cod`,
        newPageName: `payment pending`,
        subSection: "order checkout step5",
        assetType: "order summary",
        newAssetType: "order summary",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);

    if (paymentMethod === "upi" && paymentType) {
      handleGenerateUpiPaymentLink();
    } else if (paymentMethod === "razorpay" && paymentType === "codtoonline") {
      handleCODToOnline();
    } else {
      handleProcessOrder();
    }
  }, [paymentMethod, token]);

  /* Order conversion through UPI */
  const handleGenerateUpiPaymentLink = async () => {
    await paymentApi
      .generateUpiPaymentLink(token, paymentType)
      .then(data => {
        const { newPaymentLinkGenerated, orderDetails } = data.data.data;
        setLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, orderDetails, true);

        if (newPaymentLinkGenerated) {
          const intentUrl = orderDetails?.paymentDetails?.paymentMode?.[0]?.gatewayResponse?.logs?.data?.intentUrl;
          setIsLoading(false);

          console.log("intentUrl", intentUrl);

          /* send total order amount */
          PAYMENT_REDUCER.upiAppDetails = {
            name: "Upi",
            amount: formatPrice(orderDetails?.paymentDetails?.orderAmount),
            imageUrl: "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Group-13452@3x.png",
          };

          /* dispatch Upi intent url to launch the app */
          PAYMENT_REDUCER.upiIntentFlowUrl = intentUrl;

          /* launch the intent URL */
          window.location.href = intentUrl;

          setUpiPaymentStatus(true);
        } else {
          router.push("/order-summary?status=pending");
        }
      })
      .catch((err: any) => {
        console.error(err);
        setIsLoading(false);
        showError(err.response.data.message, 3500);
        setTimeout(() => {
          router.push("/");
        }, 3500);
      });
  };

  /* Order conversion through COD */
  const handleProcessOrder = async () => {
    await paymentApi
      .orderConversionThroughPaymentLink(token)
      .then(data => {
        setLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, data.data.data.orderDetails, true);
        setIsLoading(false);
        router.push("/order-summary?status=success");
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        setIsOrderPending(true);
      });
  };

  /* Convert COD to Online */
  const handleCODToOnline = async () => {
    await paymentApi
      .convertCODOrderToOnline(token, paymentMethod, "online")
      .then(data => {
        const paymentLink = data?.data?.data?.orderDetails?.paymentDetails?.paymentMode.find(
          (mode: any) => mode.type === "online"
        )?.paymentLink;

        if (paymentLink) {
          setIsLoading(false);
          router.push(paymentLink);
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
        setPaymentLinkExpired(true);
      });
  };

  if (isLoading) {
    return <PaymentSpinner />;
  }

  if (isOrderPending) {
    return <OrderPending />;
  }

  if (upiPaymentStatus) {
    return <PaymentStatusScreen />;
  }

  if (paymentLinkExpired) {
    return <PaymentLinkExpired />;
  }

  return null;
};

ProcessOrder.getLayout = (children: ReactElement) => children;
export default ProcessOrder;
