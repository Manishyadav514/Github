import React, { useState } from "react";

import PDPRecommendedProduct from "@libComponents/PDP/PDPRecommendedProduct";

import { PDPProd } from "@typesLib/PDP";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import { PDP_ICID } from "@productLib/pdp/PDP.constant";

import PopupModal from "./PopupModal";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

interface SimilarProdProps {
  similarProductModal: boolean;
  product: PDPProd;
}

const PDPSimilarProductsModal = ({ similarProductModal, product }: SimilarProdProps) => {
  const [showLoader, setShowLoader] = useState(true);

  const hideModal = () => {
    PDP_STATES.modalStates.similarProductModal = false;
    setTimeout(() => setShowLoader(true), 500);
  };

  return (
    <PopupModal show={similarProductModal} onRequestClose={hideModal}>
      <div className="px-2 pt-2 pb-5 rounded-t-3xl overflow-y-scroll  bg-white" style={{ height: "370px" }}>
        {showLoader && <LoadSpinner />}

        <div className="bg-white">
          <PDPRecommendedProduct
            icid={PDP_ICID}
            product={product}
            hideLoader={() => setShowLoader(false)}
            setShowSimilarProductModal={hideModal}
          />
        </div>
      </div>
    </PopupModal>
  );
};

export default PDPSimilarProductsModal;
