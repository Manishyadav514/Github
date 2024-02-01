import React from "react";
import format from "date-fns/format";
import { SHOP } from "@libConstants/SHOP.constant";
import { formatPrice } from "@libUtils/format/formatPrice";

const OrderPaymentDetails = ({ orderInfo, t, invoiceUrl, invoiceError }: any) => {
  const { paymentDetails } = orderInfo;
  return (
    <React.Fragment>
      <div className="flex mb-3">
        <div className="text-sm" style={{ marginRight: "47px" }}>
          <h6 style={{ color: "#c5c5c5" }}>{t("amountPayable")}</h6>
          <p className="font-bold">{formatPrice(paymentDetails.orderAmount, true)}</p>
        </div>

        <div className="text-sm">
          <h6 style={{ color: "#c5c5c5" }}>{t("glammCoinsText") || "Glamm Coins"}</h6>
          <p className="font-bold">{formatPrice(paymentDetails?.rewardPoints, true, false)}</p>
        </div>
      </div>
      <div className="text-sm mb-5">
        <h6 style={{ color: "#c5c5c5" }}>{t("modeOfPayment")}</h6>
        <p className="font-bold">
          {paymentDetails.paymentMode.map((mode: any) => (
            <span className="capitalize pr-1" key={mode?.type}>
              {mode?.type}
            </span>
          ))}
        </p>
      </div>
      {orderInfo && orderInfo.invoiceNumber && (
        <div className="flex justify-between items-center">
          <div className="text-sm mb-3">
            <h6 style={{ color: "#c5c5c5" }}>{t("invoiceNo")}</h6>
            <p className="font-bold">{orderInfo.invoiceNumber}</p>
          </div>
          {orderInfo?.meta?.orderEditVariant === "1" && orderInfo?.statusId === 12 && (
            <div className="flex items-center space-x-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                transform="rotate(0)"
              >
                <path d="m8 12 4 4 4-4" stroke="#ff9797" strokeWidth="2.16" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12 16V4M19 17v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17"
                  stroke="#ff9797"
                  strokeWidth="2.16"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
              </svg>
              <a
                href={invoiceUrl}
                target="_blank"
                rel="noreferrer noopner"
                aria-label={invoiceUrl && !invoiceError ? t("viewInvoice") : "Generating Invoice..."}
              >
                <div className="uppercase text-sm text-color1 font-semibold">
                  {invoiceUrl && !invoiceError ? t("getInvoice") || "Get Invoice" : "Generating Invoice..."}
                </div>
              </a>
            </div>
          )}
        </div>
      )}
      <div className="text-sm mb-5">
        <h6 style={{ color: "#c5c5c5" }}>{t("orderDate")}</h6>
        <p className="font-bold">{orderInfo && format(new Date(orderInfo.orderPlaced), "do MMM, yyyy")}</p>
      </div>
    </React.Fragment>
  );
};

export default OrderPaymentDetails;
