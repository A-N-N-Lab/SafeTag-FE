// import axios, {
//   AxiosHeaders,
//   type InternalAxiosRequestConfig,
//   type RawAxiosRequestHeaders,
// } from "axios";

// const BASE = import.meta.env.VITE_API_BASE;

// export const api = axios.create({
//   baseURL: BASE,
//   withCredentials: false,
//   timeout: 20000,
// });

// api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const token =
//     localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";

//   const url = config.url ?? "";
//   const skipAuth =
//     url.includes("/api/auth/login") ||
//     url.includes("/api/auth/signup") ||
//     url.includes("/api/auth/refresh");

//   // 헤더를 AxiosHeaders 인스턴스로 정규화
//   const headers =
//     config.headers instanceof AxiosHeaders
//       ? config.headers
//       : new AxiosHeaders(config.headers as RawAxiosRequestHeaders);

//   const isFormData =
//     typeof FormData !== "undefined" && config.data instanceof FormData;

//   if (!isFormData) headers.set("Content-Type", "application/json");
//   else headers.delete("Content-Type");

//   if (token && !skipAuth) headers.set("Authorization", `Bearer ${token}`);

//   config.headers = headers;
//   return config;
// });

// // 응답 인터셉터(선택): 401 처리 힌트
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       // 토큰 만료 등 공통 처리 지점
//       // 예) localStorage.removeItem('access_token');
//       //     window.location.assign('/login');
//       console.warn("[API] 401 Unauthorized", err.response?.data);
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;
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

// ✅ ngrok 브라우저 경고 우회 헤더 추가 (중간 경고페이지 방지)
api.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

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

// ✅ 응답 인터셉터 (401 처리용)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("[API] 401 Unauthorized", err.response?.data);
      // 필요하면 자동 로그아웃 or 리다이렉트 처리 추가 가능
    }
    return Promise.reject(err);
  }
);

export default api;
