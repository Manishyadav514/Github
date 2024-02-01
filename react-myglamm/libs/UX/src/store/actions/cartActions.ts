import { cartCustomRepsonseLayer } from "@checkoutLib/Cart/HelperFunc";

import { SHOP } from "@libConstants/SHOP.constant";

import { CART_REDUCER } from "@libStore/valtio/REDUX.store";

import { isWebview } from "@libUtils/isWebview";
import { bbcActionCallback } from "@libUtils/bbcWVCallbacks";

function bbcWVCartCountUpdate(count: number) {
  if (typeof count !== "undefined" && SHOP.SITE_CODE === "bbc") {
    /* Callback to Babychakra App */
    if (isWebview()) return bbcActionCallback("updateCartCount", { count });

    /* Callback to Babychakra web */
    try {
      const iframe = document.getElementById("login_iframe") as HTMLIFrameElement;

      if (iframe.contentWindow) iframe.contentWindow.postMessage(JSON.stringify({ key: "cart_count", value: count }), "*");
    } catch {
      /* handled failure */
    }
  }
}

const commonLogic = (data: any) => {
  const updatedCart = cartCustomRepsonseLayer(data.data);
  if (!CART_REDUCER.cartLoaded) cartLoaded(); // call in everycase so that CSR is also handled

  CART_REDUCER.cart = { ...CART_REDUCER.cart, ...updatedCart };

  bbcWVCartCountUpdate(updatedCart.productCount);
};

export const updateProductCount = (count: number) => (CART_REDUCER.cart.productCount = count);

export const updatePyblAmount = (amount: number) => (CART_REDUCER.cart.payableAmount = amount);

export const updateCartLoader = (loading: boolean) => (CART_REDUCER.cart.loader = loading);

export const cartLoaded = () => (CART_REDUCER.cartLoaded = true); // once CartLoaded it becomes true

// @ts-ignore
export const clearCart = () => (CART_REDUCER.cart = { loader: false });

export const addToBag = commonLogic;

export const updateCart = commonLogic;
