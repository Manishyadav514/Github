import Router from "next/router";
import axiosRetry from "axios-retry";
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

import { isClient } from "@libUtils/isClient";
import { isWebview } from "@libUtils/isWebview";
import { WVCallbacks } from "@libUtils/WVCallbacks";
import { bbcActionCallback } from "@libUtils/bbcWVCallbacks";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { getSessionStorageValue, removeSessionStorageValue, setSessionStorageValue } from "@libUtils/sessionStorage";

import { SHOP } from "@libConstants/SHOP.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { LOCALSTORAGE, SESSIONSTORAGE, XTOKEN } from "@libConstants/Storage.constant";
import { DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";
import { CountryFilter, langLocale, LanguageFilter, ME_VendorCodes, VendorCodes } from "@typesLib/APIFilters";

/**
 * Base Class for API's Which contains Axios Instance
 */
class MyGlammAPI {
  protected HEADERS: any;

  protected myGlammV2: AxiosInstance;

  static Filter: {
    APIVendor: VendorCodes | ME_VendorCodes;
    CountryFilter: CountryFilter;
    LanguageFilter: LanguageFilter;
    AddressCountryCode: string;
  } = {
    APIVendor: DUMMY_VENDOR_CODE() || (SHOP.SITE_CODE as VendorCodes),

    CountryFilter: "IND",

    LanguageFilter: "EN",

    AddressCountryCode: "",
  };

  static bustCache: string;

  static apiurlV2 = process.env.NEXT_PUBLIC_APIV2_URL || "";

  static API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

  static LOCALE: langLocale;

  static BBC_HEADERS = {
    apikey: GBC_ENV.NEXT_PUBLIC_COMMUNITY_API_KEY || "",
  };

  static HEADERS = {
    "Content-Type": "application/json",
  };

  /**
   * Create a New API Instance Class
   *
   */
  constructor() {
    this.myGlammV2 = getInstance();
  }

  /**
   * Change API Language Filter
   * @param language {string} - Language
   */
  static changeLanguage(language: LanguageFilter) {
    this.Filter.LanguageFilter = language;
  }

  static changeAddressCountryCode(data: any) {
    if (data?.countryCode) {
      setSessionStorageValue(SESSIONSTORAGE?.ADDRESS_COUNTY_DETAILS, data, true);
      this.Filter.AddressCountryCode = data?.countryCode || "";
    } else {
      removeSessionStorageValue(SESSIONSTORAGE?.ADDRESS_COUNTY_DETAILS);
      this.Filter.AddressCountryCode = "";
    }
  }

  /**
   * Change API Country Filter
   * @param country {string} - Country
   */
  static changeCountry(country: CountryFilter) {
    this.Filter.CountryFilter = country;
  }

  /**
   * Change API Vendor
   * @param vendor {string} -Vendor Code
   */
  static changeVendor(vendor: VendorCodes | ME_VendorCodes) {
    this.Filter.APIVendor = vendor;
  }

  /**
   * Change API Key
   * @param apikey {string} - apikey
   */
  static changeAPIKey(key: string) {
    this.API_KEY = key;
  }

  /**
   * Used for Generating Base URL
   * @param locale {string} -
   */
  static setLocale(locale: langLocale) {
    this.LOCALE = locale;
  }

  /* RECATPCHA - Retry Logic with Delay */
  static async getReCaptchToken(action: string, nthTry = 3): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        (window as any).grecaptcha.enterprise.ready(() => {
          (window as any).grecaptcha.enterprise
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_KEY, { action })
            .then(
              (token: string) => resolve(token),
              (recaptchaErr: any) => {
                console.error({ recaptchaErr }, "PROMISE SECOND PARAMETER");
                reject(recaptchaErr);
              }
            )
            .catch((err: any) => {
              console.error({ err }, "PROMISE CATCH");
              reject(err);
            });
        });
      } catch (err) {
        reject(err);
      }
    }).catch(async () => {
      if (nthTry === 0) {
        return "";
      }

      await new Promise(resolve => setTimeout(() => resolve(""), 1000)); // delay

      console.error(`WILL RETRY RECAPTCHA FOR ${nthTry} TIME`);

      return await this.getReCaptchToken(action, nthTry - 1);
    });
  }
}

