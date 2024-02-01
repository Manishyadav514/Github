import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import useTranslation from "@libHooks/useTranslation";

import { OrderStatuses } from "@libDesktop/Constants/User.constant";

const OrderStatus = ({ order, estDeliveryDate, statusId, orderDelivered }: any) => {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState({
    confirmedPulse: false,
    statusPulse: false,
    deliveredPulse: false,
  });
  const [status, setStatus] = useState("Awaiting...");
  const isBucketVariant = "deliveryDateExperimentVariant" in order.meta;
  const [isShipped, setIsShipped] = useState(false);
  const minDeliveryDate = order?.dsMinExpectedDeliveryDate
    ? format(new Date(order?.dsMinExpectedDeliveryDate?.split("T")[0]), "do MMM, yyyy")
    : "";
  const maxDeliveryDate = order?.dsMaxExpectedDeliveryDate
    ? format(new Date(order?.dsMaxExpectedDeliveryDate?.split("T")[0]), "do MMM, yyyy")
    : "";

  const estimatedDeliveryDate = format(new Date(estDeliveryDate.split("T")[0]), "do MMM, yyyy");
  const variant = isBucketVariant ? order.meta.deliveryDateExperimentVariant : "0";

  useEffect(() => {
    switch (statusId) {
      case 12: {
        setStatus(t("readyToShip"));
        setPulse({ ...pulse, confirmedPulse: true });
        break;
      }
      case 14: {
        setStatus(OrderStatuses[statusId].label);
        setPulse({
          ...pulse,
          statusPulse: true,
        });
        setIsShipped(true);
        break;
      }
      case 15: {
        setStatus(OrderStatuses[statusId].label);
        setPulse({
          ...pulse,
          confirmedPulse: false,
          statusPulse: false,
          deliveredPulse: true,
        });

        break;
      }
      case 72:
      case 74: {
        setStatus(OrderStatuses[statusId].label);
        setPulse({ ...pulse, statusPulse: true });
        break;
      }
      case 75: {
        setStatus(t("outForDelivery"));
        setPulse({
          ...pulse,
          statusPulse: true,
        });
        break;
      }
      default: {
        setStatus(OrderStatuses[statusId].label);
        setPulse({
          ...pulse,
        });
      }
    }
  }, []);

  return (
    <div className="w-full py-2.5">
      <div style={{ borderRight: "1px solid rgb(211, 211, 211)" }}>
        <div style={{ width: "284px" }} className="mx-auto relative h-5">
          <div className="absolute left-0 z-10">
            <div className="flex items-center justify-center rounded-full w-2.5 h-2.5 mt-0.5 bg-white border-gray-300 border">
              <div className={`rounded-full w-1.5 h-1.5 bg-color1 ${pulse.confirmedPulse ? "pulse" : ""}`} />
            </div>
            <p className={`absolute text-xs mt-0.5 -left-6 ${statusId === 12 ? "font-bold" : ""}`}>{t("confirmed")}</p>
          </div>
          <div className="absolute text-center inset-x-0 mx-auto w-20">
            <div
              className={`flex mx-auto rounded-full h-3.5 w-3.5 border border-gray-300 mb-1 bg-white items-center justify-center ${
                pulse.statusPulse ? "pulse" : ""
              }`}
            >
              <div className={`rounded-full w-2.5 h-2.5 ${pulse.statusPulse ? "bg-color1" : "bg-gray-300"}`} />
            </div>
            <p className={`absolute m-auto inset-x-0 text-xs ${pulse.confirmedPulse ? "" : "font-semibold"}`}>{status}</p>
          </div>
          <div className="absolute right-0 w-16">
            <div
              className={`flex border border-gray-300 items-center mb-1 ml-auto rounded-full w-3.5 h-3.5 bg-white justify-center ${
                pulse.deliveredPulse ? "pulse" : ""
              }`}
            >
              <div className="rounded-full w-2.5 h-2.5 bg-gray-300" />
            </div>
            <p
              className={`${variant === "1" ? "w-28 -left-4" : "w-20 left-2.5"} ${
                pulse.confirmedPulse ? "" : "font-semibold"
              } text-center absolute text-xs`}
            >
              {variant === "0" && estimatedDeliveryDate}
              {variant === "1" &&
                (isBucketVariant
                  ? !isShipped
                    ? minDeliveryDate.slice(0, minDeliveryDate.length - 6) +
                      " - " +
                      maxDeliveryDate.slice(0, maxDeliveryDate.length - 6)
                    : estimatedDeliveryDate
                  : estimatedDeliveryDate)}

              {variant === "2" &&
                (isBucketVariant ? (!isShipped ? minDeliveryDate : estimatedDeliveryDate) : estimatedDeliveryDate)}

              {variant === "3" &&
                (isBucketVariant ? (!isShipped ? maxDeliveryDate : estimatedDeliveryDate) : estimatedDeliveryDate)}

              <span className="block text-10">{orderDelivered ? t("delivered") : t("estDelivery")}</span>
            </p>
          </div>
          {!orderDelivered && (
            <div style={{ position: "relative" }}>
              <div className="orderTrack" style={{ position: "relative" }}>
                <span
                  className={`absolute h-0.5 top-2 left-0.5 ${
                    pulse.statusPulse || pulse.deliveredPulse ? "bg-color1 w-1/2" : ""
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>
        {`
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(250, 182, 181, 0.7);
            }

            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(250, 182, 181, 0);
            }

            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(250, 182, 181, 0);
            }
          }

          .pulse {
            box-shadow: 0 0 0 0 rgba(255, 177, 66, 1);
            animation: pulse 2s infinite;
          }

          .orderTrack:after {
            position: absolute;
            left: 0;
            right: 0;
            border: 1px dashed #d8d6d6;
            top: 7px;
            content: "";
          }
        `}
      </style>
    </div>
  );
};

export default OrderStatus;
