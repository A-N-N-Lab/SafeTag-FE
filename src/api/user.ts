import { api } from "./index";

export interface UserSignUpReq {
  name: string;
  username: string;
  password1: string;
  password2: string;
  phoneNum: string;
  birthDate: string; // YYYY-MM-DD
  gender: "MALE" | "FEMALE";
  address: string;
  email?: string;
  vehicleNumber: String;
}
export const signUpUser = (d: UserSignUpReq) => api.post("/api/user/signup", d);
