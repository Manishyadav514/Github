import React from "react";

import { PDPProd } from "@typesLib/PDP";

import BundleProduct from "./BundleProduct";

const PDPBundleProduct = ({ bundleProducts, product }: { product: PDPProd; bundleProducts: any }) => {
  return (
    <section className="PDPBundleProduct mt-2 py-3 mb-2">
      <BundleProduct comboProduct={bundleProducts} parentProduct={product} />
    </section>
  );
};

export default PDPBundleProduct;
