import React from "react";

import useTranslation from "@libHooks/useTranslation";

const OrdersDisclaimer = () => {
  const { t } = useTranslation();

  const { message, imageSrc } = t("myOrdersDisclaimer");

  if (!message) return null;

  return (
    <section className="p-4 bg-yellow-100 border-t border-b border-yellow-300 text-sm mt-1 leading-snug flex">
      {imageSrc && (
        <div className="w-1/6 pr-2 pt-1">
          <img src={imageSrc} alt="warning" className="w-full" />
        </div>
      )}

      {message}
    </section>
  );
};

export default OrdersDisclaimer;
