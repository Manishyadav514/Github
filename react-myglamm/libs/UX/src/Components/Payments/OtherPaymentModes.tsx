import React, { Fragment } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import { userCart } from "@typesLib/Cart";
import { ValtioStore } from "@typesLib/ValtioStore";

import { updateCart } from "@libStore/actions/cartActions";

import { formatPrice } from "@libUtils/format/formatPrice";

const OtherPaymentModes = ({ removeBinSeries }: { removeBinSeries: () => Promise<userCart> }) => {
  const { couponData, netAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const handleRemoveBinSeries = () => {
    removeBinSeries().then(cart => {
      if (cart) updateCart(cart);
    });
  };

  return (
    <Fragment>
      <h2 className="font-bold text-gray-600 mb-2 mt-5">Other Payment Mode</h2>
      <button
        type="button"
        onClick={handleRemoveBinSeries}
        style={{ boxShadow: "1px 1px 10px #ddd" }}
        className="flex justify-between items-center bg-white p-4 text-left rounded"
      >
        <div className="w-2/3">
          <p className="font-bold my-1">Pay Using Other Modes</p>
          <p className="text-sm text-red-600 leading-6">
            Coupon code {couponData?.couponCode} is not applicable for other payment method.
          </p>
        </div>
        <span className="font-semibold">Pay {formatPrice(netAmount, true, false)}</span>
      </button>
    </Fragment>
  );
};

export default OtherPaymentModes;
