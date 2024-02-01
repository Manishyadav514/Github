import React, { useState } from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { useFetchBestOffers } from "@libHooks/useFetchBestOffers";

import { ValtioStore } from "@typesLib/ValtioStore";
import { PaymentMethodProps } from "@typesLib/Payment";

import { formatPrice } from "@libUtils/format/formatPrice";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import BestOffers from "./BestOffers";
import DownTimeMessage from "./downTimeMessage";

const TwidWeb = ({ handleCreateOrder, payment }: PaymentMethodProps) => {
  const { t } = useTranslation();

  const { payableAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const { TWID } = useSelector((store: ValtioStore) => store.paymentReducer);

  const [loader, setLoader] = useState(false);

  const { bestOffer, offerApplicable } = useFetchBestOffers({
    paymentMethodType: "REWARD",
  });

  const handleOnSubmit = () => {
    setLoader(true);

    try {
      handleCreateOrder("juspay", {
        method: payment.data?.[0]?.code,
      });
    } catch {
      setLoader(false);
    }
  };

  const getPayableAmount = () => {
    let amount: number;

    const balance = TWID?.balance as number;
    if (balance > 0) {
      amount = payableAmount - balance;

      return `₹${amount}`;
    }

    if (balance > 0 && offerApplicable && bestOffer && bestOffer.effective_amount) {
      amount = payableAmount - balance - parseInt(bestOffer.effective_amount);
      return formatPrice(amount, true, false);
    }

    if (balance === 0 && offerApplicable && bestOffer && bestOffer.effective_amount) {
      amount = payableAmount - parseInt(bestOffer.effective_amount);
      return formatPrice(amount, true, false);
    }
    return formatPrice(payableAmount, true, false);
  };

  return (
    <form name="twid" method="POST" className="form-button-disable has-validation-callback">
      <div className="payment-container pull-left">
        <DownTimeMessage downtimeMsg={payment.downtimes?.message} />

        <BestOffers offers={bestOffer} showOfferTag styledInParagraphTag={false} />

        <input type="hidden" name="payment_method" value="1" />

        <button
          type="button"
          disabled={loader}
          onClick={handleOnSubmit}
          className="bg-ctaImg text-white font-bold h-14 relative w-56 uppercase mt-4"
        >
          {t("pay") || "pay"}&nbsp;{getPayableAmount()}
          <LoadSpinner className="m-auto w-10 inset-0 absolute" />
        </button>
      </div>
    </form>
  );
};

export default TwidWeb;
