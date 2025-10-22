export type StickerType = "RESIDENT" | "PREGNANT" | "DISABLED";

export interface StickerPayload {
  stickerId: string | number;
  type: StickerType;
  imageUrl: string;
  carNumber: string;
  issuedAt: string; // YYYY-MM-DD
  expiresAt: string; // YYYY-MM-DD
  issuer: string;
}

export interface OcrIssueResponse {
  status: "SUCCESS" | "FAILED";
  stickerType?: "pregnant" | "disabled" | "resident";
  ocrText?: string;
  reason?: string;
  sticker?: StickerPayload;
}

// localStorage 키
export const MY_STICKER_KEY = "safetag_my_sticker";

// 유틸
export const saveSticker = (s: StickerPayload) =>
  localStorage.setItem(MY_STICKER_KEY, JSON.stringify(s));

export const loadSticker = (): StickerPayload | null => {
  const raw = localStorage.getItem(MY_STICKER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
