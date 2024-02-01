import useTranslation from "@libHooks/useTranslation";
import React from "react";

const PDPCouponExpireTime = ({ dayRemains }: any) => {
  const { t } = useTranslation();
  return (
    <p className="text-xxs text-gray-400 mt-2">
      {dayRemains === 0
        ? t("expireToday") || "Expire today"
        : dayRemains === 1
        ? t("expireInDay") || `Expire in 1 day`
        : t("expiresInDays", [dayRemains?.toString()]) || `Expires in ${dayRemains} days`}
    </p>
  );
};

export default PDPCouponExpireTime;
