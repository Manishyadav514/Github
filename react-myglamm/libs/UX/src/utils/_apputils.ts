import axios from "axios";

import MyGlammAPI from "@libAPI/MyGlammAPI";
import ConstantsAPI from "@libAPI/apis/ConstantsAPI";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";
import { LOCALSTORAGE, SESSIONSTORAGE, COOKIE } from "@libConstants/Storage.constant";

import { setCookie } from "@libUtils/cookies";

import { CountryConfig } from "@typesLib/Redux";
import { langLocale, VendorCodes } from "@typesLib/APIFilters";

import { CONFIG_REDUCER, CONSTANT_REDUCER, NAV_REDUCER, USER_REDUCER } from "@libStore/valtio/REDUX.store";

import { isClient } from "./isClient";
import { isWebview } from "./isWebview";
import { getStaticUrl } from "./getStaticUrl";
import { getLocalStorageValue, setLocalStorageValue } from "./localStorage";

import API_KEYS from "../../../../apikeys.json";

/**
 * Change Vendor Code for G3 website as it gets it env at runtime
 */
export function setVendoreCode(vendor = "mgp") {
  /* In Runtime we don't have process.env thing */
  if (!process.env.NEXT_PUBLIC_API_KEY) {
    MyGlammAPI.changeVendor(DUMMY_VENDOR_CODE() || (vendor as VendorCodes));
  }
}

/**
 * intial Client Side calls
 * Country ISD Codes
 */
export function initialClientCalls(store: any, countryConstants: CountryConfig[]) {
  const constantsApi = new ConstantsAPI();

  if (countryConstants) {
    return constantsApi
      .getCountryByLabel(countryConstants?.find(x => x.isSelected)?.defaultCountryId as string)
      .then((countryISDs: any) => {
        CONSTANT_REDUCER.isdCodes = countryISDs.data.data;
      });
  }

  return null;
}

/**
 * store locally utm params that can be used then further by the apis to track users
 * @param query - router url query params
 */
export function storeUTMParams() {
  const utm_source = getClientQueryParam("utm_source");
  const utm_medium = getClientQueryParam("utm_medium");
  const utm_campaign = getClientQueryParam("utm_campaign");
  const utm_term = getClientQueryParam("utm_term");
  const utm_content = getClientQueryParam("utm_content");
  const gclid = getClientQueryParam("gclid");
  const fbclid = getClientQueryParam("fbclid");
  try {
    if (utm_source || utm_medium || utm_campaign || utm_term || utm_content || gclid || fbclid) {
      setLocalStorageValue(
        LOCALSTORAGE.UTM_PARAMS,
        {
          utmSource: utm_source?.toString() || "",
          utmMedium: utm_medium?.toString() || "",
          utmCampaign: utm_campaign?.toString() || "",
          utmTerm: utm_term?.toString() || "",
          utmContent: utm_content?.toString() || "",
        },
        true
      );

      setCookie(
        COOKIE.UTMPARAMS,
        JSON.stringify({
          utmSource: utm_source?.toString() || "",
          utmMedium: utm_medium?.toString() || "",
          utmCampaign: utm_campaign?.toString() || "",
          utmTerm: utm_term?.toString() || "",
          utmContent: utm_content?.toString() || "",
          gclid: gclid?.toString() || "",
          fbclid: fbclid?.toString() || "",
        }),
        COOKIE.COOKIETIME
      );
    }
  } catch (e) {
    // no-op
  }
}

/**
 * Initialize Webview Script incase WV params appears in url
 * @param query router query
 */
export function initAppWVScript() {
  if (isWebview()) {
    sessionStorage.setItem(SESSIONSTORAGE.WEBVIEW, (getClientQueryParam("platform") || isWebview()) as string);

    const jsFile = document.createElement("script");
    jsFile.setAttribute("type", "text/javascript");
    jsFile.setAttribute("src", getStaticUrl("/global/scripts/appRedirect.js"));
    document.getElementsByTagName("head")[0].appendChild(jsFile);
  }
}

