// // 공통 axios 인스턴스 만들기
// import axios from "axios";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: false,
// });

// //JWT 토큰 자동 추가
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   const url = config.url ?? "";

//   const skipAuth =
//     url.includes("/api/auth/login") ||
//     url.includes("/api/auth/signup") ||
//     url.includes("/api/auth/refresh");

//   if (token && !skipAuth) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;

// src/api/index.ts
import axios, {
  AxiosHeaders,
  type InternalAxiosRequestConfig,
  type RawAxiosRequestHeaders,
} from "axios";

const BASE = import.meta.env.VITE_API_BASE;

export const api = axios.create({
  baseURL: BASE,
  withCredentials: false,
  timeout: 20000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";

  const url = config.url ?? "";
  const skipAuth =
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/signup") ||
    url.includes("/api/auth/refresh");

  // 헤더를 AxiosHeaders 인스턴스로 정규화
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers as RawAxiosRequestHeaders);

  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;

  if (!isFormData) headers.set("Content-Type", "application/json");
  else headers.delete("Content-Type");

  if (token && !skipAuth) headers.set("Authorization", `Bearer ${token}`);

  config.headers = headers;
  return config;
});

// 응답 인터셉터(선택): 401 처리 힌트
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // 토큰 만료 등 공통 처리 지점
      // 예) localStorage.removeItem('access_token');
      //     window.location.assign('/login');
      console.warn("[API] 401 Unauthorized", err.response?.data);
    }
    return Promise.reject(err);
  }
);

export default api;
