export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
export type ChatResponse = { content: string };

const BASE = import.meta.env.VITE_CHATBOT_BASE || import.meta.env.VITE_API_BASE;

const authHeader = (): Record<string, string> => {
  const t =
    localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export async function postChat(messages: ChatMessage[]): Promise<ChatResponse> {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
