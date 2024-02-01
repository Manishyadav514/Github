import React, { useEffect, useState } from "react";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { formatPrice } from "@libUtils/format/formatPrice";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import { PARTNERSHIP_STATE } from "@libStore/valtio/PARTNERSHIP.store";

const CouponToaster = () => {
  const [discountAmount, setDiscountAmount] = useState(
    getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_PRODUCT_TAG, true)?.[0]?.discountAmount
  );

  useEffect(() => {
    if (discountAmount)
      setDiscountAmount(getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_PRODUCT_TAG, true)?.[0]?.discountAmount);
  }, []);

  if (!discountAmount) return null;

  return (
    <div className="px-3 py-1 sticky bottom-14 bg-color2 z-50">
      <div className="flex">
        <div className="w-7 h-7">
          <img src="https://files.myglamm.com/site-images/original/couponSuccess.gif" alt="Coupon_Success" />
        </div>
        <p className="text-xs ml-1 flex items-center">
          <span className="items-center text-xs font-semibold text-green-600 mr-2">Coupon Applied!</span> You saved{" "}
          <b className="mx-1">{formatPrice(discountAmount, true)}</b>with this Coupon Code.
        </p>
      </div>
    </div>
  );
};

export default CouponToaster;
