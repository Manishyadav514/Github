import { useNavigate } from "@solidjs/router";
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { LOCALSTORAGE } from "../constants/Storage.constant";
import { getLocalStorageValue, setLocalStorageValue } from "../utils/localStorage";
import { CountryFilter, LanguageFilter, VendorCodes } from "@/types/APIFilters";

/**
 * Base Class for API's Which contains Axios Instance
 */
class NucleusAPI {
  protected HEADERS: any;

  protected NucleusAPI: AxiosInstance;

  static Filter: {
    APIVendor: VendorCodes;
    CountryFilter: CountryFilter;
    LanguageFilter: LanguageFilter;
  } = {
    APIVendor: "mgp",

    CountryFilter: "IND",

    LanguageFilter: "EN"
  };

  static apiurlV2 = import.meta.env.NUCLEUS_WEBSITENODEHOST;

  static API_KEY = import.meta.env.NUCLEUS_APIKEY || "";

  static HEADERS = {
    "Content-Type": "application/json"
  };

  /**
   * Create a New API Instance Class
   *
   */
  constructor() {
    this.NucleusAPI = getInstance();
  }
}
const createInstance = () => {
  const instance = axios.create({
    baseURL: NucleusAPI.apiurlV2,
    timeout: 40000,
    headers: NucleusAPI.HEADERS
  });

  instance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const API_KEY = import.meta.env.NUCLEUS_APIKEY || "";
      let { headers, params } = config;

      /* token logic */
      const user = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);
      if (!headers?.["x-access-token"]) {
        if (user?.token) {
          headers = { ...headers, "x-access-token": user?.token };
        } else {
          headers = { ...headers, apikey: API_KEY };
        }
      }
      const axiosRequest: AxiosRequestConfig = {
        ...config,
        headers,
        params: params
      };
      return axiosRequest;
    },
    (err: any) => Promise.reject(err)
  );

  instance.interceptors.response.use(undefined, (error: any) => {
    if (error.config && error.response?.status) {
      const { config, response } = error;
      const { status } = response;

      switch (status) {
        /**
         * If consumer is unauthorized or Forbidden to access
         * then force logout and redirect to Login page
         */
        case 401: {
          localStorage.clear();
          const navigate = useNavigate();
          navigate("/auth/login", { replace: true });
          break;
        }
        /**
         * Refresh Token - If token is expired then remove old token and
         * replace with new one from response.
         */
        case 498: {
          const user = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);
          localStorage.removeItem(LOCALSTORAGE.LOGGED_IN_USER);
          setLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, { ...user, token: response.data.newToken }, true);
          config.headers["x-access-token"] = response.data.newToken;
          return axios.request(config);
        }
        default: {
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  });
  (window as any).axiosInstance = instance;
  return instance;
};

const getInstance = () => {
  if ((window as any).axiosInstance) {
    return (window as any).axiosInstance;
  } else {
    return createInstance();
  }
};

export default NucleusAPI;
