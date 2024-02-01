import React from "react";
import { useSnapshot } from "valtio";

import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import StarFilled from "../../../public/svg/star-gold.svg";

const PDPDecoyPricing = () => {
  const { t } = useTranslation();

  const { pdpOffers, selectedDecoyProduct } = useSnapshot(PDP_STATES);

  return (
    <section className="RecentlyViewProduct mt-2 pt-3">
      <ul
        className="px-4 overflow-x-auto flex list-none mb-0.5"
        dir="ltr"
        style={{
          scrollSnapType: "x mandatory",
        }}
      >
        {pdpOffers.decoyPricing?.map((product: any, index: number) => {
          return (
            <li
              key={index}
              className={`mr-2 pb-4 rounded-lg ${!product?.tag?.includes("MOST POPULAR") ? "mt-6" : ""}`}
              style={{
                width: product.offerPrice < product.price ? "fit-content" : "155px",
              }}
            >
              {product?.tag?.includes("MOST POPULAR") && (
                <span className="flex items-center w-4/5 h-6 bg-ctaImg font-bold rounded-t-lg">
                  <StarFilled width={12} height={12} className="ml-1.5" />
                  <h2 className="text-white font-bold ml-1 mt-0.5 tracking-wider shadow-none text-[10px]">
                    {t("mostPopular") || "Most Popular"}
                  </h2>
                </span>
              )}
              <div
                className={`
                ${
                  selectedDecoyProduct?.id === product.id
                    ? `border-2 border-color1 ${
                        product?.tag?.includes("MOST POPULAR") ? "rounded-tr-lg" : "rounded-t-lg"
                      } rounded-b-lg`
                    : "shadow-lg pb-1 rounded-lg"
                }`}
                onClick={() => {
                  PDP_STATES.showBestOffer = selectedDecoyProduct?.showBestOffer;
                  PDP_STATES.selectedDecoyProduct = product;
                }}
              >
                <span
                  className={`flex items-center w-58 h-9 bg-color2 border font-bold ${
                    product?.tag?.includes("MOST POPULAR") ? "rounded-tr-lg" : "rounded-t-lg"
                  } `}
                >
                  <h2 className="ml-2 mt-1 text-sm font-bold tracking-wide ">Pack of {product?.quantity}</h2>
                </span>
                <div className="mt-2 mb-1">
                  <span className="font-semibold mx-2 mr-1 mt-2">{formatPrice(product?.offerPrice, true, true)}</span>
                  {product.offerPrice < product.price && (
                    <del className="text-xs text-gray-400 ml-1">{formatPrice(product?.price, true, true)}</del>
                  )}
                </div>
                <div className="pb-1 pr-2 whitespace-nowrap">
                  <span className="font-medium mx-2">
                    ({formatPrice(product?.unitOfferPrice, true, true)}/{t("unit") || "Unit"})
                  </span>
                  {product.offerPrice < product.price && (
                    <span className="text-xs font-bold" style={{ color: "#FF8185" }}>
                      {t("priceOffPercentage", [
                        Math.round(((product?.price - product?.offerPrice) / product?.price) * 100).toString(),
                      ])}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
export default PDPDecoyPricing;
