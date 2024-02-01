import { formatPrice } from "@libUtils/format/formatPrice";
import React from "react";

const FilterNoProducts = ({ price, t }: any) => (
  <div className="bg-white mr-2">
    <span className="flex justify-center px-8 pt-4 text-center text-gray-800 text-lg">{t("noProductFound")}</span>
    {price?.length === 1 && (
      <span className="flex justify-center pb-4 text-center text-gray-800 text-lg">
        {t("between")} {formatPrice(price[0].priceOffer?.between[0], true)} &amp;
        {formatPrice(price[0].priceOffer?.between[1], true)}
      </span>
    )}
    <div className="no-result-found-img  position-relative">
      <span className="eye one" />
      <span className="eye two" />
      <img
        alt="no-result-found"
        title="no-result-found"
        src="https://files.myglamm.com/site-images/original/img-no-result-found.jpg"
      />
      <div className="fishing-rop" />
      <div className="fish" />
      <div className="fish two" />
    </div>
  </div>
);

export default FilterNoProducts;
