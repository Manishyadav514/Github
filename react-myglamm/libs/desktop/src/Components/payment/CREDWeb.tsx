import React, { useState } from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";
import { PaymentMethodProps } from "@typesLib/Payment";

import { formatPrice } from "@libUtils/format/formatPrice";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import DownTimeMessage from "./downTimeMessage";

import OfferTag from "../../../public/svg/offer-tag.svg";

const CREDWeb = ({ handleCreateOrder, payment }: PaymentMethodProps) => {
  const { t } = useTranslation();

  const { CRED } = useSelector((store: ValtioStore) => store.paymentReducer);
  const { payableAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const [loader, setLoader] = useState(false);

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

  return (
    <form name="cred" method="POST" className="form-button-disable has-validation-callback">
      <div className="payment-container pull-left">
        <DownTimeMessage downtimeMsg={payment.downtimes?.message} />

        <div className="flex items-center mb-4">
          <OfferTag className="h-12" />
          <div className="text-xxl ml-4" style={{ color: "#00977b" }}>
            {CRED?.layout?.sub_text ?? ""}
          </div>
        </div>

        <button
          type="button"
          disabled={loader}
          onClick={handleOnSubmit}
          className="bg-ctaImg text-white font-bold h-14 relative w-56 uppercase"
        >
          {t("pay") || "pay"}&nbsp;{formatPrice(payableAmount, true, false)}
          <LoadSpinner className="m-auto w-10 inset-0 absolute" />
        </button>
      </div>
    </form>
  );
};

export default CREDWeb;
