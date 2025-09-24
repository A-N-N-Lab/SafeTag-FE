const API = import.meta.env.VITE_API_BASE;
export interface StartCallResponse {
  sessionId: string;
  ttlSeconds: number;
}
export async function startCall(
  qrUuid: string,
  callerUserId?: number
): Promise<StartCallResponse> {
  const res = await fetch(`${API}/api/calls/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qrUuid, callerUserId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
