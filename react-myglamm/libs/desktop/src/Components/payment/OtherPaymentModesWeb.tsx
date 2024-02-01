import React from "react";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useSelector } from "@libHooks/useValtioSelector";

import { formatPrice } from "@libUtils/format/formatPrice";

const OtherPaymentModesWeb = ({ removeBinSeries }: { removeBinSeries: () => void }) => {
  const { couponData, payableAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  return (
    <button type="button" className="w-full bg-white outline-0 mb-40 pr-20" onClick={removeBinSeries}>
      <div className="flex justify-between mt-7">
        <div className="text-left">
          <p className="text-2xl font-bold ml-4">Pay Using Other Modes</p>
          <p className="text-red-400 leading-6 text-xl block ml-4 text-left">
            Coupon code {couponData?.couponCode}
            is not applicable for other payment method.{" "}
          </p>
        </div>

        <p className="font-bold text-2xl">Pay {formatPrice(payableAmount, true, false)}</p>
      </div>
    </button>
  );
};

export default OtherPaymentModesWeb;
