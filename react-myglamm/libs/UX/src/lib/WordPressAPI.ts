import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import axiosRetry from "axios-retry";

import { isClient } from "@libUtils/isClient";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

/**
 * Base Class for API's Which contains Axios Instance
 */
class WordPressAPI {
  protected HEADERS: any;
  protected wordPressV1: AxiosInstance;
  static bustCache: string;

  static HEADERS = {
    "Content-Type": "application/json",
  };

  /**
   * Create a New API Instance Class
   *
   */
  constructor() {
    this.wordPressV1 = getInstance();
  }
}

const createInstance = () => {
  const a = axios.create({
    baseURL: GBC_ENV.NEXT_PUBLIC_WORDPRESS_URL,
    timeout: 40000,
    headers: WordPressAPI.HEADERS,
  });
 

  a.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      let { headers, params } = config;

      const axiosRequest: AxiosRequestConfig = {
        ...config,
        headers,
        params: params,
      };

      return axiosRequest;
    },
    (err: any) => Promise.reject(err)
  );

  a.interceptors.response.use(undefined, (error: any) => {
    if (error.config && error.response?.status) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  });

  return a;
};

const getInstance = () => {
  return createInstance();
};

export default WordPressAPI;
