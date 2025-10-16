import { api } from "./index";

export interface LoginResponse {
  token: string;
}

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  const { data } = await api.post<LoginResponse>(
    "/api/auth/login",
    credentials
  );
  return data;
};
