import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "@libHooks/useValtioSelector";
import hi from "date-fns/locale/hi";
import format from "date-fns/format";
import useTranslation from "@libHooks/useTranslation";
import { ValtioStore } from "@typesLib/ValtioStore";
import TruckIcon from "../../../public/svg/icon-truck-3.svg";
import { getExpectedDeliveryVariant } from "@checkoutLib/Payment/HelperFunc";
import { useSplit } from "@libHooks/useSplit";

const ExpectedDelivery = () => {
  const { t } = useTranslation();

  const { locale } = useRouter();

  const variant = getExpectedDeliveryVariant();

  const { minDeliveryDate, maxDeliveryDate, expectedDeliveryDate, shippingMessage } = useSelector((store: ValtioStore) => ({
    minDeliveryDate: store.paymentReducer.expectedDelivery?.minDeliveryDate,
    maxDeliveryDate: store.paymentReducer.expectedDelivery?.maxDeliveryDate,
    expectedDeliveryDate: store.cartReducer.cart.expectedDeliveryDate,
    shippingMessage: store.paymentReducer.shippingMessage,
  }));

  const variants = useSplit({
    experimentsList: [{ id: "shippingMessage", condition: shippingMessage !== undefined }],
    deps: [shippingMessage],
  });

  return (
    <div>
      <div className="flex items-center justify-between px-4 pb-2 pt-4 text-xs border-t border-gray-200">
        <p className="font-semibold flex">
          <TruckIcon className="mr-3 w-6 h-4" role="img" aria-labelledby="expected delivery date" />
          {t("expectedDeliveryDate")}
        </p>
        <span className="text-xs">
          {variant === "0" &&
            format(expectedDeliveryDate, "dd MMM yyyy", {
              locale: locale === "hi-in" ? hi : undefined,
            })}

          {variant === "1" &&
            `${minDeliveryDate ? minDeliveryDate : "Estimating. . ."} ${maxDeliveryDate && minDeliveryDate ? "-" : ""} ${
              maxDeliveryDate ? maxDeliveryDate : ""
            }`}

          {variant === "2" && (minDeliveryDate ? minDeliveryDate : "Estimating. . .")}

          {variant === "3" && (maxDeliveryDate ? maxDeliveryDate : "Estimating. . .")}
        </span>
      </div>
      {shippingMessage && variants?.shippingMessage === "1" && (
        <div className="text-xs px-4 pb-3">
          <span className="text-color1 uppercase">Note: </span>
          {shippingMessage}
        </div>
      )}
    </div>
  );
};

export default ExpectedDelivery;
