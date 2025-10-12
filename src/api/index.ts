// 공통 axios 인스턴스 만들기
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
  },
});

//JWT 토큰 자동 추가  (선택 사항이라 추후에 ... )
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
