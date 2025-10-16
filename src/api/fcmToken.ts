import { api } from "./index";

export async function saveFcmToken(token: string) {
  const res = await api.post("/api/fcm/register", { token });
  return res.data;
}
