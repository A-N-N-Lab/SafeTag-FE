import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { startCall } from "../api/call"; // 새로 만든 API 모듈 사용

const ScanResultPage = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [params] = useSearchParams();
  // 겸용: /qr/:uuid 또는 /scan?code=... 모두 허용
  const code = uuid || params.get("code");

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [reason, setReason] = useState("");
  const [starting, setStarting] = useState(false); // 통화 세션 생성 중

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!code) {
        if (alive) {
          setLoading(false);
          setValid(false);
          setReason("NO_CODE");
        }
        return;
      }
      try {
        // QR 유효성 확인 (백엔드 스펙에 맞춰 경로/응답 필드 확인)
        const { data, status } = await api.get(
          `/qrs/${encodeURIComponent(code)}`,
          {
            validateStatus: () => true,
          }
        );
        if (!alive) return;
        if (status === 200 && (data?.valid ?? true)) {
          setValid(true);
          setReason("");
        } else {
          setValid(false);
          setReason(data?.reason || `HTTP_${status}`);
        }
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
      // callerUserId가 필요 없으면 undefined로
      const { sessionId } = await startCall(code, undefined);
      navigate(`/call/${encodeURIComponent(sessionId)}`, { replace: true });
    } catch (e) {
      console.error(e);
      alert("통화 세션 생성 실패");
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>확인 중...</div>;
  if (!valid) return <div style={{ padding: 16 }}>사용 불가: {reason}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h3>차주에게 연락하기</h3>

      <button
        onClick={handleStartCall}
        disabled={starting}
        style={{ marginRight: 8 }}
      >
        {starting ? "세션 생성 중..." : "익명 통화 시작"}
      </button>

      {/* 데모용 플랜B */}
      <a href="tel:0507-123-4567">
        <button>전화앱으로 통화(임시)</button>
      </a>

      <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        code: <code>{code}</code>
      </p>
    </div>
  );
};
export default ScanResultPage;
