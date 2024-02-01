import { isClient } from "./isClient";

/**
 * @function getSessionStorageValue
 * @param key {string} Key of SessionStorage Item
 * @returns {*}
 */
function getSessionStorageValue(key: string, parse = false) {
  if (isClient() && "sessionStorage" in window) {
    try {
      const storedValue = window.sessionStorage.getItem(key);

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

function setSessionStorageValue<T>(key: string, value: T, serialize?: boolean) {
  if (isClient() && "sessionStorage" in window) {
    try {
      if (serialize) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } else if (typeof value === "string") {
        console.log(key, value);
        window.sessionStorage.setItem(key, value);
      }
    } catch (e: any) {
      console.log(e);
      throw new Error(e.message);
    }
  }
  return null;
}

function removeSessionStorageValue(key: string) {
  if (isClient() && "sessionStorage" in window) {
    window.sessionStorage.removeItem(key);
  }
}


export {
    getSessionStorageValue,
    removeSessionStorageValue,
    setSessionStorageValue,
  };