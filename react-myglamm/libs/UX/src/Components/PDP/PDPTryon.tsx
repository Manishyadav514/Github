import React, { useState } from "react";
import { v4 as uuid4 } from "uuid";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import clsx from "clsx";

import { useSelector } from "@libHooks/useValtioSelector";
import useWislist from "@libHooks/useWishlist";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { PDPProd } from "@typesLib/PDP";
import { ValtioStore } from "@typesLib/ValtioStore";

import { getStaticUrl } from "@libUtils/getStaticUrl";

import { adobeOnTryonBtnClick } from "@productLib/pdp/PDPTryonAnalytics";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import EmptyHeart from "../../../public/svg/wsHeart.svg";
import FilledHeart from "../../../public/svg/filledHeart.svg";

const LoginModal = dynamic(() => import("@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

const TryOnModal = dynamic(() => import(/* webpackChunkName: "TryOnModal" */ "@libComponents/PopupModal/TryOnModal"), {
  ssr: false,
});

const WishListIcon = ({ flashSaleWidgetData, productId, handleButton, removeProduct, addProduct }: any) => {
  console.log("wishlisticon");
  const userWishlist = useSelector((store: ValtioStore) => store.userReducer.userWishlist);
  return (
    <div className={clsx("absolute right-1 mr-3 z-10", flashSaleWidgetData ? "top-14" : "top-8")}>
      {userWishlist?.find((x: any) => x === productId) ? (
        <FilledHeart onClick={() => handleButton("remove from wishlist", removeProduct)} />
      ) : (
        <EmptyHeart onClick={() => handleButton("add to wishlist", addProduct, true)} />
      )}
    </div>
  );
};

function PDPTryon({
  product,
  flashSaleWidgetData,
  disableWishlist = false,
  shadeSelection = false,
}: {
  product: PDPProd;
  shadeSelection?: boolean;
  disableWishlist?: boolean;
  flashSaleWidgetData?: any;
}) {
  const router = useRouter();

  const { childCategoryName, subChildCategoryName } = product?.categories;

  const { addProduct, removeProduct, wishlistAdobeOnClick, gaAddtoWishlist } = useWislist();

  const [isTryon, setIsTryon] = useState<boolean | undefined>();

  const handleButton = (wishlistState: string, callWishlist: any, productAdded = false) => {
    const memberId = localStorage.getItem("memberId");
    if (memberId) {
      sessionStorage.setItem(SESSIONSTORAGE.FB_EVENT_ID, uuid4());
      callWishlist(product.id).then(() => {
        wishlistAdobeOnClick(wishlistState, (window as any).digitalData.product, "", childCategoryName, subChildCategoryName);
        if (productAdded) {
          addToWishlistGAEvent(product);
        }
      });
    } else {
      SHOW_LOGIN_MODAL({
        show: true,
        hasGuestCheckout: false,
        onSuccess: () => handleButton(wishlistState, callWishlist, productAdded),
      });
    }
  };

  const addToWishlistGAEvent = (product: PDPProd) => {
    const productData = {
      productId: product.id,
      sku: product.sku,
      productName: product.cms?.[0]?.content?.name || product.productTag,
      shadeLabel: product.cms?.[0]?.attributes?.shadeLabel,
      productTag: product.productTag,
      slug: product.urlManager?.url,
      imageUrl: product.assets?.[0]?.imageUrl?.["200x200"],
      price: product.price,
      offerPrice: product.offerPrice,
      brandName: product.brand.name,

      productMeta: {
        isPreOrder: product.productMeta?.isPreOrder,
        showInParty: product.productMeta?.showInParty,
      },
      type: product.type,
    };
    gaAddtoWishlist(productData, product?.categories.childCategoryName);
  };

  return (
    <div className="">
      {!disableWishlist && (
        <WishListIcon
          flashSaleWidgetData={flashSaleWidgetData}
          productId={product.id}
          handleButton={handleButton}
          removeProduct={removeProduct}
          addProduct={addProduct}
        />
      )}
      <div className="flex justify-center">
        <div className={`absolute ${shadeSelection ? "top-5" : "top-0"} z-20`}>
          {product.inStock && product.productMeta?.tryItOn && (
            <div>
              <div
                aria-hidden
                onClick={() => {
                  adobeOnTryonBtnClick(childCategoryName, subChildCategoryName, "pdp");
                  router.push(`/tryon/pdp${product?.urlShortner?.slug || product?.urlManager?.url}`);
                }}
                className="relative mx-auto h-9 w-24 border border-color1  rounded-full flex justify-between items-center shadow-xl"
              >
                <div className="w-6 h-6 ml-4">
                  <img src={getStaticUrl("/images/tryonicon.gif")} />
                </div>
                <div className="text-color1 font-semibold text-xs absolute right-1 mr-1.5">TRY ON</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {typeof isTryon === "boolean" && (
        <TryOnModal show={isTryon} onRequestClose={() => setIsTryon(false)} shortUrl={product?.urlShortner?.shortUrl} />
      )}
    </div>
  );
}

export default PDPTryon;
