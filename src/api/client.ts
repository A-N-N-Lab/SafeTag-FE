// const CHATBOT_BASE = import.meta.env.VITE_CHATBOT_BASE ?? "http://localhost:8000";

// export async function postOcrSticker(
//   file: File,
//   jwt: string,
//   opts?: { carNumber?: string; validDays?: number }
// ) {
//   const fd = new FormData();
//   fd.append("file", file);
//   if (opts?.carNumber) fd.append("carNumber", opts.carNumber);
//   if (opts?.validDays != null) fd.append("validDays", String(opts.validDays));

//   const res = await fetch(`${CHATBOT_BASE}/ocr/sticker`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${jwt}` },
//     body: fd,
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`OCR/발급 실패: ${res.status} ${text}`);
//   }
//   return (await res.json());
// }

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
export type ChatResponse = { content: string };

const CHATBOT_BASE =
  (import.meta.env.VITE_CHATBOT_BASE as string | undefined)?.replace(
    /\/+$/,
    ""
  ) || "http://127.0.0.1:8000";

const authHeader = (): Record<string, string> => {
  const t =
    localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export async function postOcrSticker(
  file: File,
  jwt: string,
  opts?: { carNumber?: string; validDays?: number }
) {
  const fd = new FormData();
  fd.append("file", file);
  if (opts?.carNumber) fd.append("carNumber", opts.carNumber);
  if (opts?.validDays != null) fd.append("validDays", String(opts.validDays));

  const res = await fetch(`${CHATBOT_BASE}/ocr/sticker`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: fd,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OCR/발급 실패: ${res.status} ${text}`);
  }
  return res.json();
}

export async function postChat(messages: ChatMessage[]): Promise<ChatResponse> {
  const res = await fetch(`${CHATBOT_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
