// src/components/Sticker/StickerUpload.jsx
import React, { useState, useRef } from "react";
import { postOcrSticker } from "../../api/client";
import { asset, STICKER_TEMPLATE } from "../../config/assets";

const MY_STICKER_KEY = "safetag_my_sticker";

// 서버 소문자 타입 → 클라이언트 대문자 타입 정규화
const normalizeStickerType = (t) => {
  switch (String(t || "").toLowerCase()) {
    case "pregnant":
      return "PREGNANT";
    case "disabled":
      return "DISABLED";
    case "resident":
      return "RESIDENT";
    default:
      return "PREGNANT";
  }
};

// ISO 를 YYYY-MM-DD 로 저장
const toYmd = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

// 이미지 URL을 절대경로로 변환 + 타입별 템플릿 폴백
const resolveStickerImage = (type, candidate) => {
  if (candidate) {
    const isAbs = /^https?:\/\//i.test(candidate);
    return isAbs ? candidate : asset(candidate);
  }
  return STICKER_TEMPLATE[type] || asset("Sticker.png");
};

const StickerUpload = ({ onDone }) => {
  const [carNumber, setCarNumber] = useState("");
  const [validDays, setValidDays] = useState(730); // 기본 2년
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // 원본 응답 일부 표시
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleUpload = async () => {
    setError("");
    setResult(null);

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("파일을 선택하세요.");
      return;
    }

    const jwt =
      localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";

    if (!jwt) {
      setError("로그인이 필요합니다. (JWT 없음)");
      return;
    }

    try {
      setLoading(true);

      // 발급 요청
      const res = await postOcrSticker(file, jwt, {
        carNumber: carNumber || undefined,
        validDays: Number.isFinite(Number(validDays))
          ? Number(validDays)
          : undefined,
      });

      // 타입/이미지 결정
      // 서버가 stickerType(소문자) 또는 type(대문자)을 줄 수 있음 → 우선순위대로 처리
      const type =
        normalizeStickerType(res?.stickerType) ||
        normalizeStickerType(res?.type) ||
        "PREGNANT";

      const imageUrl = resolveStickerImage(
        type,
        res?.imageUrl || res?.stickerImageUrl || res?.url
      );

      // 스티커 payload 구성 (YYYY-MM-DD 형태로 저장)
      const sticker = {
        stickerId: res?.stickerId || res?.id || res?.issueNo || "",
        type,
        carNumber: res?.carNumber || res?.vehicleNumber || carNumber || "",
        issuedAt: toYmd(
          res?.issuedAt || res?.createdAt || new Date().toISOString()
        ),
        expiresAt: toYmd(res?.expiresAt || res?.expireAt || ""),
        imageUrl,
        issuer: res?.issuer || res?.issuedBy || "SAFETAG",
      };

      // 저장 → 스티커 페이지에서 사용
      localStorage.setItem(MY_STICKER_KEY, JSON.stringify(sticker));

      setResult(res);

      // 완료 콜백 또는 이동
      if (typeof onDone === "function") onDone(sticker);
      else window.location.href = "/sticker";
    } catch (e) {
      console.error("[StickerUpload] issue error:", e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border">
      <h2 className="font-bold mb-2">서류 OCR → 스티커 발급</h2>

      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileRef}
          accept="image/*,application/pdf"
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="차량번호(옵션)"
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="유효기간(일) 기본 730"
          value={validDays}
          onChange={(e) => setValidDays(e.target.value)}
          className="border p-2 rounded"
          min={1}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-black text-white rounded p-2 disabled:opacity-50"
        >
          {loading ? "발급 중..." : "업로드 후 발급"}
        </button>

        {error && (
          <div className="text-red-600 text-sm whitespace-pre-wrap">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-3 text-sm">
            <div>
              스티커 ID: <b>{result.stickerId || result.id || "-"}</b>
            </div>
            <div>만료: {result.expiresAt || result.expireAt || "-"}</div>
            {result.imageUrl && (
              <a
                className="text-blue-600 underline"
                href={
                  /^https?:\/\//i.test(result.imageUrl)
                    ? result.imageUrl
                    : asset(result.imageUrl)
                }
                target="_blank"
                rel="noreferrer"
              >
                스티커 이미지 열기
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickerUpload;
