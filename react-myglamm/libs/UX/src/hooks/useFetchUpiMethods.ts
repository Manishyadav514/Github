import React, { useEffect, useState } from "react";
import { Downtimes, PaymentOrder, UpiData } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";
import { SHOP } from "@libConstants/SHOP.constant";
import { useFetchBestOffers } from "./useFetchBestOffers";

export const useFetchUpiMethod = () => {
  const paymentOrder = useSelector((store: ValtioStore) => store.paymentReducer.paymentOrder);

  const [upiList, setUpiList] = useState<UpiData[]>([]);
  const [downTimes, setDownTimes] = useState<Downtimes>();

  /* get best offers for UPI */
  const { bestOffer } = useFetchBestOffers({ paymentMethodType: "UPI" });

  useEffect(() => {
    if (paymentOrder && SHOP.ENABLE_JUSPAY) {
      const getUpiData = paymentOrder.find((paymentOrder: PaymentOrder) => paymentOrder.active && paymentOrder.name === "UPI");

      const list = getUpiData?.data?.filter((bank: any) => getUpiData?.fields.includes(bank.code) && bank.code !== "CRED_UPI");

      setUpiList(list);

      setDownTimes(getUpiData?.downtimes);
    }
  }, [paymentOrder, bestOffer]);

  return { upiList, downTimes, upiIntentOffers: bestOffer?.upi_offers?.intent ?? [], bestOffer };
};
