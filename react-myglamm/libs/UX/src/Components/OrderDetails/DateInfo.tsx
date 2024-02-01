import React from "react";
import format from "date-fns/format";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";

const DateInfo = ({ orderInfo }: any) => {
  const { t } = useTranslation();
  const { paymentDetails } = orderInfo;
  return (
    <div className="flex justify-between mb-4">
      <div className="text-xs">
        <p className="text-black">{orderInfo && format(new Date(orderInfo.orderPlaced), "do MMM, yyyy")}</p>
        <p style={{ color: "#939393" }}>
          {t("orderId")} : {orderInfo && orderInfo.orderNumber}
        </p>
      </div>
      <div>
        <p className="text-xs text-black">{t("bagAmount")}</p>
        <p className="text-right text-sm text-black font-bold">
          {formatPrice(paymentDetails.grossAmount - paymentDetails.additionalDiscount, true)}
        </p>
      </div>
    </div>
  );
};

export default DateInfo;
