import { PDPProd } from "@typesLib/PDP";
import React from "react";
import PDPPrice from "./PDPPriceV2";
import PDPTopRating from "./PDPTopRating";

const PDPPriceAndRating = ({ product }: { product: PDPProd }) => {
  return (
    <section className="px-4 pb-1">
      <PDPTopRating product={product} />
      <PDPPrice product={product} />
    </section>
  );
};

export default PDPPriceAndRating;
