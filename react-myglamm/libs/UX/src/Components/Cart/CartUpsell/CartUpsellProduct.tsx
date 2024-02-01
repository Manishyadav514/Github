import React from "react";

import { ICartUpsellProduct } from "@typesLib/Cart";

import CartUpsellProductV2 from "./CartUpsellProductV2";
import CartUpsellProductV1 from "./CartUpsellProductV1";

const CartUpsellProduct = ({
  product,
  loader,
  handleAddToBag,
  openMiniPdpModal,
  variants,
  variantTagsFlag,
  isScrollTogether,
}: ICartUpsellProduct) => {
  return (
    <>
      {variants?.glammClubUpsell === "1" ? (
        <CartUpsellProductV2
          product={product}
          loader={loader}
          handleAddToBag={handleAddToBag}
          openMiniPdpModal={openMiniPdpModal}
          isScrollTogether={isScrollTogether}
          variantTagsFlag={variantTagsFlag}
        />
      ) : (
        <CartUpsellProductV1
          product={product}
          loader={loader}
          handleAddToBag={handleAddToBag}
          openMiniPdpModal={openMiniPdpModal}
          isScrollTogether={isScrollTogether}
          variantTagsFlag={variantTagsFlag}
        />
      )}
    </>
  );
};

export default CartUpsellProduct;
