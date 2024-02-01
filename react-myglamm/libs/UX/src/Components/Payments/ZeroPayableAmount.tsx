import React from "react";

import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";

import ZeroAmountIcon from "../../../public/svg/zero-amount-order.svg";

interface zeroPayProps {
  handleCreateOrder: (type: "cash") => void;
}

const ZeroPayableAmount = ({ handleCreateOrder }: zeroPayProps) => {
  const { t } = useTranslation();

  return (
    <div
      style={{ height: "60vh" }}
      className="relative flex flex-col justify-center items-center text-center bg-white shadow-checkout pb-16"
    >
      <p className="font-semibold w-7/12 text-lg">
        <ZeroAmountIcon className="mx-auto mb-3" />
        {t("zeroPayableAmount") || `No payment required for this order as the payable amount is ${formatPrice(0, true)}.`}
      </p>

      <button
        type="button"
        onClick={() => handleCreateOrder("cash")}
        className="absolute bottom-4 w-11/12 text-sm text-white font-semibold uppercase px-4 py-4 mt-6 rounded bg-ctaImg"
      >
        {t("confirmPlaceOrder")}
      </button>
    </div>
  );
};

export default ZeroPayableAmount;
