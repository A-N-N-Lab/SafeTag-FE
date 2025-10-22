import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as ZXingBrowser from "@zxing/browser";

const QRPage = () => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("스캔 준비 완료");
  const [secure, setSecure] = useState(true); // HTTPS 여부  아마 안 될 듯 .. ?

  useEffect(() => {
    // HTTPS(또는 localhost)가 아니면 getUserMedia 제한 가능
    const isLocalhost =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";
    setSecure(window.isSecureContext || isLocalhost);
    return () => stopScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScan = async () => {
    if (!secure) {
      setMessage(
        "HTTPS 환경이 아니어서 카메라 권한이 제한될 수 있어요. 아래 '사진으로 스캔'을 사용하세요."
      );
      return;
    }
    try {
      setMessage("카메라 권한 요청 중...");
      const reader = new ZXingBrowser.BrowserMultiFormatReader();
      codeReaderRef.current = reader;

      // 후면 카메라 우선
      const devices =
        await ZXingBrowser.BrowserCodeReader.listVideoInputDevices();
      const backCam = devices.find((d) =>
        /back|rear|environment/i.test(d.label)
      );
      const deviceId = backCam?.deviceId || devices[0]?.deviceId;

      setMessage("스캔 중... QR에 맞춰주세요");
      setScanning(true);

      reader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            const text = result.getText?.() || result.text;
            handleDecoded(text);
          }
          // err는 스캔 중 발생하는 노이즈이므로 무시 (NotFoundException 등)
        }
      );
    } catch (e) {
      console.error(e);
      setMessage("카메라를 열 수 없어요. '사진으로 스캔'을 사용하세요.");
      setScanning(false);
    }
  };

  const stopScan = () => {
    try {
      codeReaderRef.current?.reset?.();
      codeReaderRef.current?.stopContinuousDecode?.();
    } catch {}
    // 비디오 스트림 정리
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleDecoded = (text) => {
    stopScan();
    setMessage(`인식됨: ${text}`);

    // 디코드된 값이 http(s) URL이면 그대로 이동
    try {
      const u = new URL(text);
      if (u.protocol === "http:" || u.protocol === "https:") {
        window.location.href = text;
        return;
      }
    } catch {}
    // URL이 아니라면, SafeTag 규칙(예: uuid만 담긴 경우)에 맞춰 라우팅
    // 예: abcdef-uuid → /qr/:uuid 로 이동
    if (/^[a-z0-9-]{8,}$/i.test(text)) {
      window.location.href = `/qr/${text}`;
    }
  };

  // Fallback: 파일(사진)로 스캔
  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("이미지에서 QR 인식 중...");
    try {
      const url = URL.createObjectURL(file);
      // decodeFromImageUrl은 CORS 없이 로컬 blob도 OK
      const reader = new ZXingBrowser.BrowserQRCodeReader();
      const result = await reader.decodeFromImageUrl(url);
      URL.revokeObjectURL(url);
      const text = result.getText?.() || result.text;
      handleDecoded(text);
    } catch (err) {
      console.error(err);
      setMessage("인식 실패. 사진을 다시 찍어주세요.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <Wrap>
      <TitleBox>QR 스캔</TitleBox>

      <VideoBox>
        <Video ref={videoRef} playsInline muted />
        <ScanGuide />
      </VideoBox>

      <Msg>{message}</Msg>

      <Buttons>
        {!scanning ? (
          <Btn onClick={startScan}>카메라로 스캔 시작</Btn>
        ) : (
          <DangerBtn onClick={stopScan}>스캔 중지</DangerBtn>
        )}
      </Buttons>

      {/* HTTPS가 아니거나 권한 문제 있을 때 대안 */}
      <AltBox>
        <AltLabel>사진으로 스캔 (HTTPS 필요 없음)</AltLabel>
        <FileInputLabel htmlFor="qr-file">사진 선택 / 촬영</FileInputLabel>
        <HiddenFile
          id="qr-file"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPickImage}
        />
      </AltBox>
    </Wrap>
  );
};

export default QRPage;

const Wrap = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 16px 16px 40px;
`;
const TitleBox = styled.h1`
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
`;
const VideoBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: #000;
  border-radius: 16px;
  overflow: hidden;
`;
const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ScanGuide = styled.div`
  position: absolute;
  inset: 0;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);
  border: 2px solid rgba(255, 255, 255, 0.8);
  margin: 12% 10%;
  border-radius: 12px;
  pointer-events: none;
`;
const Msg = styled.div`
  margin: 12px 4px;
  text-align: center;
  color: #374151;
  font-weight: 600;
`;
const Buttons = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;
const Btn = styled.button`
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: 700;
`;
const DangerBtn = styled(Btn)`
  background: #b91c1c;
`;
const AltBox = styled.div`
  margin-top: 16px;
  text-align: center;
`;
const AltLabel = styled.div`
  color: #6b7280;
  font-size: 12px;
  margin-bottom: 6px;
`;
const FileInputLabel = styled.label`
  display: inline-block;
  background: #6b89b9;
  color: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 700;
  cursor: pointer;
`;
const HiddenFile = styled.input`
  display: none;
`;
