import { api } from ".";

export interface StartCallResponse {
  sessionId: string;
  ttlSeconds: number;
}

export async function startCall(
  qrUuid: string,
  callerUserId?: number
): Promise<StartCallResponse> {
  const { data } = await api.post("/api/calls/start", {
    qrUuid: qrUuid,
    callerUserId: callerUserId,
  });
  return data;
}
