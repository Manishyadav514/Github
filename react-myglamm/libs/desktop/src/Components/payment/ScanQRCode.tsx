import React, { useEffect, useRef } from "react";

import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";

import OrderAPI from "@libAPI/apis/OrderAPI";

import CustomTimer from "../customTimer";

const ScanQRCode = ({ qrCodeUrl }: { qrCodeUrl: string }) => {
  const router = useRouter();

  const getOrderStatus = useRef<any>();

  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + 5 * 60000);

  const upiAppsIcons = [
    "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/google-pay-logo-BFDEA14F81-seeklogo.com@3x.png",
    "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Group-8199@3x.png",
    "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Group-13451@3x.png",
    "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Group-13452@3x.png",
  ];

  useEffect(() => {
    const orderId = localStorage.getItem("orderId");

    if (orderId) fetchOrderStatus(orderId);
  }, []);

  /* fetch order status during UPI intent flow */
  const fetchOrderStatus = async (id: string) => {
    let count = 0;
    getOrderStatus.current = setInterval(async () => {
      try {
        const orders = new OrderAPI();

        const result = await orders.getOrderStatus(id).catch(error => {
          console.error("error", error);
          clearInterval(getOrderStatus.current);
          router.push("/order-summary?status=failed");
        });

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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <span className="text-2xl text-center">Pay with UPI QR</span>
      <div className="p-2 mt-5 border border-gray-200">
        <QRCodeSVG value={qrCodeUrl} size={250} />
      </div>
      <span className="mt-3 w-72 text-center text-2xl">Scan the QR with any UPI app on your phone</span>
      <div className="flex items-center mt-5">
        {upiAppsIcons.map((icon: string, index: number) => (
          <img src={icon} key={index} alt="" className="w-11 h-11 mr-4" />
        ))}
      </div>
      <div className="flex items-center mt-5">
        <span className="font-bold text-center"> Complete payment before</span> <CustomTimer expiryTimestamp={futureDate} />
      </div>
    </div>
  );
};

export default ScanQRCode;
