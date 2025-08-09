import { api } from "./index";

export const createQr = (userId: number) => {
  return api.post("/qrs", { userId });
};

export const getQrImage = (qrId: number) => {
  return api.get(`/qrs/${qrId}/image`, { responseType: "blob" }); // PNG 이미지
};

export const getProxyPhone = (qrValue: string) => {
  return api.get(`/qrs/proxy-call`, { params: { qrValue } });
};
