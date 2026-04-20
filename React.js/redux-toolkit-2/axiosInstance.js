import axios from "axios";
import stoarge from './storage'
import API_URL, { AZURE_CODE } from "./urls/COMMON_URL";
import qs from "qs";

const axiosInstance = axios.create({
  baseURL: API_URL.BASE_URL,
  params: {
    code: AZURE_CODE,
  },
  paramsSerializer: (params) => qs.stringify(params, { encode: false }),
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = stoarge.getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response Interceptor

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.url === "http://127.0.0.1:3000/v1/auth/token"
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = storage.getRefreshToken();
      return axios
        .post("/auth/token", {
          refresh_token: refreshToken,
        })
        .then((res) => {
          if (res.status === 201) {
         
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + storage.getToken();
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    throw new Error(err.response.data);
  }
);

export default axiosInstance;
