import React, { useState } from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { PaymentOrder } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";

import { formatPrice } from "@libUtils/format/formatPrice";

import { useCreateOrder } from "@checkoutLib/Payment/useCreateOrder";

import PaymentListing from "./PaymentListing";
import PaymentMethods from "./PaymentMethods";

const OtherPaymentModesWeb = dynamic(() => import("./OtherPaymentModesWeb"), { ssr: false });

const PaymentScreenWeb = () => {
  const { t } = useTranslation();

  const { paymentOrder, cart } = useSelector((store: ValtioStore) => ({
    paymentOrder: store.paymentReducer.paymentOrder,
    cart: store.cartReducer.cart,
  }));

  const { handleCreateOrder, removeBinSeries } = useCreateOrder(true, paymentOrder);

  const isBinSeries = cart.binSeriesData?.paymentMethods?.value?.length;

  const [activePayment, setActivePayment] = useState<PaymentOrder>(
    (paymentOrder?.find(x => x.autoExpand) || paymentOrder?.[0]) as PaymentOrder
  );

  return (
    <div className="flex justify-between px-4 pb-4">
      <PaymentListing activePayment={activePayment} setActivePayment={setActivePayment} />

      <section className="w-4/5 pr-4 pl-20">
        <div className="bg-paymentBg font-bold px-4 py-5 text-18 flex items-center justify-between mb-5 rounded border border-black">
          <span className="uppercase">{t("amountPayable")}</span> <span>{formatPrice(cart.payableAmount, true, false)}</span>
        </div>

        <PaymentMethods payment={activePayment} handleCreateOrder={handleCreateOrder} />

        {isBinSeries && <OtherPaymentModesWeb removeBinSeries={removeBinSeries} />}
      </section>
    </div>
  );
};

export default PaymentScreenWeb;
