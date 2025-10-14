import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const QrLandingPage = () => {
  const { uuid } = useParams();
  const [role, setRole] = useState("loading");
  const [msg, setMsg] = useState("유효성 확인 중 ... ");

  useEffect(() => {
    (async () => {
      try {
        // 1) 스캔 로그
        const scan = await api.post(`/qrs/${uuid}/scan-log`);
        if (scan.status < 200 || scan.status >= 300)
          throw new Error(`scan ${scan.status}`);
        try {
          const me = await api.get(`/me`);
          setRole(me.status === 200 ? "admin" : "visitor");
        } catch {
          setRole("visitor");
        }
        setMsg("스캔이 기록되었습니다.");
      } catch (e) {
        setRole("error");
        setMsg(`오류: ${e.message}`);
      }
    })();
  }, [uuid]);
  if (role === "loading") return <p>{msg}</p>;
  if (role === "error") return <p>{msg}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1>SafeTag</h1>
      <p>{msg}</p>
      {role === "visitor" && (
        <>
          <p>차주에게 연락할 수 있어요.</p>
          {/* 시연 모드: tel 링크로 대체 가능 */}
          <a href="tel:010-1234-5678">전화 걸기</a>
          {/* 실제 연결: fetch('/api/call/request', {method:'POST', body: JSON.stringify({ uuid })}) */}
        </>
      )}
      {role === "admin" && (
        <>
          <p>관리자 화면입니다. 스캔 요청을 확인하세요.</p>
          {/* 예: 대기중 요청 목록, 승인/거절 등 */}
        </>
      )}
    </main>
  );
};

export default QrLandingPage;
