import React, { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import TwidPay from "./TWID";

import useTranslation from "@libHooks/useTranslation";
import { useFetchRazorPayDetails } from "@checkoutLib/Payment/useFetchRazorPayDetails";
import { useSelector } from "@libHooks/useValtioSelector";

import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

import { PaymentType, PaymentData, PaymentOrder } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";
import { binSeries } from "@typesLib/Cart";

import { DisableEntireUPI } from "./UPI/UpiHelperComponents";
import { getBinSeriesPaymentOrder } from "@checkoutLib/Payment/HelperFunc";
import { getLocalStorageValue } from "@libUtils/localStorage";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { SHOP } from "@libConstants/SHOP.constant";

const GiftCard = dynamic(() => import("./Giftcard"));
const CRED = dynamic(() => import("./CRED"), { ssr: false });
const COD = dynamic(() => import(/* webpackChunkName: "COD" */ "./COD"), { ssr: false });
const UPI = dynamic(() => import(/* webpackChunkName: "UPI" */ "./UPI"), { ssr: false });
const Paytm = dynamic(() => import(/* webpackChunkName: "Paytm" */ "./Paytm"), { ssr: false });
const Simpl = dynamic(() => import(/* webpackChunkName: "Simpl" */ "./Simpl"), { ssr: false });
const Paypal = dynamic(() => import(/* webpackChunkName: "Paypal" */ "./Paypal"), { ssr: false });
const NetBanking = dynamic(() => import(/* webpackChunkName: "NetBanking" */ "./NetBanking"), { ssr: false });
const NetBankingBin = dynamic(() => import(/* webpackChunkName: "NetBankingBin" */ "./NetBankingBin"));
const Wallets = dynamic(() => import(/* webpackChunkName: "Wallets" */ "./Wallets"), {
  ssr: false,
});
const DebitCard = dynamic(() => import(/* webpackChunkName: "DebitCard" */ "./DebitCard"), {
  ssr: false,
});
const JuspayNetBanking = dynamic(() => import(/* webpackChunkName: "JuspayNetBanking" */ "./JuspayNetBanking"), {
  ssr: false,
});

interface PayMethods {
  handleCreateOrder: (type: PaymentType, razorpayMethod?: PaymentData) => void;
}

const PaymentMethods = ({ handleCreateOrder }: PayMethods) => {
  const { t } = useTranslation();

  useFetchRazorPayDetails();

  const [activeTab, setActiveTab] = useState("");

  const { paymentOrder, cart, razorPayData, TWID, CREDData, profile } = useSelector((store: ValtioStore) => ({
    paymentOrder: store.paymentReducer.paymentOrder,
    razorPayData: store.paymentReducer.razorPayData,
    TWID: store.paymentReducer.TWID,
    CREDData: store.paymentReducer.CRED,
    cart: store.cartReducer.cart,
    profile: store.userReducer.userProfile,
  }));

  const isSaveCardPresent = getLocalStorageValue(LOCALSTORAGE.IS_SAVED_CARDS_PRESENT, true);
  /* InCase of Bin Series patch the payment sort for it's specific UI */
  const paymentMethods = getBinSeriesPaymentOrder(cart.binSeriesData as binSeries) || paymentOrder;

  useEffect(() => {
    // find which tab need to be open by default
    if (!isSaveCardPresent) {
      const findAutoEnabledTab = paymentOrder?.find((payment: PaymentOrder) => payment.autoExpand === true)?.name ?? "";
      setActiveTab(findAutoEnabledTab);
    }
  }, [paymentOrder, isSaveCardPresent]);

  useEffect(() => {
    if (profile?.id) {
      // for check if payment methods are present in data
      const isCREDPresent = paymentMethods?.find(method => method.name === "CRED");
      const isSimplPresent = paymentMethods?.find(method => method.name === "SIMPL");
      if (!isCREDPresent?.active) {
        PAYMENT_REDUCER.isCredEligible = false;
      }
      if (!isSimplPresent?.active) {
        PAYMENT_REDUCER.isSimplEligible = false;
        PAYMENT_REDUCER.simplEligibleMessage = "Ineligible";
      }
    } else {
      // setting this to false since  scCheckout and event30 look for boolean value
      PAYMENT_REDUCER.isCredEligible = false;
      PAYMENT_REDUCER.isSimplEligible = false;
      PAYMENT_REDUCER.simplEligibleMessage = "Ineligible";
    }
  }, [paymentMethods, profile?.id]);

  return (
    <Fragment>
      <h2 className="text-gray-400 py-2 text-center text-sm">{t("choosePaymentMethods")}</h2>
      {paymentMethods?.map((payMethod: PaymentOrder) => {
        if (payMethod.active) {
          const { downtimes, fields, name, isBin, gateway, data: bankList } = payMethod;
          const { message } = downtimes || {};
          const { RazorBankList, RazorWallets } = razorPayData || {};

          switch (name) {
            case "COD":
            case "CASH":
              return (
                <COD
                  setActiveTab={setActiveTab}
                  name={name}
                  activeTab={activeTab}
                  handleCreateOrder={handleCreateOrder}
                  key={payMethod.name}
                />
              );

            case "UPI":
              if (downtimes?.status === "DOWN") {
                return <DisableEntireUPI key={payMethod.name} />;
              }
              return (
                <UPI
                  handleCreateOrder={handleCreateOrder}
                  bankOrder={fields}
                  downtimes={downtimes}
                  key={payMethod.name}
                  gateway={gateway}
                  bankList={bankList}
                  setActiveTab={setActiveTab}
                  name={name}
                  activeTab={activeTab}
                />
              );
            case "wallets":
            case "WALLET":
              return (
                <Wallets
                  key={payMethod.name}
                  downtimeMsg={message}
                  handleCreateOrder={handleCreateOrder}
                  //Juspay wallet list
                  walletList={SHOP.ENABLE_JUSPAY ? bankList : undefined}
                  // Razor pay wallets
                  RazorWallets={RazorWallets || []}
                  setActiveTab={setActiveTab}
                  name={name}
                  activeTab={activeTab}
                  bankOrder={fields}
                />
              );
            case "netBanking":
              return (
                <NetBanking
                  key={payMethod.name}
                  bankOrder={fields}
                  downtimeMsg={message}
                  RazorBankList={RazorBankList}
                  handleCreateOrder={handleCreateOrder}
                />
              );
            case "NB":
              return (
                <JuspayNetBanking
                  key={payMethod.name}
                  bankOrder={fields}
                  downtimeMsg={message}
                  bankList={bankList}
                  handleCreateOrder={handleCreateOrder}
                  setActiveTab={setActiveTab}
                  name={name}
                  activeTab={activeTab}
                />
              );

            case "netBankingBin":
              return <NetBankingBin key={payMethod.name} RazorBankList={RazorBankList} handleCreateOrder={handleCreateOrder} />;

            case "SIMPL":
              if (profile?.id) {
                return (
                  <Simpl
                    setActiveTab={setActiveTab}
                    name={name}
                    activeTab={activeTab}
                    handleCreateOrder={handleCreateOrder}
                    key={name}
                  />
                );
              }
              return null;

            case "CARD":
            case "creditCard":
              return (
                <DebitCard
                  key={payMethod.name}
                  isBin={isBin}
                  downtimeMsg={message}
                  handleCreateOrder={handleCreateOrder}
                  RazorBankList={razorPayData?.RazorBankList}
                  setActiveTab={setActiveTab}
                  name={name}
                  activeTab={activeTab}
                />
              );

            case "PAYTM":
              return (
                <Paytm
                  setActiveTab={setActiveTab}
                  name={name}
                  activeTab={activeTab}
                  handleCreateOrder={handleCreateOrder}
                  key={payMethod.name}
                />
              );

            case "PAYPAL":
              return (
                <Paypal
                  setActiveTab={setActiveTab}
                  name={name}
                  activeTab={activeTab}
                  handleCreateOrder={handleCreateOrder}
                  key={payMethod.name}
                />
              );
            case "CRED":
              if (CREDData?.isEligible && profile?.id) {
                return (
                  <CRED
                    setActiveTab={setActiveTab}
                    name={name}
                    activeTab={activeTab}
                    handleCreateOrder={handleCreateOrder}
                    disabled={false}
                    credDetails={payMethod.data?.[0]}
                    downtimeMsg={message}
                    key={payMethod.name}
                  />
                );
              }

              return null;

            case "Pay with Rewards":
              if (TWID?.isEligible && profile?.id) {
                return (
                  <TwidPay
                    setActiveTab={setActiveTab}
                    name={name}
                    activeTab={activeTab}
                    handleCreateOrder={handleCreateOrder}
                    disabled={false}
                    twidDetails={payMethod.data?.[0]}
                    downtimeMsg={message}
                    key={payMethod.name}
                  />
                );
              }

              return null;

            case "giftcard":
              if (!FEATURES.disableQwikcilverGC) {
                return <GiftCard handleCreateOrder={handleCreateOrder} key={name} />;
              }
              return null;

            default:
              return null;
          }
        }

        return null;
      })}
    </Fragment>
  );
};

export default PaymentMethods;
