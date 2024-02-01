import React from "react";
import dynamic from "next/dynamic";
import { useSnapshot } from "valtio";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import { PDPProd } from "@typesLib/PDP";

import SimilarProductIcon from "../../../public/svg/similar-product.svg";

const PDPSimilarProductsModal = dynamic(
  () => import(/* webpackChunkName: "SimilarProductModal" */ "@libComponents/PopupModal/PDPSimilarProductsModal"),
  { ssr: false }
);

const SimilarProductButton = ({ PDPProduct }: { PDPProduct: PDPProd }) => {
  const { similarProductModal } = useSnapshot(PDP_STATES).modalStates;

  return (
    <>
      <div className="flex bg-white px-3 pt-1.5">
        <button
          onClick={() => (PDP_STATES.modalStates.similarProductModal = true)}
          className="flex justify-between items-center px-2 gap-1 rounded-3xl bg-color2 leading-4 text-10 py-1 uppercase font-semibold opacity-80"
        >
          <SimilarProductIcon />
          <p>View Similar</p>
        </button>
      </div>

      {typeof similarProductModal === "boolean" && (
        <PDPSimilarProductsModal similarProductModal={similarProductModal} product={PDPProduct} />
      )}
    </>
  );
};

export default SimilarProductButton;