export function initPolyfills() {
  if (isClient()) {
    (window as any).Promise.allSettled = (promises: Array<Promise<any>>) =>
      Promise.all(
        promises.map((p: any) =>
          p
            .then((value: any) => ({
              status: "fulfilled",
              value,
            }))
            .catch((reason: any) => ({
              status: "rejected",
              reason,
            }))
        )
      );
  }
  (async () => {
    if (isClient() && typeof window.IntersectionObserver === "undefined") {
      //@ts-ignore
      await import("intersection-observer");
    }
  })();

  (async () => {
    if (isClient() && "ResizeObserver" in window === false) {
      // Loads polyfill asynchronously, only if required.
      const module = await import(/* webpackChunkName: "ResizeObserverPolyfill" */ "@juggle/resize-observer");
      window.ResizeObserver = module.ResizeObserver;
    }
  })();
  (async () => {
    if (!Object.fromEntries) {
      const module = await import(/* webpackChunkName: "ObjectFromEntriesPolyfill" */ "object.fromentries");
      // @ts-ignore
      module.default.shim();
    }
  })();
  if (!Array.prototype.flat) {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Array.prototype, "flat", {
      configurable: true,
      value: function flat() {
        const depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);

        return depth
          ? Array.prototype.reduce.call(
              this,
              function (acc: any, cur: any) {
                if (Array.isArray(cur)) {
                  // @ts-ignore
                  acc.push.apply(acc, flat.call(cur, depth - 1));
                } else {
                  acc.push(cur);
                }

                return acc;
              },
              []
            )
          : Array.prototype.slice.call(this);
      },
      writable: true,
    });
  }

  if (!Array.prototype.flatMap) {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Array.prototype, "flatMap", {
      configurable: true,
      value: function flatMap() {
        // @ts-ignore
        return Array.prototype.map.apply(this, arguments).flat();
      },
      writable: true,
    });
  }
  // https://gomakethings.com/how-to-write-your-own-vanilla-js-polyfill/
  // because replace all is available in Chrome 85+ only
  if (!String.prototype.replaceAll) {
    // @ts-ignore
    String.prototype.replaceAll = function (str: string, newStr: string) {
      // If a regex pattern
      if (Object.prototype.toString.call(str).toLowerCase() === "[object regexp]") {
        return this.replace(str, newStr);
      }

      // If a string
      return this.replace(new RegExp(str, "g"), newStr);
    };
  }
}

export function setAPIOptions(countryConstants?: CountryConfig[], query?: string) {
  // Client Side - Purge Cache
  const bustCache = query;
  axios.defaults.params = bustCache ? { bustCache } : {};

  if (!countryConstants) return;

  const SelectedCountry = countryConstants.find(x => x.isSelected);
  const SelectedLanguage = SelectedCountry?.languages.find(x => x.isSelected);

  /* Exception for client in case same page is being loaded */
  if (isClient() && !location.href.includes(`/${SelectedLanguage?.urlLang}`) && SelectedLanguage?.urlLang !== "en-in") return;

  /* Only in case if Child Countries Available */
  if (SelectedCountry) {
    MyGlammAPI.changeCountry(SelectedCountry.isoCode3);
    MyGlammAPI.changeVendor(SelectedCountry.countryVendorCode);
    MyGlammAPI.changeLanguage(SelectedLanguage?.code || "EN");
    MyGlammAPI.setLocale(SelectedLanguage?.urlLang as langLocale);

    MyGlammAPI.changeAPIKey(
      // @ts-ignore
      API_KEYS[process.env.NEXT_PUBLIC_ROOT][process.env.NEXT_PUBLIC_PRODUCT_ENV][SelectedCountry.countryVendorCode]
    );
  }
}

export function getClientQueryParam(param: string) {
  if (typeof window === "undefined") return null;
  const usm = new URLSearchParams(window.location.search);
  return usm.get(param);
}

// Used to trigger necessary states required for server/client transition
export function initValtioStates(store?: any) {
  if (store?.configReducer?.configV3) {
    CONFIG_REDUCER.configV3 = store.configReducer.configV3;
    NAV_REDUCER.footer = store.navReducer.footer;
    NAV_REDUCER.topBanner = store.navReducer.topBanner;
    NAV_REDUCER.headerMenu = store.navReducer.headerMenu;
    CONSTANT_REDUCER.countryConstants = store.constantReducer.countryConstants;
  }

  USER_REDUCER.userProfile = getLocalStorageValue(LOCALSTORAGE.PROFILE, true);
}

export async function loadAdobe() {
  if (isClient()) {
    // @ts-ignore
    (await import("@libUtils/adobeAnalytics")).initAdobeAnalytics();
  }
}
