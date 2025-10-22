// // export type ChatMessage = {
// //   role: "system" | "user" | "assistant";
// //   content: string;
// // };
// // export type ChatResponse = { content: string };

// // const BASE = import.meta.env.VITE_CHATBOT_BASE || import.meta.env.VITE_API_BASE;

// // const authHeader = (): Record<string, string> => {
// //   const t =
// //     localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";
// //   return t ? { Authorization: `Bearer ${t}` } : {};
// // };

// // export async function postChat(messages: ChatMessage[]): Promise<ChatResponse> {
// //   const res = await fetch(`${BASE}/api/chat`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json", ...authHeader() },
// //     body: JSON.stringify({ messages }),
// //   });
// //   if (!res.ok) throw new Error(await res.text());
// //   return res.json();
// // }
// //

// // export type ChatMessage = {
// //   role: "system" | "user" | "assistant";
// //   content: string;
// // };
// // export type ChatResponse = { content: string };

// // // BASE 우선순위: 챗봇(FastAPI) → 기본값(로컬 8000)
// // const RAW_BASE =
// //   import.meta.env.VITE_CHATBOT_BASE?.toString() || "http://127.0.0.1:8000";

// // const BASE = RAW_BASE.replace(/\/+$/, "");

// // // JWT 헤더
// // const authHeader = (): Record<string, string> => {
// //   const t =
// //     localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";
// //   return t ? { Authorization: `Bearer ${t}` } : {};
// // };

// // export async function postChat(messages: ChatMessage[]): Promise<ChatResponse> {
// //   const res = await fetch(`${BASE}/chat`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json", ...authHeader() },
// //     body: JSON.stringify({ messages }),
// //   });
// //   if (!res.ok) throw new Error(await res.text());
// //   return res.json();
// // }

// // src/api/chatbot.ts
// export type ChatMessage = {
//   role: "system" | "user" | "assistant";
//   content: string;
// };
// export type ChatResponse = {
//   content?: string;
//   reply?: string;
//   detail?: any;
//   error?: any;
// };

// const RAW_BASE =
//   import.meta.env.VITE_CHATBOT_BASE?.toString() || "http://127.0.0.1:8000";
// const BASE = RAW_BASE.replace(/\/+$/, "");

// const authHeader = (): Record<string, string> => {
//   const t =
//     localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";
//   return t ? { Authorization: `Bearer ${t}` } : {};
// };

// // 서버가 요구: { messages: ChatMessage[] }
// export async function postChat(messages: ChatMessage[]): Promise<ChatResponse> {
//   const res = await fetch(`${BASE}/chat`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", ...authHeader() },
//     body: JSON.stringify({ messages }),
//   });

//   let data: any = null;
//   try {
//     data = await res.json();
//   } catch {
//     // text 응답이면 그대로 던짐
//     const text = await res.text();
//     if (!res.ok) throw new Error(text || res.statusText);
//     return { content: text };
//   }

//   if (!res.ok) {
//     // FastAPI가 detail/error로 감싸서 내려줄 수 있으니 그대로 throw
//     throw new Error(JSON.stringify(data));
//   }
//   return data ?? {};
// }

// src/api/chatbot.ts
export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
export type ChatResponse = {
  content?: string;
  reply?: string;
  detail?: any;
  error?: any;
};

const RAW_BASE =
  import.meta.env.VITE_CHATBOT_BASE?.toString() || "http://127.0.0.1:8000";
const BASE = RAW_BASE.replace(/\/+$/, "");

/** 로컬스토리지에서 토큰을 읽어 Authorization 헤더 구성 */
function authHeader(): Record<string, string> {
  // 둘 중 하나만 있어도 사용
  const token =
    localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";

  // 디버깅용: 토큰 유무를 눈으로 확인
  // (콘솔에서 'Authorization header added: true/false' 확인)
  console.debug(
    "[chatbot] Authorization header added:",
    Boolean(token),
    token ? `(len=${token.length})` : ""
  );

  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** 서버가 요구하는 바디: { messages: ChatMessage[] } */
export async function postChat(messages: ChatMessage[]): Promise<ChatResponse> {
  const headers = { "Content-Type": "application/json", ...authHeader() };

  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ messages }),
  });

  // 응답 파싱 (json 아닐 수도 있음)
  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (!res.ok) {
    // 네트워크 탭에서 쉽게 보려고 에러를 그대로 던짐
    throw new Error(typeof data === "string" ? data : JSON.stringify(data));
  }

  // { content } 또는 { reply } 어느 쪽이든 대응
  if (typeof data === "object" && (data.content || data.reply)) return data;
  if (typeof data === "string") return { content: data };
  return data ?? {};
}
