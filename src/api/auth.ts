import { api } from "./index";

export const login = (credentials: { username: string; password: string }) =>
  api.post("/auth/login", credentials);
