// import { api } from "./index";

// /** base64url → base64 */
// const b64urlToB64 = (s: string) => {
//   let out = s.replace(/-/g, "+").replace(/_/g, "/");
//   const pad = out.length % 4;
//   if (pad) out += "=".repeat(4 - pad);
//   return out;
// };
// const rolesToString = (v: unknown): string => {
//   if (!v) return "";
//   if (typeof v === "string") return v;
//   if (Array.isArray(v)) {
//     return v
//       .map((x: any) => (typeof x === "string" ? x : x?.authority || ""))
//       .filter(Boolean)
//       .join(",");
//   }
//   return "";
// };
// export const getRoleFromToken = (): string => {
//   const t = localStorage.getItem("access_token");
//   if (!t) return "";
//   try {
//     const payload = JSON.parse(atob(b64urlToB64(t.split(".")[1] || "")));
//     const raw = payload?.auth ?? payload?.role ?? payload?.authorities ?? "";
//     return rolesToString(raw);
//   } catch {
//     return "";
//   }
// };
// export const isAdmin = () => getRoleFromToken().includes("ROLE_ADMIN");

// /** 응답 정규화 */
// const normalize = (raw: any) => {
//   const src = (raw && (raw.data || raw)) || {};
//   return {
//     name: src.name ?? "",
//     email: src.email ?? src.username ?? "",
//     gender: src.gender ?? "",
//     phoneNum: src.phoneNum ?? "",
//     birthDate: src.birthDate ?? "",
//     carNumber: src.carNumber ?? src.vehicleNumber ?? "",
//     address: src.address ?? src.apartmentInfo ?? "",
//     company: src.company ?? "",
//     role: src.role ?? "",
//   };
// };

// export const getMyPage = async () => {
//   const res = await api.get("/api/mypage"); // ✅ 단일 엔드포인트
//   return normalize(res.data);
// };

// export const updateMyPage = async (data: Record<string, any>) => {
//   const payload: Record<string, any> = { ...data };

//   // 화면 키 → 서버 키 보정
//   if ("carNumber" in payload && !("vehicleNumber" in payload)) {
//     payload.vehicleNumber = payload.carNumber;
//     delete payload.carNumber;
//   }
//   // 주소는 일반 유저일 때만 apartmentInfo 로 보냄
//   if (!isAdmin() && "address" in payload && !("apartmentInfo" in payload)) {
//     payload.apartmentInfo = payload.address;
//     delete payload.address;
//   }

//   // 최종 호출 (⚠️ 관리자 전용 경로로 폴백하지 않음)
//   return api.put("/api/mypage/edit", payload);
// };

// src/api/mypage.ts
// import { api } from "./index";

// /** base64url → base64 (with padding) */
// const b64urlToB64 = (s: string) => {
//   let out = s.replace(/-/g, "+").replace(/_/g, "/");
//   const pad = out.length % 4;
//   if (pad) out += "=".repeat(4 - pad);
//   return out;
// };

// const rolesToString = (v: unknown): string => {
//   if (!v) return "";
//   if (typeof v === "string") return v;
//   if (Array.isArray(v)) {
//     return v
//       .map((x: any) => (typeof x === "string" ? x : x?.authority || ""))
//       .filter(Boolean)
//       .join(",");
//   }
//   return "";
// };

// export const getRoleFromToken = (): string => {
//   const t = localStorage.getItem("access_token");
//   if (!t) return "";
//   try {
//     const payload = JSON.parse(atob(b64urlToB64(t.split(".")[1] || "")));
//     const raw = payload?.auth ?? payload?.role ?? payload?.authorities ?? "";
//     return rolesToString(raw);
//   } catch {
//     return "";
//   }
// };
// export const isAdmin = () => getRoleFromToken().includes("ROLE_ADMIN");

// /** 서버 응답 → 화면 모델 정규화 */
// const normalize = (raw: any) => {
//   const src = (raw && (raw.data || raw)) || {};
//   return {
//     name: src.name ?? "",
//     email: src.email ?? src.username ?? "",
//     gender: src.gender ?? "",
//     phoneNum: src.phoneNum ?? "",
//     birthDate: src.birthDate ?? "",
//     carNumber: src.carNumber ?? src.vehicleNumber ?? "",
//     address: src.address ?? src.apartmentInfo ?? "",
//     company: src.company ?? "",
//     role: src.role ?? "",
//   };
// };

// export const getMyPage = () => api.get("/api/mypage");

// // 부분수정: 바뀐 필드만 보냄
// export const patchMyPage = (payload: Record<string, any>) =>
//   api.patch("/api/mypage", payload);

// export const updateMyPage = async (data: Record<string, any>) => {
//   const payload: Record<string, any> = { ...data };

//   // 화면 키 → 서버 키 보정
//   if ("carNumber" in payload && !("vehicleNumber" in payload)) {
//     payload.vehicleNumber = payload.carNumber;
//     delete payload.carNumber;
//   }

//   // ✅ address는 그대로 보냄 (apartmentInfo로 바꾸지 말기)
//   // if (!isAdmin() && "address" in payload && !("apartmentInfo" in payload)) {
//   //   payload.apartmentInfo = payload.address; // ← 이 줄 지우기
//   //   delete payload.address;
//   // }

//   return patchMyPage(payload);
// };

import { api } from "./index";

/** 서버 응답 → 화면 모델 정규화 */
const normalize = (raw: any) => {
  const src = (raw && (raw.data || raw)) || {};
  return {
    name: src.name ?? "",
    email: src.email ?? src.username ?? "",
    gender: src.gender ?? "",
    phoneNum: src.phoneNum ?? "",
    birthDate: src.birthDate ?? "",
    carNumber: src.carNumber ?? src.vehicleNumber ?? "",
    address: src.address ?? src.apartmentInfo ?? "",
    company: src.company ?? "",
    role: src.role ?? src.permission ?? "",
  };
};

export const getMyPage = async () => {
  const res = await api.get("/api/mypage");
  return normalize(res.data);
};

// 부분 수정(PATCH) 전용
export const patchMyPage = (payload: Record<string, any>) =>
  api.patch("/api/mypage", payload);

// 화면 → 서버 키 보정 + PATCH
export const updateMyPage = async (data: Record<string, any>) => {
  const payload: Record<string, any> = { ...data };

  // 화면에서 carNumber로 오면 서버는 vehicleNumber로 받게 통일
  if ("carNumber" in payload) {
    payload.vehicleNumber = payload.carNumber;
    delete payload.carNumber;
  }

  // address는 그대로 address로 전송 (apartmentInfo로 바꾸지 않음)
  return patchMyPage(payload);
};
