import axios, { AxiosRequestConfig, AxiosInstance, InternalAxiosRequestConfig } from "axios";

class NucleusAPI {

  protected HEADERS: any;
  protected NucleusAPI: AxiosInstance;

  static apiurlV2 = "http://localhost:5000";

  static API_KEY = "";

  static HEADERS = {
    "Content-Type": "application/json"
  };

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
    async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig<any>> => {
      let { headers, params } = config;
      const axiosRequest: InternalAxiosRequestConfig<any> = {
        ...config,
        headers: headers as any,
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
