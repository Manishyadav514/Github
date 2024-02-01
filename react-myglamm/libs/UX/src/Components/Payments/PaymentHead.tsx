import React, { Fragment } from "react";

import Head from "next/head";
import Script from "next/script";

import useTranslation from "@libHooks/useTranslation";

import { usePaymentOnMount } from "@checkoutLib/Payment/usePaymentOnMount";

import { SHOP } from "@libConstants/SHOP.constant";

import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";

const PaymentHead = () => {
  const { t } = useTranslation();

  usePaymentOnMount();

  return (
    <Fragment>
      <Head>
        <title>{t("payment")}</title>
        <meta property="og:title" content={t("payment")} />

        {!SHOP.ENABLE_JUSPAY && (
          <>
            <link rel="preconnect" href="https://cdn.razorpay.com" crossOrigin="" />
            <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="" />
          </>
        )}
      </Head>

      {process.env.NEXT_PUBLIC_JUSPAY_SCRIPT && (
        <Script
          type="text/javascript"
          strategy="beforeInteractive"
          src={process.env.NEXT_PUBLIC_JUSPAY_SCRIPT}
          onReady={() => {
            PAYMENT_REDUCER.juspayLoaded = true;
          }}
        />
      )}
    </Fragment>
  );
};

export default PaymentHead;
