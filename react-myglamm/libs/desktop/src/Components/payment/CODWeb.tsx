import React, { Fragment, useState } from "react";

import { PaymentMethodProps } from "@typesLib/Payment";

import useTranslation from "@libHooks/useTranslation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

const CODWeb = ({ handleCreateOrder }: PaymentMethodProps) => {
  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);

  const handleCOD = async () => {
    setLoader(false);

    try {
      await handleCreateOrder("cash");
    } catch {
      setLoader(false);
    }
  };

  return (
    <Fragment>
      <p className="pb-4">{t("codWarning")}</p>

      <button
        type="button"
        onClick={handleCOD}
        className="h-14 bg-ctaImg px-5 rounded-sm text-white font-bold uppercase relative"
      >
        {t("confirmPlaceOrder")}

        {loader && <LoadSpinner className="w-10 absolute inset-0 m-auto" />}
      </button>
    </Fragment>
  );
};

export default CODWeb;
