/* eslint-disable @typescript-eslint/no-explicit-any */
import { paths } from "@/routes/paths";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

const plainAxios = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // ✅ Still needed for refresh token cookie
});


let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ Request interceptor: Attach access token
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Unified response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 and try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(
        "[Axios Interceptor] Access token expired. Attempting to refresh..."
      );
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await plainAxios.post(
          endpoints.auth.refresh,
          {}, // empty body, token comes from HTTP-only cookie
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        console.log(
          "[Axios Interceptor] Received new access token:",
          newAccessToken
        );
        sessionStorage.setItem("accessToken", newAccessToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        console.log(
          "[Axios Interceptor] Retrying with new token:",
          originalRequest.headers.Authorization
        );
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("[Axios Interceptor] Refresh failed", err);
        processQueue(err, null);
        sessionStorage.removeItem("accessToken");
        const pathParts = window.location.pathname.split("/");
        const locale = pathParts[1];
        // window.location.href = paths.auth.jwt.login(locale);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Fallback error handler
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;

// JWT-specific endpoints only
export const endpoints = {
  auth: {
    login: "/api/login",
    refresh: "/api/login/refresh",
  },
};
