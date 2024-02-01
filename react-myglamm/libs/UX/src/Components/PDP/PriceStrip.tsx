import React from "react";

import { formatPrice } from "@libUtils/format/formatPrice";

const PriceStrip = ({
  productPrice,
  productOfferPrice,
  isCouponApplicable,
  isDiscountedPercentage,
}: {
  productPrice: number;
  productOfferPrice: number;
  isCouponApplicable: boolean;
  isDiscountedPercentage: boolean;
}) => {
  return (
    <>
      <span className="font-semibold mr-1 text-sm">Best Price :</span>
      <span className="font-semibold mr-1.5 text-22">{formatPrice(productOfferPrice, true)}</span>
      {(isDiscountedPercentage || isCouponApplicable) && (
        <del className="text-sm text-gray-400 mr-1">{formatPrice(productPrice, true)}</del>
      )}
    </>
  );
};

export default PriceStrip;
