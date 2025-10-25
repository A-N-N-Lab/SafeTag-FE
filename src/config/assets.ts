// src/config/assets.ts
export const BASE = import.meta.env.BASE_URL || "/";
export const asset = (path: string) => `${BASE}${path.replace(/^\//, "")}`;

export const STICKER_TEMPLATE = {
  PREGNANT: asset("sticker_pregnant.png"),
  DISABLED: asset("sticker_disabled.png"),
  RESIDENT: asset("sticker_resident.png"),
} as const;
