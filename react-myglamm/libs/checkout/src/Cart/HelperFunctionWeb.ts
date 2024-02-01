import { freeProductData, userCart } from "@typesLib/Cart";
import { UserAddress } from "@typesLib/Consumer";

import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";
import { SET_FREE_PRODUCT_MODAL } from "@libStore/valtio/MODALS.store";

import { getFreeProductPromise } from "@productLib/pdp/HelperFunc";

import { getShippingAddress } from "../Payment/HelperFunc";
import { checkUserLoginStatus } from "../Storage/HelperFunc";

/**
 * Deciding Where to Redirect user in case user wants to checkout
 */
export async function getCheckoutUrl(
  shippingAddress: UserAddress | undefined,
  userAddress: UserAddress[],
  cart: userCart
): Promise<string> {
  if (checkUserLoginStatus()) {
    let userShippingAddress = shippingAddress;

    /* In-case no address present call the api and get it */
    if (!userShippingAddress) userShippingAddress = (await getShippingAddress()) as UserAddress;

    if (userShippingAddress && cart.countryId === parseInt(userShippingAddress.countryId)) {
      return "/checkout";
    }
    if (userAddress?.length || userShippingAddress) {
      return "/select-address";
    }
    return "/add-shipping-address";
  }

  return "/guest/address";
}

/**
 * GWP Select in cart for Desktop
 */
export function handleGWPSelect(cart: userCart) {
  getFreeProductPromise(cart.discounts as freeProductData, 8).then(data => {
    if (data?.length > 0) {
      SET_FREE_PRODUCT_MODAL({ show: true, products: data });
    } else {
      alert(CONFIG_REDUCER.configV3?.outOfStock || "Out Of Stock");
    }
  });
}
