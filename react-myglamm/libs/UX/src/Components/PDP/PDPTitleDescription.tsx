import { PDPProd } from "@typesLib/PDP";
import React from "react";

const PDPTitleDescription = ({ product }: { product: PDPProd }) => {
  return (
    <div className="px-4 pt-3 pb-2" >
      <h1 className="font-semibold leading-tight capitalize text-base mb-1">{product?.cms[0]?.content?.name?.slice(0,145)}</h1>
      {/* <h2 className="text-xs text-gray-600 pr-2  leading-tight capitalize line-clamp-1">{product?.cms[0]?.content.subtitle}</h2> */}
    </div>
  );
};

export default PDPTitleDescription;
