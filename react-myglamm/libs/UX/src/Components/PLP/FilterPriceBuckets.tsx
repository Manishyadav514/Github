import React from "react";

import useTranslation from "@libHooks/useTranslation";

import Tickmark from "../../../public/svg/check-mark.svg";
import { formatPrice } from "@libUtils/format/formatPrice";

export interface PriceBuckets {
  priceRange: Array<{ priceOffer: { between: Array<number> } }>;
  setPriceRange: (arg1: Array<{ priceOffer: { between: Array<number> } }>) => void;
}

const FilterPriceBuckets = ({ priceRange, setPriceRange }: PriceBuckets) => {
  const { t } = useTranslation();
  const priceBuckets = t("filterPriceRange");

  function checkIsSeclected(price: any) {
    return priceRange.find(
      (x: any) =>
        x.priceOffer?.between[0] === price.minAmount &&
        (x.priceOffer?.between[1] === price.maxAmount || x.priceOffer?.between[1] === 1000000)
    );
  }

  const selectPriceRange = (price: any) => {
    if (checkIsSeclected(price)) {
      setPriceRange(priceRange.filter((x: any) => x.priceOffer?.between[0] !== price.minAmount));
    } else {
      setPriceRange([
        ...priceRange,
        {
          priceOffer: {
            between: [price.minAmount, price.maxAmount || 1000000],
          },
        },
      ]);
    }
  };

  return (
    <div>
      {priceBuckets?.map((price: any) => {
        const isSelected = checkIsSeclected(price);
        return (
          <button
            type="button"
            key={price.minAmount}
            onClick={() => selectPriceRange(price)}
            className="w-full px-5 py-4 border-b border-gray-300 flex outline-none"
          >
            <Tickmark className="mt-1" width="12px" height="12px" fill={isSelected ? "#ff9999" : "#ebebeb"} />
            <label className={`text-xs ml-4 tracking-widest ${isSelected ? "font-semibold" : ""}`}>
              {formatPrice(price.minAmount, true)} {price.maxAmount ? formatPrice(price.maxAmount, true) : "✚"}`
            </label>
          </button>
        );
      })}
    </div>
  );
};

export default FilterPriceBuckets;
