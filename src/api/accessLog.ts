// 접속 로그 관련 api
import { api } from "./index";

export const saveAccessLog = (qrId: number, ip: string, userAgent: string) => {
  return api.post("/logs", { qrId, ip, userAgent });
};

export const getAccssLog = (qrId: number) => {
  return api.get(`/logs/qrs/${qrId}logs`);
};
