import { api } from "./index";

export const login = (credentials: { username: string; password: string }) =>
  api.post("/api/auth/login", credentials);
