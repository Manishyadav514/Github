import React, { useEffect, useState } from "react";

import useTranslation from "@libHooks/useTranslation";

import { formatPrice, getCurrencySymbol } from "@libUtils/format/formatPrice";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

const SummaryEarnedPoints = ({ unitPrice }: { unitPrice: number }) => {
  const { t } = useTranslation();

  const [cashbackPoints, setCashbackPoints] = useState(0);

  useEffect(() => {
    if (unitPrice) {
      const productApi = new ProductAPI();
      const { memberId } = checkUserLoginStatus() || {};
      productApi
        .getGPOnPDP({ unitPrice, id: memberId || "", isGuestUser: !memberId })
        .then(({ data: res }) => setCashbackPoints(res.data.commissionEarnings));
    }
  }, [unitPrice]);

  return (
    <div className="px-5 pt-6 border border-gray-200 rounded shadow mb-6 mt-4 text-center w-1/2">
      <h6 className="text-sm font-bold mt-2 mb-5">{t("youEarned")}</h6>

      <p className="font-bold text-6xl mb-4">{formatPrice(cashbackPoints)}</p>

      <p className="font-bold text-18 mb-4">{t("myglammPoints")}</p>
      <p className="mb-5 text-18">
        1 {t("myglammPoints")} = {getCurrencySymbol()}1
      </p>

      <div className="text-gray-400 border-t border-gray-300 py-1 w-full text-xs mx-auto">*{t("creditOnDelivery")}</div>
    </div>
  );
};

export default SummaryEarnedPoints;
