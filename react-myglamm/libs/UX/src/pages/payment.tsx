import React, { ReactElement } from "react";

import Head from "next/head";

import { useSelector } from "@libHooks/useValtioSelector";

import PaymentLayout from "@libLayouts/PaymentLayout";

import PaymentHead from "@libComponents/Payments/PaymentHead";
import PaymentScreen from "@libComponents/Payments/PaymentScreen";
import PaymentSkeleton from "@libComponents/Skeleton/PaymentSkeleton";

import { ValtioStore } from "@typesLib/ValtioStore";

const Payment = () => {
  const { cart, shippingAddress, paymentOrder } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    shippingAddress: store.userReducer.shippingAddress,
    paymentOrder: store.paymentReducer.paymentOrder,
  }));

  return (
    <main className="payment p-2">
      <PaymentHead />

      <Head>
        <style>
          {`
          details, .payShadow {
            box-shadow: 1px 1px 10px #ddd;
          }
          summary:after {
            line-height: 1;
            margin: auto 0;
            margin-top: 8px;
            content: "";
            height: 10px;
            width: 10px;
            color: #9b9b9b;
            border-bottom: 2px solid currentColor;
            border-right: 2px solid currentColor;
            -webkit-transition: all 0.3s ease;
            transition: all 0.3s ease;
            float: right;
            display: inline-block;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
            transform-origin: center;
            margin-right: 16px;
          }
          details[open] summary:after {
            content: "";
            -moz-transform: rotate(-135deg);
            -ms-transform: rotate(-135deg);
            transform: rotate(-135deg);
          }
          .suggestedPayment summary:after, details[open].suggestedPayment summary:after {
            content: unset;
          }
        `}
        </style>
      </Head>

      {shippingAddress && cart.identifier && paymentOrder ? <PaymentScreen /> : <PaymentSkeleton />}
    </main>
  );
};

Payment.getLayout = (page: ReactElement) => <PaymentLayout>{page}</PaymentLayout>;

export default Payment;
