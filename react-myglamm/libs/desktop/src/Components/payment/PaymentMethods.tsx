import React from "react";
import dynamic from "next/dynamic";

import { PaymentMethodProps } from "@typesLib/Payment";

import { SHOP } from "@libConstants/SHOP.constant";

import { useFetchRazorPayDetails } from "@checkoutLib/Payment/useFetchRazorPayDetails";

const UPIWeb = dynamic(() => import("./UPIWeb"), { ssr: false });
const CODWeb = dynamic(() => import("./CODWeb"), { ssr: false });
const CREDWeb = dynamic(() => import("./CREDWeb"), { ssr: false });
const TwidWeb = dynamic(() => import("./TwidWeb"), { ssr: false });
const WalletsWeb = dynamic(() => import("./WalletsWeb"), { ssr: false });
const CardPayment = dynamic(() => import("./cardPayment"), { ssr: false });
const NetBankingWeb = dynamic(() => import("./NetBankingWeb"), { ssr: false });
const JPDebitCreditCard = dynamic(() => import("./JPDebitCreditCard"), { ssr: false });

const PaymentMethods = (props: PaymentMethodProps) => {
  const { payment } = props;

  useFetchRazorPayDetails();

  switch (payment.name) {
    case "UPI":
      return <UPIWeb {...props} />;

    case "CARD":
    case "creditCard":
      if (SHOP.ENABLE_JUSPAY) {
        return <JPDebitCreditCard {...props} />;
      }
      return <CardPayment {...props} />;

    case "netBanking":
    case "NB":
      return <NetBankingWeb {...props} />;

    case "COD":
    case "CASH":
      return <CODWeb {...props} />;

    case "wallets":
    case "WALLET":
      return <WalletsWeb {...props} />;

    case "CRED":
      return <CREDWeb {...props} />;

    case "Pay with Rewards":
      return <TwidWeb {...props} />;

    default:
      return null;
  }
};

export default PaymentMethods;
