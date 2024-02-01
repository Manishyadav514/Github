import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import PaymentAPI from "@libAPI/apis/PaymentAPI";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { showError } from "@libUtils/showToaster";
import { getClientQueryParam } from "@libUtils/_apputils";
import { setLocalStorageValue } from "@libUtils/localStorage";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import ScanQRCode from "../Components/payment/ScanQRCode";

const ProcessOrder = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQRCodeUrl] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState(false);

  const token = getClientQueryParam("token") as string;
  const paymentMethod = getClientQueryParam("method") as string;

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web| order checkout| mark order cod`,
        newPageName: `payment pending`,
        subSection: "order checkout step5",
        assetType: "order summary",
        newAssetType: "order summary",
        platform: "desktop website",
        pageLocation: "",
        technology: "react",
      },
    };
  }, []);

  useEffect(() => {
    if (paymentMethod === "upi") {
      handleGeneratePaymentLink();
    } else {
      handleProcessOrder();
    }
  }, [paymentMethod, token]);

  const handleGeneratePaymentLink = async () => {
    const paymentApi = new PaymentAPI();
    await paymentApi
      .generateUpiPaymentLink(token)
      .then(data => {
        const { newPaymentLinkGenerated, orderDetails } = data.data.data;

        setLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, orderDetails, true);

        if (newPaymentLinkGenerated) {
          const intentUrl = orderDetails?.paymentDetails?.paymentMode?.[0]?.gatewayResponse?.logs?.data?.intentUrl;

          setQRCodeUrl(intentUrl);
          setShowQRCode(true);
        } else {
          router.push("/order-summary?status=success");
        }
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);

        showError(err.response?.data?.message || err);
        router.push("/");
      });
  };

  const handleProcessOrder = async () => {
    const paymentApi = new PaymentAPI();
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
      });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen">
        <LoadSpinner />
      </div>
    );
  }

  if (showQRCode) {
    return <ScanQRCode qrCodeUrl={qrCodeUrl} />;
  }

  return null;
};

export default ProcessOrder;
