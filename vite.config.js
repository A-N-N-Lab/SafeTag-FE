import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0 바인딩 → 폰 같은 네트워크에서 접근 가능
    port: 5173,
    proxy: {
      "/api": {
        target: "http://172.20.10.5:8080", // 내 PC IP
        changeOrigin: true,
      },
    },
  },
});
