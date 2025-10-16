// 접속 로그 관련 api
import { api } from "./index";

export const saveAccessLog = (qrId: number, ip: string, userAgent: string) => {
  return api.post("/api/logs", { qrId, ip, userAgent });
};

export const getAccssLog = (qrId: number) => {
  return api.get(`/api/logs/qrs/${qrId}logs`);
};
