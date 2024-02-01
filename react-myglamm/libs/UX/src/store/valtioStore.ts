import { proxy, subscribe } from "valtio";
import debounce from "lodash.debounce";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { GiftCard } from "@typesLib/Payment";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

/**
 * Gift Card Global States
 */
export const GIFT_CARDS: { cards: Array<GiftCard> } = proxy(
  getLocalStorageValue(LOCALSTORAGE.GIFT_CARDS, true) || { cards: [] }
);

export const UPDATE_GIFTCARDS = (state: Array<GiftCard>) => (GIFT_CARDS.cards = state);

subscribe(GIFT_CARDS, () => setLocalStorageValue(LOCALSTORAGE.GIFT_CARDS, GIFT_CARDS, true));

/**
 * Manage address form modal state
 */

export type addressFormState = {
  showAddressForm: boolean;
  editAddressId: string;
};

export const ADDRESS_FORM_MODAL_STATE: addressFormState = proxy({
  showAddressForm: false,
  editAddressId: "",
});

/**
 * Login Global State
 */
type LoginModalState = {
  type?: "onlyMobile" | "normal";
  show: undefined | boolean;
  mergeCart?: boolean;
  onSuccess?: () => void;
  hasSocialLogin?: boolean;
  hasGuestCheckout?: boolean;
  analyticsData?: any;
  memberTag?: string;
  overrideCheckoutURL?: string;
  closeOnlyOnLoginned?: boolean;
};

const LOGIN_DEFAULT_STATE: LoginModalState = {
  type: "normal",
  show: undefined,
  mergeCart: true,
  hasGuestCheckout: true,
  hasSocialLogin: true,
  analyticsData: {
    adobe: {
      common: {
        pageName: "web|order checkout|",
        subSection: "checkout step1",
        assetType: "checkout login",
      },
    },
  },
  memberTag: undefined,
  overrideCheckoutURL: "/payment",
  closeOnlyOnLoginned: false,
  onSuccess: () => dispatchEvent(new Event("Login Success")),
};

export const LOGIN_MODAL_CONSTANT = proxy({ state: LOGIN_DEFAULT_STATE });

export const SHOW_LOGIN_MODAL = (state: LoginModalState) => {
  // @ts-ignore
  LOGIN_MODAL_CONSTANT.state = { ...LOGIN_DEFAULT_STATE, ...state };
};

type PLP_SCROLL_STATE_TYPE = [];
export const PLP_SCROLL_STATE = proxy({ fired: [], pending: [] });
subscribe(
  PLP_SCROLL_STATE,
  debounce(() => {
    if (PLP_SCROLL_STATE.pending.length >= 2) {
      PLP_SCROLL_STATE.fired = [...PLP_SCROLL_STATE.pending];
      /*
      try {
        if ((window as any).s) {
          (window as any).s.events = (window as any).s.apl((window as any).s.events, "event109", ",", 1);
          (window as any).s.products = PLP_SCROLL_STATE.pending.map(i => `;${i}`).join(",");
          (window as any).s.t();
        }
      } catch (e) {
        console.error({ e });
        // no-op
      }
      */
      PLP_SCROLL_STATE.pending = [];
    }
  }, 400)
);
