import { api } from "./index";

export interface MyPageForm {
  name: string;
  email: string;
  phone: string;
  carNumber: string;
  apartmentInfo: string;
  permission: string;
}

export const getMyPage = () => api.get("/mypage");
export const updateMyPage = (data: MyPageForm) => api.put("/mypage/edit", data);
