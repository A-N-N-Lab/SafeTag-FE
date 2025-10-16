import { api } from "./index";

export const createQr = (userId: number) => {
  return api.post("/api/qrs", { userId });
};

export const getQrImage = (qrId: number) => {
  return api.get(`/api/qrs/${qrId}/image`, { responseType: "blob" }); // PNG 이미지
};

export const getProxyPhone = (qrValue: string) => {
  return api.get(`/api/qrs/proxy-call`, { params: { qrValue } });
};
