import React, { useState, useRef } from "react";
import styled from "styled-components";
import { postOcrSticker } from "../../api/client";
import { asset } from "../../config/assets";
import { generateStickerDataURL } from "../../lib/stickerCanvas";

const MY_STICKER_KEY = "safetag_my_sticker";

// 타입 통일 함수
const normalizeType = (t) => {
  const s = String(t || "").toLowerCase();
  if (s === "pregnant") return "PREGNANT";
  if (s === "disabled") return "DISABLED";
  if (s === "resident") return "RESIDENT";
  return "PREGNANT";
};

// YYYY-MM-DD 형식 변환
const toYmd = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

// 두 날짜 차이 계산 (음수면 0)
const diffDays = (fromISO, toISO) => {
  try {
    const a = new Date(fromISO);
    const b = new Date(toISO);
    const d = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 0;
  } catch {
    return 0;
  }
};

const StickerUpload = ({ onDone }) => {
  const [carNumber, setCarNumber] = useState("");
  const [validDays, setValidDays] = useState(""); //백에서
  const [dueDate, setDueDate] = useState(""); // 출산예정일(임산부용)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleUpload = async () => {
    setError("");

    const file = fileRef.current?.files?.[0];
    if (!file) return setError("파일을 선택하세요.");

    const jwt =
      localStorage.getItem("access_token") || localStorage.getItem("jwt") || "";
    if (!jwt) return setError("로그인이 필요합니다. (JWT 없음)");

    try {
      setLoading(true);

      // 기본은 서버 ocr 계산 . 사용자가 숫자 명시했을 때만 오버라이드
      const oveerideDays =
        String(validDays).trim() !== "" && Number.isFinite(Number(validDays))
          ? Number(validDays)
          : undefined;

      // 1) 서버 OCR + 발급
      const res = await postOcrSticker(file, jwt, {
        carNumber: carNumber || undefined,
        ...(overrideDays !== undefined ? { validDays: overrideDays } : {}),
      });

      const s = res?.sticker || res || {};

      // 2) 타입, 기본값
      const type =
        normalizeType(res?.stickerType) ||
        normalizeType(res?.type) ||
        "PREGNANT";

      const issueNo =
        s?.stickerId ||
        s?.id ||
        s?.issueNo ||
        Math.floor(100000000 + Math.random() * 900000000).toString();

      const issuedAt = toYmd(
        s?.issuedAt || s?.createdAt || new Date().toISOString()
      );

      // 유효기간: 서버가 내려준 값 우선 -> 없으면 dueDate -> validDays
      const expiresAt =
        toYmd(s?.expiresAt) ||
        (dueDate
          ? toYmd(dueDate)
          : toYmd(
              new Date(
                Date.now() + (Number(validDays) || 730) * 24 * 60 * 60 * 1000
              ).toISOString()
            ));

      // 3) 서버 완성 PNG 정보
      const payloadFromServer = {
        stickerId:
          s?.stickerId ||
          s?.id ||
          "DEV-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        type,
        imageUrl: s?.imageUrl, // 서버 완성 PNG
        carNumber: s?.carNumber || carNumber || "-",
        issuedAt,
        expiresAt,
        issuer: s?.issuer || "DEV",
      };

      let finalSticker = payloadFromServer;

      // 4) 서버 이미지가 없을 경우 캔버스 폴백
      if (!payloadFromServer.imageUrl) {
        try {
          const dataUrl = await generateStickerDataURL({
            type,
            carNumber: payloadFromServer.carNumber,
            issuedAt: payloadFromServer.issuedAt,
            expiresAt: payloadFromServer.expiresAt,
            stickerId: payloadFromServer.stickerId,
            width: 700,
          });
          finalSticker = { ...payloadFromServer, imageUrl: dataUrl };
        } catch (e) {
          console.warn("[sticker] canvas fallback failed:", e);
          finalSticker = {
            ...payloadFromServer,
            imageUrl: asset("Sticker.png"),
          };
        }
      }

      // 5) 로컬 저장
      localStorage.setItem(MY_STICKER_KEY, JSON.stringify(finalSticker));

      // 완료 콜백 or 이동
      if (typeof onDone === "function") onDone(finalSticker);
      else window.location.href = "/sticker";
    } catch (e) {
      console.error("[StickerUpload] error:", e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>서류 OCR → 스티커 발급</Title>

      <Input type="file" ref={fileRef} accept="image/*,application/pdf" />

      <Input
        type="text"
        placeholder="차량번호 (옵션)"
        value={carNumber}
        onChange={(e) => setCarNumber(e.target.value)}
      />

      <Input
        type="date"
        placeholder="출산예정일 (임산부일 때 권장)"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <Input
        type="number"
        placeholder="유효기간 (일)"
        value={validDays}
        onChange={(e) => setValidDays(e.target.value)}
        min={1}
      />

      <Button onClick={handleUpload} disabled={loading}>
        {loading ? "발급 중..." : "업로드 후 발급"}
      </Button>

      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
};

export default StickerUpload;

const Wrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  margin: 40px auto;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 12px;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  &:focus {
    border-color: #000;
  }
`;

const Button = styled.button`
  background: #000;
  color: #fff;
  font-weight: 600;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 4px;
  transition: all 0.2s ease;
  &:hover {
    background: #333;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #d33;
  font-size: 13px;
  white-space: pre-wrap;
  margin-top: 6px;
`;
