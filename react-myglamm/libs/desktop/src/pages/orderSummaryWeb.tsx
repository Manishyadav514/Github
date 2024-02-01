import React, { useEffect, useState } from "react";
import { format } from "date-fns";

import Link from "next/link";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { getLocalStorageValue, removeLocalStorageValueOnOrderPlaced } from "@libUtils/localStorage";

import { OrderPurchaseEvent, initoOrderSummaryEvent } from "@libAnalytics/OrderSummary.Analytics";

import Breadcrumbs from "../Components/breadcrumb";
import Head from "next/head";

const SummaryShare = dynamic(() => import("../Components/orderSummary/SummaryShare"), { ssr: false });

const SummaryEarnedPoints = dynamic(() => import("../Components/orderSummary/SummaryEarnedPoints"), { ssr: false });

const OrderSummaryWeb = () => {
  const { query } = useRouter();
  const { t } = useTranslation();

  const orderStatus = query?.status;

  const paymentStatus = query.paymentStatus;

  const [orderDetails, setOrderDetails] = useState<any>();

  useEffect(() => {
    const orderData = getLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, true);

    if (orderData) {
      setOrderDetails(orderData);
    } else {
      Router.push("/");
    }
  }, []);

  useEffect(() => {
    if (paymentStatus !== "inPending") {
      initoOrderSummaryEvent(orderStatus as string);
      removeLocalStorageValueOnOrderPlaced(orderStatus as string);
    }
  }, [orderStatus, paymentStatus]);

  useEffect(() => {
    if (orderStatus === "success") {
      OrderPurchaseEvent();
    }
  }, []);

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const noOfProducts =
    (orderDetails?.products?.length || 0) +
      (orderDetails?.preProduct?.length || 0) +
      (orderDetails?.freeProducts?.length || 0) || 2;

  const firstProductName =
    (orderDetails?.products?.length && orderDetails.products?.[0]?.name) ||
    (orderDetails?.preProduct?.length && orderDetails.preProduct?.[0]?.name);

  return (
    <main className="bg-white">
      <Head>
        <title>{t("orderSummary")}</title>
        <meta property="og:title" content={t("orderSummary")} />
      </Head>

      {orderStatus === "failed" ? (
        <section className="py-48 text-center">
          <div className="successfully-box">
            <div className="successfully-sec">
              <h2>
                <img
                  src="https://files.myglamm.com/site-images/original/pending-image.png"
                  alt="awaiting"
                  width="40"
                  className="mx-auto mb-6"
                />
                <span className="text-4xl font-bold">{t("awaitConfirmationBank")}</span>
              </h2>
              <p>
                {t("thankShopping")}! {t("OrderNumberText")} {orderDetails?.orderNumber || "0000"}.
                <br />
                &nbsp;{t("emailTextAt")}&nbsp;
                {orderDetails?.userInfo?.email || "yourname@email.com"}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <div className="max-w-screen-xl mx-auto px-20">
          <Breadcrumbs navData={[{ name: t("orderConfirmation") || "Order Confirmation" }]} />

          <div className="w-full p-5 py-6 border border-gray-200 rounded shadow mb-6 flex justify-between mt-4">
            <div className="w-4/5 pr-10">
              <h2 className="flex items-center text-22 mb-4">
                <img
                  alt="sign"
                  width="31"
                  className="mr-3"
                  src="https://files.myglamm.com/site-images/original/img-order-confirm.png"
                />
                {t("orderSuccess")?.toUpperCase()}
              </h2>

              <p className="mb-4 text-15">
                {t("thankShopping")}! {t("yourOrder")} {firstProductName}
                &nbsp;
                {noOfProducts > 1 && `& ${noOfProducts - 1} ${t("moreItems")}`} {t("moreItemText")}
              </p>

              <p className="text-gray-400 uppercase text-13 font-bold mb-1">{t("expectedDeliveryDate")}:</p>

              <p className="flex font-bold text-15 tracking-wide">
                {firstProductName}
                &nbsp;
                {noOfProducts > 1 && `+ ${noOfProducts - 1} more`}
              </p>
              {orderDetails?.expectedDeliveryDate && (
                <p className="text-sm">{format(new Date(orderDetails?.expectedDeliveryDate), "do MMM, yyyy")}</p>
              )}
            </div>

            <Link
              href="my-orders"
              className="bg-ctaImg w-1/5 uppercase flex items-center justify-center font-bold text-white px-4 h-12 rounded-sm text-sm"
            >
              {t("view/manageOrder") || "view or manage order"}
            </Link>
          </div>

          <div className="flex justify-between gap-4">
            {SHOP.IS_MYGLAMM && <SummaryEarnedPoints unitPrice={orderDetails?.paymentDetails.orderAmount} />}

            {userProfile?.id && <SummaryShare />}
          </div>
        </div>
      )}
    </main>
  );
};

export default OrderSummaryWeb;
