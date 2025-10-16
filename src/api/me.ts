import { api } from "./index";

export interface MeResponse {
  id: number;
  username: string;
  name: string;
}

export const getMe = async () => {
  const { data } = await api.get<MeResponse>("/api/mypage");
  return data;
};
