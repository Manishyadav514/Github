import React from "react";
import dynamic from "next/dynamic";
import TryOnIcon from "../../../../public/svg/try-on.svg";
import ShareIcon from "../../../../public/svg/share-icon.svg";
import ViewSimilarIcon from "../../../../public/svg/view-similar.svg";
import { PDPProd } from "@typesLib/PDP";

import { useRouter } from "next/router";
import { adobeOnTryonBtnClick } from "@productLib/pdp/PDPTryonAnalytics";
import { useSnapshot } from "valtio";
import { PDP_STATES, PDP_VARIANTS } from "@libStore/valtio/PDP.store";
import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

const PDPSimilarProductsModal = dynamic(
  () => import(/* webpackChunkName: "SimilarProductModalV2" */ "./PDPSimilarProductsModalV2"),
  { ssr: false }
);

const PDPTopIcons = ({ product }: { product: PDPProd }) => {
  const router = useRouter();
  const { childCategoryName, subChildCategoryName } = product?.categories;
  const { similarProductModal } = useSnapshot(PDP_STATES).modalStates;

  const openShareModal = () => {
    const firstImage = product?.assets?.find(product => product.type === "image");
    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: product?.urlShortner?.shortUrl,
      productName: product?.cms[0]?.content?.name,
      slug: product?.urlShortner?.slug,
      module: "product",
      image: firstImage?.imageUrl?.["200x200"],
    };
  };

  return (
    <>
      <span className="absolute right-4 top-2" onClick={openShareModal}>
        <ShareIcon />
      </span>

      <span className="absolute left-4 bottom-2" onClick={() => (PDP_STATES.modalStates.similarProductModal = true)}>
        <ViewSimilarIcon />
      </span>

      {product.inStock && product.productMeta?.tryItOn && (
        <span
          aria-hidden
          onClick={() => {
            adobeOnTryonBtnClick(childCategoryName, subChildCategoryName, "pdp");
            router.push(`/tryon/pdp${product.urlShortner?.slug || product.urlManager?.url}`);
          }}
          className="absolute right-4 bottom-2"
        >
          <TryOnIcon />
        </span>
      )}

      {typeof similarProductModal === "boolean" ? (
        <PDPSimilarProductsModal similarProductModal={similarProductModal} product={product} />
      ) : null}
    </>
  );
};

export default PDPTopIcons;
