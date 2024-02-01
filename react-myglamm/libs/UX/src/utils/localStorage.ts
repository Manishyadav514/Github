import { LOCALSTORAGE, SESSIONSTORAGE, XTOKEN } from "@libConstants/Storage.constant";

import { isClient } from "./isClient";

/**
 * @function getLocalStorageValue
 * @param key {string} Key of LocalStorage Item
 * @returns {*}
 */
function getLocalStorageValue(key: string, parse = false) {
  if (isClient() && "localStorage" in window) {
    try {
      const storedValue = window.localStorage.getItem(key);

      if (!parse) {
        return storedValue;
      }

      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}

function setLocalStorageValue<T>(key: string, value: T, serialize?: boolean) {
  if (isClient() && "localStorage" in window) {
    try {
      if (serialize) {
        window.localStorage.setItem(key, JSON.stringify(value));
      } else if (typeof value === "string") {
        console.log(key, value);
        window.localStorage.setItem(key, value);
      }
    } catch (e: any) {
      console.log(e);
      throw new Error(e.message);
    }
  }
  return null;
}

function removeLocalStorageValue(key: string) {
  if (isClient() && "localStorage" in window) {
    window.localStorage.removeItem(key);
  }
}

function removeUserLocalStorage() {
  removeLocalStorageValue(LOCALSTORAGE.PROFILE);
  removeLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
  removeLocalStorageValue(XTOKEN());
}

function removeLocalStorageValueOnOrderPlaced(status: string) {
  setTimeout(() => {
    removeLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS); // comment if wanna stop order-summary redirection on reload
    removeLocalStorageValue(LOCALSTORAGE.SHIPPING_CHARGES);

    if (status === "success") {
      removeLocalStorageValue(LOCALSTORAGE.IS_SAVED_CARDS_PRESENT);
      removeLocalStorageValue(LOCALSTORAGE.IS_GIFT_CARD_ADDED_FROM_PAYMENT);
      removeLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT);
      removeLocalStorageValue(LOCALSTORAGE.UPSELL_DATA);
      removeLocalStorageValue(LOCALSTORAGE.USER_REMOVED_GIFT_CARD_MANUALLY);
      removeLocalStorageValue(LOCALSTORAGE.GUEST_TOKEN);
      removeLocalStorageValue(LOCALSTORAGE.COUPON);
      removeLocalStorageValue(LOCALSTORAGE.DISCOUNT_PRODUCT_ID);
      removeLocalStorageValue(LOCALSTORAGE.WHATSAPP_ENABLED);
      removeLocalStorageValue(LOCALSTORAGE.UTM_PARAMS);
      removeLocalStorageValue(LOCALSTORAGE.UPI_INTENT_FLOW_BANK_DETAILS);
      removeLocalStorageValue(LOCALSTORAGE.UPI_INTENT_APP_URL);
      removeLocalStorageValue(LOCALSTORAGE.BEST_COUPON_AUTO_APPLIED);
      removeLocalStorageValue(LOCALSTORAGE.FUTURE_TIME);
      sessionStorage.removeItem(SESSIONSTORAGE.AB_DYNAMIC_DISCOUNT_PRICE);
      sessionStorage.removeItem(LOCALSTORAGE.RESPONSE_SURVEY_ID);
      removeLocalStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA);
      removeLocalStorageValue(LOCALSTORAGE.PARTNERSHIP_PRODUCT_TAG);
      sessionStorage.removeItem(LOCALSTORAGE.PARTNERSHIP_DATA);
      sessionStorage.removeItem(LOCALSTORAGE.PARTNERSHIP_PRODUCT_TAG);
      sessionStorage.removeItem("USER_EDITING_CART");
      sessionStorage.removeItem(SESSIONSTORAGE.GIFT_CARD_VARIANT);
      sessionStorage.removeItem(SESSIONSTORAGE.GIFT_CARD_PHASE_2_VARIANT);
    }
  }, 2000);
}

export {
  getLocalStorageValue,
  removeLocalStorageValue,
  setLocalStorageValue,
  removeLocalStorageValueOnOrderPlaced,
  removeUserLocalStorage,
};
