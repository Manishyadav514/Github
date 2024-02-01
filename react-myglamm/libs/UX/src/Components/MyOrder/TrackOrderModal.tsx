import React, { useState, useEffect } from "react";
import format from "date-fns/format";
import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";

import { ValtioStore } from "@typesLib/ValtioStore";

import PopupModal from "../PopupModal/PopupModal";
import OrderAPI from "@libAPI/apis/OrderAPI";

type TrackModalProps = {
  show: boolean;
  onRequestClose: (e?: any) => void;
  orderId: string;
  userId: string;
  expectedDelivery: string;
  trackingId: string;
};

const TrackOrderModal = ({ show, onRequestClose, orderId, userId, expectedDelivery, trackingId }: TrackModalProps) => {
  const [trackData, setTrackData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (show) {
      const orderApi = new OrderAPI();
      orderApi.getOrderTrackingDetails(userId, orderId).then(res => {
        const trackingData = res.data.data.filter((data: any) => data.userType !== "goddam");
        setTrackData(trackingData);
      });
    }
  }, [show]);

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <div className="bg-white pb-4 w-full" style={{ borderRadius: "20px 20px 0 0" }}>
        <div className="flex w-full p-5 mb-5" style={{ borderBottom: "1px solid #d3d3d3" }}>
          <p className="text-left text-sm w-4/5 font-light">
            {t("trackingId")} <strong className="font-semibold">{trackingId}</strong>
          </p>
          <button
            style={{
              height: "0.6rem",
              width: "0.6rem",
              backgroundSize: "0.6rem 0.6rem",
              backgroundRepeat: "no-repeat",
              backgroundImage: "url(https://files.myglamm.com/site-images/original/ic-close.png)",
              outline: "none",
            }}
            type="button"
            onClick={onRequestClose}
            className=" ml-20 mt-1 text-transparent"
          >
            .
          </button>
        </div>
        {trackData.length > 0 ? (
          <div
            className="p-6 pt-3 overflow-auto"
            style={{
              maxHeight: "20rem",
            }}
          >
            <div className="pb-5 ml-6 relative leading-snug">
              <div
                className="rounded-full flex absolute z-30"
                style={{
                  background: "#d3d3d3",
                  height: "10px",
                  width: "10px",
                  top: "0.4rem",
                  left: "-1.5rem",
                }}
              />
              <div
                className="rounded-full flex absolute bg-white z-20"
                style={{
                  border: "1px solid #d3d3d3",
                  height: "14px",
                  width: "14px",
                  top: "0.25rem",
                  left: "-1.6rem",
                }}
              />
              <strong className="text-xs font-semibold">{t("estimatedDelivery")}</strong>
              <p className="text-xsfont-thin">{format(new Date(expectedDelivery.split("T")[0]), "h mm a | do MMM, yyyy")}</p>
            </div>
            {trackData.map((data: any) => (
              <div key={data.id} className="pb-5 ml-6 mt-6 relative leading-snug">
                <div
                  className="rounded-full flex absolute z-30"
                  style={{
                    background: "#fab6b5",
                    height: "14px",
                    width: "14px",
                    top: "0.4rem",
                    left: "-1.6rem",
                  }}
                />
                <div
                  className="pulse rounded-full flex absolute bg-white h-5 w-5 z-20"
                  style={{
                    border: "1px solid #d3d3d3",
                    top: "0.2rem",
                    left: "-1.8rem",
                  }}
                />
                <div
                  className="absolute h-20 z-0"
                  style={{
                    borderLeft: "1px solid #d3d3d3",
                    borderLeftStyle: "dashed",
                    top: "-4.3rem",
                    left: "-1.25rem",
                  }}
                />
                <strong className="text-xs font-semibold">{data.scan}</strong>
                <p className="text-xsfont-thin">
                  {format(new Date(data.scanDate), "h mm a | do MMM, yyyy")} | {data.scannedLocation}
                </p>
              </div>
            ))}
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
        ) : (
          <p className="text-sm font-thin pl-6 pt-4">{t("trackingDataCurrentlyUnavailable")}</p>
        )}
      </div>
    </PopupModal>
  );
};

export default TrackOrderModal;
