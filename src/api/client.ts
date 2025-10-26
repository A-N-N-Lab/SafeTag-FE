/// <reference types="vite/client" />

export type Sticker = {
  stickerId: string;
  type: "PREGNANT" | "DISABLED" | "RESIDENT" | string;
  carNumber: string;
  issuedAt: string;
  expiresAt: string | null;
  imageUrl: string;
  issuer: string;
  apartmentName?: string | null;
  residentAddressMatched?: boolean | null;
};

const CHATBOT_BASE =
  (import.meta.env.VITE_CHATBOT_BASE as string | undefined)?.replace(
    /\/+$/,
    ""
  ) || "http://127.0.0.1:8000";

const fmtDue = (d?: string | Date) => {
  if (!d) return "";
  if (typeof d === "string") return d; // "2026.08.22" 또는 "2026-08-22"
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};

export async function postOcrSticker(
  file: File,
  jwt: string,
  opts?: { carNumber?: string; validDays?: number; dueDate?: string | Date }
): Promise<
  | {
      status: "SUCCESS";
      sticker: Sticker;
      debug?: any;
      ocrText?: string;
      stickerType?: string;
    }
  | { status: "FAILED"; reason: string; ocrText?: string }
> {
  const fd = new FormData();
  fd.append("file", file);
  if (opts?.carNumber) fd.append("carNumber", opts.carNumber);
  if (opts?.validDays != null) fd.append("validDays", String(opts.validDays));
  if (opts?.dueDate) fd.append("dueDate", fmtDue(opts.dueDate));

  const res = await fetch(`${CHATBOT_BASE}/ocr/sticker`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` }, // FormData: Content-Type 자동
    body: fd,
  });

  // 네트워크/HTTP 레벨만 예외로
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OCR/발급 실패: ${res.status} ${text}`);
  }

  // 비즈니스 실패는 그대로 반환({status:"FAILED"})
  return (await res.json()) as any;
}
