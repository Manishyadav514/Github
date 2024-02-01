import React, { ReactElement } from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import useAttachCountryAddressFilter from "@libHooks/useAttachCountryAddressFilter";

import { ValtioStore } from "@typesLib/ValtioStore";

import PaymentHead from "@libComponents/Payments/PaymentHead";

import PaySkeletonWeb from "../Components/payment/PaySkeletonWeb";
import PaymentScreenWeb from "../Components/payment/PaymentScreenWeb";
import LowerFunnelLayout from "../Components/layout/LowerFunnelLayout";

const PaymentWeb = () => {
  const { t } = useTranslation();
  const { cart, shippingAddress, paymentOrder } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    shippingAddress: store.userReducer.shippingAddress,
    paymentOrder: store.paymentReducer.paymentOrder,
  }));
  useAttachCountryAddressFilter();
  return (
    <main className="max-w-screen-xl mx-auto">
      <PaymentHead />

      <h1 className="py-6 text-center text-3xl capitalize">{t("payment")}</h1>

      {cart.identifier && shippingAddress && paymentOrder ? <PaymentScreenWeb /> : <PaySkeletonWeb />}
    </main>
  );
};

PaymentWeb.getLayout = (page: ReactElement) => <LowerFunnelLayout>{page}</LowerFunnelLayout>;

export default PaymentWeb;
