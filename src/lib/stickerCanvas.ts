import { asset } from "../config/assets";

export type StickerType = "PREGNANT" | "DISABLED" | "RESIDENT";

const TEMPLATE_SRC: Record<StickerType, string> = {
  PREGNANT: asset("sticker_pregnant.png"),
  DISABLED: asset("sticker_disabled.png"),
  RESIDENT: asset("sticker_resident.png"),
};

const POS = {
  PREGNANT: {
    x: 130,
    idY: 370,
    carY: 410,
    issuedY: 450,
    expY: 490,
    font: "bold 28px Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif",
  },
  DISABLED: {
    x: 130,
    idY: 390,
    carY: 430,
    issuedY: 470,
    expY: 510,
    font: "bold 28px Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif",
  },
  RESIDENT: {
    x: 130,
    idY: 390,
    carY: 430,
    issuedY: 470,
    expY: 510,
    font: "bold 28px Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif",
  },
} as const;

const ymd = (s: string) => {
  try {
    return new Date(s).toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // same-origin이면 crossOrigin 안 건드립니다.
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`));
    img.src = src;
  });
}

export async function generateStickerDataURL(opts: {
  type: StickerType;
  carNumber: string;
  issuedAt: string;
  expiresAt: string;
  stickerId: string | number;
  width?: number;
}): Promise<string> {
  const base = await loadImage(TEMPLATE_SRC[opts.type]);
  const width = opts.width ?? 700;
  const ratio = base.naturalHeight / base.naturalWidth || 1;
  const height = Math.round(width * ratio);
  const dpr = window.devicePixelRatio || 1;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D 컨텍스트 생성 실패");

  ctx.scale(dpr, dpr);
  ctx.drawImage(base, 0, 0, width, height);

  const P = POS[opts.type];
  ctx.font = P.font;
  ctx.fillStyle = "#222";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillText(
    `발급번호: ${String(opts.stickerId)}`,
    P.x,
    (P.idY * width) / 700
  );
  ctx.fillText(
    `차량번호: ${opts.carNumber || "-"}`,
    P.x,
    (P.carY * width) / 700
  );
  ctx.fillText(
    `발급일자: ${ymd(opts.issuedAt) || "-"}`,
    P.x,
    (P.issuedY * width) / 700
  );
  ctx.fillText(
    `유효기간: ${ymd(opts.expiresAt) || "-"}`,
    P.x,
    (P.expY * width) / 700
  );

  const url = canvas.toDataURL("image/png");
  if (!url.startsWith("data:image/png")) {
    throw new Error("toDataURL 실패");
  }
  return url;
}
