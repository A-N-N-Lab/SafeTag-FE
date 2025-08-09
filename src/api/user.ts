import { api } from "./index";

export interface SignUpForm {
  name: string;
  username: string;
  password1: string;
  password2: string;
  gender: "MALE" | "FAMALE";
  phoneNum: string;
  birthDate: string;
  address: string;
  email?: string;
}

export const signUp = (data: SignUpForm) => api.post("/user/signup", data);
