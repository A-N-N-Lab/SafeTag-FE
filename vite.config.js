// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // 0.0.0.0 바인딩 → 폰 같은 네트워크에서 접근 가능
//     port: 5173,
//     proxy: {
//       "/api": {
//         target: "http://172.20.10.5:8080", // 내 PC IP
//         changeOrigin: true,
//       },
//     },
//   },
// });
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0
    port: 5173,
    proxy: {
      // REST API -> 스프링(로컬 8080)으로 프록시
      "/api": {
        target: "http://172.20.10.5:8080", // 또는 http://localhost:8080
        changeOrigin: true,
        secure: false,
      },
      // (옵션) 시그널링 웹소켓도 프록시가 필요하면
      "/ws": {
        target: "ws://172.20.10.5:8080", // 서버의 WS 엔드포인트 기준
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
