import React, { useState } from "react";
import { v4 as uuid4 } from "uuid";
import dynamic from "next/dynamic";

import { useSelector } from "@libHooks/useValtioSelector";

import useWislist from "@libHooks/useWishlist";

import { PLPProduct } from "@typesLib/PLP";
import { ValtioStore } from "@typesLib/ValtioStore";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import FilledHeart from "../../../public/svg/filledPinkHeart.svg";
import EmptyHeart from "../../../public/svg/pinkTransparentHeart.svg";

const LoginModal = dynamic(() => import("@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

interface WishlistBtn {
  product: PLPProduct;
  activeShadeId?: string;
  TLstyle: { btn: string; svg?: string };
}

const PLPWishlistButton = ({ product, activeShadeId, TLstyle }: WishlistBtn) => {
  const { userWishlist, userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const { btn, svg } = TLstyle;

  const { addProduct, removeProduct, wishlistAdobeOnClick, gaAddtoWishlist } = useWislist(false);

  const [loginModal, setLoginModal] = useState<boolean | undefined>();

  const prodId = activeShadeId || product.productId;

  const adobeProduct = [
    {
      PWP: "",
      hasTryOn: product.meta?.tryItOn,
      isPreOrder: product.meta?.isPreProduct,
      productDiscountedPrice: product.priceMRP - product.priceOffer,
      productOfferPrice: product.priceOffer,
      productPrice: product.priceMRP,
      productQuantity: 1,
      productRating: product.rating?.avgRating,
      productSKU: product.SKU,
      productTotalRating: product.rating?.totalCount,
      stockStatus: product.meta?.inStock ? "in stock" : "out of stock",
    },
  ];

  const handleButton = (wishlistState: string, wishlist: any, productAdded = false) => {
    if (userProfile) {
      sessionStorage.setItem(SESSIONSTORAGE.FB_EVENT_ID, uuid4());
      wishlist(prodId).then(() => {
        wishlistAdobeOnClick(wishlistState, adobeProduct, product.subCategory);
        /* Only fire GA event when product is added to the Wishlist */
        if (productAdded) {
          addToWishlistGAEvent(product);
        }
      });
    } else {
      setLoginModal(true);
    }
  };

  // #region // *WebEngage [16] - Product Add To Wishlist - PDP Page : GA Function
  const addToWishlistGAEvent = (product: any) => {
    const productData = {
      productId: product.productId,
      sku: product.SKU,
      productName: product.productName,
      shadeLabel: product.shadeLabel,
      productTag: product.subCategory,
      slug: product.URL,
      imageUrl: product.imageURL,
      price: product.priceMRP,
      offerPrice: product.priceOffer,
      brandName: product.brandName,
      productMeta: {
        isPreOrder: product.meta?.isPreProduct,
        showInParty: false,
      },
      type: product.type,
    };

    gaAddtoWishlist(productData, product.subCategory || "");
  };

  return (
    <React.Fragment>
      {userWishlist?.find((x: any) => x === prodId) ? (
        <button
          type="button"
          className={`absolute bg-transparent outline-none ${btn}`}
          onClick={() => handleButton("remove from wishlist", removeProduct)}
        >
          <FilledHeart className={svg} role="img" aria-labelledby="wishlist" />
        </button>
      ) : (
        <button
          type="button"
          className={`absolute bg-transparent z-20 outline-none ${btn}`}
          onClick={() => handleButton("add to wishlist", addProduct, true)}
          aria-label="wishlist"
        >
          <EmptyHeart className={svg} role="img" aria-labelledby="wishlist" title="wishlist" />
        </button>
      )}

      {typeof loginModal === "boolean" && (
        <LoginModal
          show={loginModal}
          onSuccess={() => handleButton("add to wishlist", addProduct)}
          onRequestClose={() => {
            setLoginModal(false);
          }}
          hasGuestCheckout={false}
        />
      )}
    </React.Fragment>
  );
};

export default PLPWishlistButton;
