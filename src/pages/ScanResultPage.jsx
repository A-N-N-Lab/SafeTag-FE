// src/pages/ScanResultPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { startCall } from "../api/call"; // 새로 만든 API 모듈 사용

const API = import.meta.env.VITE_API_BASE;

export default function ScanResultPage() {
  const [params] = useSearchParams();
  const code = params.get("code");

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [reason, setReason] = useState("");
  const [starting, setStarting] = useState(false); // 통화 세션 생성 중

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!code) {
        setLoading(false);
        setValid(false);
        setReason("NO_CODE");
        return;
      }
      try {
        const res = await fetch(`${API}/api/qrs/${encodeURIComponent(code)}`);
        const data = await res.json();
        if (!alive) return;
        // 서버가 404일 때도 json은 올 수 있으므로 valid 필드 기준으로 처리
        setValid(!!data.valid);
        setReason(data.reason || "");
      } catch (e) {
        if (!alive) return;
        setValid(false);
        setReason("NETWORK_ERROR");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [code]);

  const handleStartCall = async () => {
    try {
      setStarting(true);
      // callerUserId가 필요 없다면 null/undefined 전달
      const { sessionId } = await startCall(code, null);
      window.location.href = `/call/${encodeURIComponent(sessionId)}`;
    } catch (e) {
      alert("통화 세션 생성 실패");
      // 콘솔에서 상세 에러 확인
      console.error(e);
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>확인 중...</div>;
  if (!valid) return <div style={{ padding: 16 }}>사용 불가: {reason}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h3>차주에게 연락하기</h3>

      {/* WebRTC 익명 통화(시그널링 + coturn 필요) */}
      <button
        onClick={handleStartCall}
        disabled={starting}
        style={{ marginRight: 8 }}
      >
        {starting ? "세션 생성 중..." : "익명 통화 시작"}
      </button>

      {/* 플랜 B: 기기 전화앱으로 바로 통화(데모 안정용) */}
      <a href="tel:0507-123-4567">
        <button>전화앱으로 통화(임시)</button>
      </a>

      <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        code: <code>{code}</code>
      </p>
    </div>
  );
}
