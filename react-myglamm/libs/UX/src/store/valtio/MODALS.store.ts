import { proxy } from "valtio";

import { cartFreeProduct } from "@typesLib/Cart";

type commonStates = {
  show?: boolean;
  onSubmit?: () => void;
};

type freeProductStates = commonStates & { products?: cartFreeProduct[] };

interface modalStates {
  NOTIFY: commonStates;
  MINI_CART: commonStates;
  FREE_PRODUCT_MODAL: freeProductStates;
}

export const MODALS: modalStates = proxy({ NOTIFY: {}, MINI_CART: {}, FREE_PRODUCT_MODAL: {} });

export const SET_NOTIFY_MODAL = (state: commonStates) => {
  MODALS.NOTIFY = state;
};

export const SET_MINI_CART_MODAL = (state: commonStates) => {
  MODALS.MINI_CART = state;
};

export const SET_FREE_PRODUCT_MODAL = (state: freeProductStates) => {
  MODALS.FREE_PRODUCT_MODAL = state;
};
