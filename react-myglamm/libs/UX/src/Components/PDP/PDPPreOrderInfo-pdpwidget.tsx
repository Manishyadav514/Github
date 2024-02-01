import React from "react";

import { PDPProd } from "@typesLib/PDP";

import { getStaticUrl } from "@libUtils/getStaticUrl";

export default function PDPPreOrderInfo({ product }: { product: PDPProd }) {
  const productTagArray = [
    "Treat Love Care 24 HR Anti-Pollution Foundation",
    "Treat Love Care - 24HR Anti-Pollution Foundation",
    "Treat Love Care Brightening Foundation",
    "Treat Love Care Age Defying Foundation",
    "Treat Love Care Oil Control Foundation",
  ];

  if (!(product.productMeta?.isPreOrder && product.productMeta?.preOrderDetails?.shortDescription)) {
    return null;
  }

  const style = {
    height: "21px",
    backgroundPosition: "0px -400px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "80px",
    backgroundImage: `url(${getStaticUrl("/global/images/ico-pdp-sprite.png")})`,
  };

  return (
    <div className={`PreOrderInfo bg-white ${productTagArray.includes(product.productTag) ? "mb-2" : "my-2"}`}>
      <div className="flex h-auto items-center py-2">
        <div className="w-1/6 ml-6 -mt-1" style={style} />
        <div className="w-3/4 text-base -ml-5font-thin">{product.productMeta?.preOrderDetails?.shortDescription}</div>
      </div>
    </div>
  );
}