const createInstance = () => {
  const a = axios.create({
    baseURL: MyGlammAPI.apiurlV2,
    timeout: 40000,
    headers: MyGlammAPI.HEADERS,
  });
  if (isClient()) {
    axiosRetry(a, {
      retries: 5,
      retryDelay: x => {
        return x * 750;
      },
      onRetry: (_retryCount, _error, _requestConfig) => {
        // console.error(`Retry No. ${retryCount}: ${requestConfig.method} ${requestConfig.url}`);
      },
    });
  }

  a.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const API_KEY = MyGlammAPI.API_KEY;

      let { headers, params } = config;

      /* ReCaptcha Logic if Key Enabled any set of params sent in api */
      if (process.env.NEXT_PUBLIC_RECAPTCHA_KEY) {
        const { rcAction, rcApi } = config.params || {};
        if (rcAction) {
          const recaptchaToken = await MyGlammAPI.getReCaptchToken(rcAction);
          if (recaptchaToken) {
            headers = { ...headers, "g-recaptcha-response": recaptchaToken, "g-recaptcha-action": rcAction };
          } else {
            console.error("No Token Recaptcha");
          }
        }

        /* Use ReCaptcha API only incase toekn is received */
        if (headers?.["g-recaptcha-response"] && rcApi) {
          config.url = rcApi;
        }
      }
      const addressCountyData = isClient() && getSessionStorageValue(SESSIONSTORAGE?.ADDRESS_COUNTY_DETAILS, true);
      // -----------------------------------------------------------------

      params = {
        ...(params?.bustCache ? { bustCache: params.bustCache } : {}),
        vendorCode: params?.vendorCode || MyGlammAPI.Filter.APIVendor,
        countryFilter: MyGlammAPI.Filter.CountryFilter,
        languageFilter: MyGlammAPI.Filter.LanguageFilter,
        ...(addressCountyData ? { addressCountyCode: addressCountyData?.countryCode } : {}),
      };

      if (isClient() && document.cookie) {
        // send only specific cookies to the api gateway
        const cookieArr = document.cookie.split(";");
        const xCookie = cookieArr
          .filter(_cookie => {
            const c = _cookie.split("=");
            const name = c[0].trim();
            return (
              name.startsWith("_fb") ||
              name.startsWith("_ga") ||
              name.startsWith("_gi") ||
              name.startsWith("_utm") ||
              name.startsWith("utmParams")
            );
          })
          .join(";")
          .trim();
        headers = { ...headers, "x-cookie": xCookie };
      }

      /* avoid adding any headers in case a token already presnt */
      let xtoken: string = "";
      let stoken: string = "";
      if (isClient()) {
        xtoken = getLocalStorageValue(XTOKEN());
        stoken = getLocalStorageValue(LOCALSTORAGE.STOKEN);
      }
      if (!headers?.["x-access-token"]) {
        if ((stoken || xtoken) && typeof headers?.apikey !== "boolean") {
          headers = { ...headers, "x-access-token": stoken || xtoken };
        } else if (typeof headers?.apikey !== "string") {
          headers = { ...headers, apikey: API_KEY };
        }
      }

      const axiosRequest: AxiosRequestConfig = {
        ...config,
        headers,
        params: params,
      };

      if (MyGlammAPI.bustCache) {
        axiosRequest.params.bustCache = MyGlammAPI.bustCache;
      }

      return axiosRequest;
    },
    (err: any) => Promise.reject(err)
  );

  a.interceptors.response.use(undefined, (error: any) => {
    if (error.config && error.response?.status) {
      const { config, response } = error;
      const { message } = response?.data || {};
      const { status } = response;

      // if (message && ["498", "422"].indexOf(status.toString()) < 0) {
      //   console.error({ message, status });
      // }

      switch (status) {
        /**
         * If consumer is unauthorized or Forbidden to access
         * then force logout and redirect to Login page
         */
        case 401:
        case 403: {
          if (isClient()) {
            try {
              const { "x-access-token": _xAccessToken, "x-cookie": _xCookie, ...restHeaders } = config.headers;
              console.error({
                status,
                url: config.url,
                data: config.data,
                method: config.method,
                params: config.params,
                headers: restHeaders,
              });
            } catch (e) {
              // no-op
            }
            localStorage.clear();

            const url = new URL(window.location.href);
            if (isWebview()) WVCallbacks(`${url.origin}/login`); // Webview
            else if (!window.location.href.match(/authenticate|\/login/)) {
              url.searchParams.append("authenticate", "yes");
              window.location.replace(url.toString());
            }

            return Promise.reject(error);
          }
          break;
        }

        /**
         * If cart does not exist or cart is not valid then redirect user to
         * Home page.
         */
        case 422: {
          if (isClient()) {
            const { pathname } = Router;
            if (
              pathname.match(/checkout|payment/) &&
              (message?.message?.match("Cart not found") || (typeof message === "string" && message.match("Cart not found")))
            ) {
              return Router.replace("/");
            }
          }
          break;
        }

        /**
         * Refresh Token - If token is expired then remove old token and
         * replace with new one from response.
         */
        case 498: {
          config.headers["x-access-token"] = response.data.newToken;
          setLocalStorageValue(XTOKEN(), response.data.newToken);

          // pass the refreshed token to the babychakra app
          bbcActionCallback("updateToken", { token: response.data.newToken });

          return axios.request(config);
        }
        case 400:
        case 422:
        case 502:
        case 504:
          if (!isClient()) {
            throw `${status}: ${config.method} ${config.url} ${JSON.stringify(config.params)}`;
          }

        default: {
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  });

  if (isClient()) {
    (window as any).axiosInstance = a;
  }
  return a;
};

const getInstance = () => {
  if (isClient() && (window as any).axiosInstance) {
    return (window as any).axiosInstance;
  } else {
    return createInstance();
  }
};

export default MyGlammAPI;
