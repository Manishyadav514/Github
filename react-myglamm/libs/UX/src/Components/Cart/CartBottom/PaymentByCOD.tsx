import React, { useEffect } from "react";
import PayShippingAddress from "@libComponents/Payments/PayShippingAddress";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { formatPrice } from "@libUtils/format/formatPrice";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useRouter } from "next/router";
import Arrow from "../../../../public/svg/rightArrowWhite.svg";
import UpArrow from "../../../../public/svg/up-arrow.svg";
import { GiCash2Ico1 } from "@libComponents/GlammIcons";
import { useCreateOrder } from "@checkoutLib/Payment/useCreateOrder";
import PaymentSpinner from "@libComponents/Payments/PaymentSpinner";
import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";

const PaymentByCOD = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const payableAmount = useSelector((store: ValtioStore) => store.cartReducer.cart.payableAmount);
  const isPaymentProcessing = useSelector((store: ValtioStore) => store.paymentReducer.isPaymentProcessing);

  const { handleCreateOrder } = useCreateOrder();

  useEffect(() => {
    return () => {
      PAYMENT_REDUCER.isPaymentProcessing = false;
    };
  }, []);

  if (isPaymentProcessing) return <PaymentSpinner />;

  return (
    <div className="bg-white px-2.5 py-2">
      <PayShippingAddress showExpectedDeliveryStrip={false} displayExpectedDelivery={false} />
      <div className="w-full flex justify-between">
        {/* COD payment method */}
        <div className="px-2">
          <div onClick={() => router.push("/payment")} className="flex justify-between">
            <GiCash2Ico1
              className="inline"
              width="20px"
              height="20px"
              fill="#01c717"
              viewBox="0 50 500 700"
              role="img"
              aria-labelledby="Cash On Delivery"
            />

            <span className="gray-200 text-xs font-bold text-gray-400 ml-2">Payment Method</span>
            <UpArrow className="ml-3 mt-1" />
          </div>
          <div className="flex items-center justify-center mt-1">
            <div className="font-bold text-sm text-center ">{t("cod")}</div>
          </div>
        </div>

        <button
          onClick={() => handleCreateOrder("cash")}
          className="text-sm flex relative items-center text-white font-semibold uppercase py-3.5 px-7 justify-evenly bg-ctaImg rounded _analytics-gtm-place-order"
        >
          {t("placeOrder")}
          <Arrow className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PaymentByCOD;
