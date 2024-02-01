import React from "react";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { formatPrice } from "@libUtils/format/formatPrice";

const OrderSummaryProducts = ({ product, free = false }: any) => (
  <div className="flex py-2 pl-4 pr-4 border-b border-gray-200" key={product.productId}>
    <ImageComponent src={product.imageUrl} alt={product.name} className="w-20 h-20" />
    <div className="text-sm w-3/4 pr-1 pl-3 text-left">
      <p className="font-semibold truncate text-xs">{product.name}</p>
      <p className="truncate" style={{ fontSize: "11px", opacity: ".7" }}>
        {product.subtitle}
      </p>
      <p className="capitalize opacity-25 my-2 text-left font-semibold text-xs h-4">{product.shadeLabel || ""}</p>
      <div className="flex items-center tracking-wider ">
        {free ? (
          <span className="font-semibold">FREE</span>
        ) : (
          <>
            {formatPrice(product.offerPrice, true)}
            {product.offerPrice < product.price && (
              <del className="text-xxs text-gray-500">{formatPrice(product.price, true)}</del>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);

export default OrderSummaryProducts;
