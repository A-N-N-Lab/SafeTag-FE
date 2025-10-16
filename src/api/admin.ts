import { api } from "./index";

export interface AdminSignUpReq {
  name: string;
  username: string;
  password1: string;
  password2: string;
  phoneNum: string;
  birthDate: string; // YYYY-MM-DD
  gender: "MALE" | "FEMALE";
  company: string;
  email?: string;
}
export const signUpAdmin = (d: AdminSignUpReq) =>
  api.post("/api/admin/signup", d);
