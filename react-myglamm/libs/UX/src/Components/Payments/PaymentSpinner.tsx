import React from "react";

import useTranslation from "@libHooks/useTranslation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

const PaymentSpinner = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center text-center bg-themeGray z-50 fixed inset-0 h-full">
      <LoadSpinner className="w-16 h-16 mx-auto" />
      <h2 className="font-bold text-2xl mt-4">{t("processing") || "Processing"}...</h2>
      <p className="text-gray-800 mt-1">{t("processingMsg") || "Please do not refresh or go back."}</p>
    </div>
  );
};

export default PaymentSpinner;
