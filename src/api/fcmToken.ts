// import { api } from "./index";

// const usernameFromToken = () => {
//   try {
//     const t = localStorage.getItem("access_token");
//     if (!t) return "";
//     const seg = t.split(".")[1] || "";
//     const pad = "===".slice((seg.length + 3) % 4);
//     const p = JSON.parse(atob(seg.replace(/-/g, "+").replace(/_/g, "/") + pad));
//     return p?.username || p?.sub || p?.email || "";
//   } catch {
//     return "";
//   }
// };

// export const saveFcmToken = async (token: string) => {
//   return api.post("/api/fcm/register", { token });
// };

import { api } from "./index";

export const saveFcmToken = async (token: string) => {
  // 백엔드: /api/user/me/fcm-token  +  { fcmToken: string }
  return api.post("/api/user/me/fcm-token", { fcmToken: token });
};
