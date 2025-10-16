import { api } from "./index";

export interface MyPageResponse {
  name: string;
  email: string;
  gender: string;
  phoneNum: string;
  birthDate: string;
  vehicleNumber: string;
  address: string;
  company: string;
}
export type MyPageUpdateRequest = Partial<
  Pick<
    MyPageResponse,
    "name" | "phoneNum" | "vehicleNumber" | "address" | "company"
  >
>;

export const getMyPage = () => api.get<MyPageResponse>("/api/mypage");
export const updateMyPage = (data: MyPageUpdateRequest) =>
  api.put("/api/mypage/edit", data);
