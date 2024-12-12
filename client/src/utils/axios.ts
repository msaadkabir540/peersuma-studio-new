import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axios.interceptors.request.use(
  (req: AxiosRequestConfig) => {
    const localStorageToken = localStorage.getItem("token") || false;
    if (req.headers && req.headers["X-Access-Token"] !== "no token" && localStorageToken) {
      const headers = req.headers as Record<string, string>;
      headers["X-Access-Token"] = localStorageToken;
    } else {
      const headers = req.headers as Record<string, string | undefined>;
      headers["X-Access-Token"] = undefined;
    }
    return req as InternalAxiosRequestConfig<any>;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (successRes: AxiosResponse) => {
    return successRes;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;
