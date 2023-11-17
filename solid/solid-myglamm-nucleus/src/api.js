import axios from "axios";
export function makeAPI(url) {
  const api = axios.create({
    baseURL: url,
    timeout: 10000,
  });
  api.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("token") || null;
      config.headers["x-access-token"] = token;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      console.error(error);
      if (error.response.status == 498) {
        let newToken = error.response.data.newToken;
        localStorage.setItem("token", newToken);
        error.config.headers["x-access-token"] = newToken;
        return axios.request(error.config);
      }
      return Promise.reject(error);
    }
  );
  return api;
}
