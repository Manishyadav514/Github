import React from "react";

import useTranslation from "@libHooks/useTranslation";

import OrderSuccessSimple from "@libComponents/OrderSummary/OrderSuccessSimple";

import OrderSummaryCommon from "@libComponents/OrderSummary/OrderSucessCommon";

interface orderSummaryProps {
  orderDetails: any;
  orderStatus: string;
}

const OrderSuccessBBC = ({ orderStatus, orderDetails }: orderSummaryProps) => {
  const { t } = useTranslation();

  if (t("surveyRewards")?.[0]?.couponCode === orderDetails?.paymentDetails?.discountCode) {
    return <OrderSuccessSimple orderDetails={orderDetails} />;
  }

  return <OrderSummaryCommon orderDetails={orderDetails} orderStatus={orderStatus} />;
};

export default OrderSuccessBBC;
