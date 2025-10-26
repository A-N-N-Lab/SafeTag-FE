import { api } from "./index";

export interface MyPageRaw {
  // 백엔드가 data 래핑할 수도 있어 대비
  data?: any;

  // 평평한 구조로 올 때를 대비
  name?: string;
  email?: string; // 팀원 코드에선 username일 수도 있음
  username?: string; // 백엔드 테이블엔 username 컬럼
  gender?: string;
  phoneNum?: string;
  birthDate?: string;
  address?: string;
  company?: string;

  // 차량번호 키 혼재 대비
  carNumber?: string | null;
  vehicleNumber?: string | null;
}

export interface MyPage {
  name: string;
  email?: string;
  gender: string;
  phoneNum: string;
  birthDate: string;
  carNumber: string | null; // 내부 표준 키는 carNumber
  address: string;
  company?: string;
}

// 응답 정규화
const normalizeMyPage = (raw: MyPageRaw): MyPage => {
  const src = (raw && (raw.data || raw)) || {};
  return {
    name: src.name ?? "",
    email: src.email ?? src.username ?? undefined,
    gender: src.gender ?? "",
    phoneNum: src.phoneNum ?? "",
    birthDate: src.birthDate ?? "",
    carNumber: src.carNumber ?? src.vehicleNumber ?? null,
    address: src.address ?? "",
    company: src.company ?? undefined,
  };
};

export type MyPageUpdateRequest = Partial<
  Pick<MyPage, "name" | "phoneNum" | "carNumber" | "address" | "company">
>;

// GET /api/mypage
export const getMyPage = async (): Promise<MyPage> => {
  const res = await api.get<MyPageRaw>("/api/mypage");
  return normalizeMyPage(res.data);
};

// PUT /api/mypage/edit
export const updateMyPage = (
  data: Partial<MyPageUpdateRequest> & { vehicleNumber?: string }
) => {
  // vehicleNumber로 들어오면 carNumber로 변환
  const payload: Record<string, any> = { ...data };
  if (payload.vehicleNumber && !payload.carNumber) {
    payload.carNumber = payload.vehicleNumber;
  }
  delete payload.vehicleNumber;

  return api.put("/api/mypage/edit", payload);
};
