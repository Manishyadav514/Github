import React, { Fragment, useState } from "react";

import useTranslation from "@libHooks/useTranslation";
import { useFetchBestOffers } from "@libHooks/useFetchBestOffers";

import PaymentAPI from "@libAPI/apis/PaymentAPI";

import { SHOP } from "@libConstants/SHOP.constant";

import { PaymentMethodProps } from "@typesLib/Payment";

import { showError } from "@libUtils/showToaster";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { isCollectUpiIdDown } from "@libComponents/Payments/UPI/UpiHelperComponents";

import BestOffers from "./BestOffers";
import DownTimeMessage from "./downTimeMessage";

const UPIWeb = ({ handleCreateOrder, payment }: PaymentMethodProps) => {
  const { t } = useTranslation();

  /* get best offers for UPI */
  const { bestOffer } = useFetchBestOffers({
    paymentMethodType: "UPI",
  });

  const [upiVal, setUpiVal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitUPI = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    if (SHOP.ENABLE_JUSPAY) {
      validateJuspayUpi();
    } else {
      handleCreateOrder("razorpay", { method: "upi", vpa: upiVal });
    }
  };

  /* validate UPI id if Juspay is enabled */
  const validateJuspayUpi = () => {
    if (isCollectUpiIdDown(upiVal, payment.downtimes?.unavailablePaymentMethods)) {
      setLoading(false);

      /* display message   */
      const getUpiId = upiVal.split("@")?.[1];
      return showError(`@${getUpiId} is currently disabled due to low success rates.`);
    }

    const paymentApi = new PaymentAPI();
    return paymentApi
      .JuspayValidateUPI(upiVal)
      .then((data: any) => {
        const { status, message } = data.data.data;
        if (status) {
          return handleCreateOrder("juspay", { method: "UPI", vpa: upiVal, upiFlowType: "collect" });
        }

        showError(message);
      })
      .catch(err => {
        showError(err?.response?.data?.message || "Something's Wrong!!! Please Retry");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      <DownTimeMessage downtimeMsg={payment.downtimes?.message || ""} />
      <BestOffers offers={bestOffer} showOfferTag={false} styledInParagraphTag={false} />

      <form className="bg-themeGray rounded-sm flex w-4/5 p-5 pr-20" onSubmit={handleSubmitUPI}>
        <input
          type="email"
          value={upiVal}
          placeholder={t("enterYourUpi")}
          onChange={e => setUpiVal(e.target.value)}
          className="bg-white w-3/4 h-14 px-4 rounded-l-sm"
        />

        <button
          type="submit"
          disabled={upiVal.length < 3 || loading}
          className="bg-ctaImg h-14 w-1/4 text-white uppercase font-bold tracking-wide rounded-r-sm relative"
        >
          {loading && <LoadSpinner className="w-10 inset-0 m-auto absolute" />}
          {t("request") || "request"}
        </button>
      </form>
    </Fragment>
  );
};

export default UPIWeb;
