// 공통 axios 인스턴스 만들기
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

//JWT 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  const url = config.url ?? "";

  const skipAuth =
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/signup") ||
    url.includes("/api/auth/refresh");

  if (token && !skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
