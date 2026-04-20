import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import storage from "utils/storage";
import ENDPOINTS from "./endpoints/Endpoints";

type RequestConfig = {
  headers: any;
} & AxiosRequestConfig;

const axiosInstance: any = axios.create({
  baseURL: ENDPOINTS.BASE,
  params: {
    // default params
  },
});

// Request Interceptor

const onRequest = (config: RequestConfig): AxiosRequestConfig => {
  // actions that we want to do with every request like get anime cards etc
  if (storage.getToken()) {
    config.headers = {
      ...config.headers,
      "api-access-token": "Bearer " + storage.getToken(),
    };
  }
  return config;
};
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  // actions that we want to do with every request like get anime cards etc
  return Promise.reject(error);
};

// Response Interceptor

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.info(`[response] [${JSON.stringify(response)}]`);
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  // actions that we want to do with every response we got from rest api like get anime cards etc
  // const originalRequest = error.config;

  return Promise.reject(error);
};

//request
axiosInstance.interceptors.request.use(onRequest, onRequestError);
//response
axiosInstance.interceptors.response.use(onResponse, onResponseError);

export default axiosInstance;
