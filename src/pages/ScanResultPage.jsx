import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../api";
import { startCall } from "../api/call";

export default function ScanResultPage() {
  const nav = useNavigate();
  const { uuid } = useParams();
  const [params] = useSearchParams();
  const code = uuid || params.get("code");

  // 상태
  const [phase, setPhase] = useState("loading"); // loading | ready | invalid | error
  const [reason, setReason] = useState("");
  const [role, setRole] = useState("visitor"); // visitor | admin | owner? (필요시 확장)
  const [qrId, setQrId] = useState(null);

  // 뷰 데이터(백 단 /api/qrs/{qrId}/view 응답 가정)
  const [profile, setProfile] = useState({
    vehicleNumber: "",
    ownerNameMasked: "",
    apartment: "", // 예: "듀피오나 A동 101호"
    stickers: {
      resident: false, // 거주 스티커
      disabled: false, // 장애인
      pregnancy: false, // 임산부
    },
    note: "", // 선택: 안내 문구
  });

  const [calling, setCalling] = useState(false);

  // 공용: 알록달록 카드용 색
  const badges = [
    { key: "resident", label: "아파트 스티커", color: "#2563eb" },
    { key: "disabled", label: "장애인 등록증", color: "#16a34a" },
    { key: "pregnancy", label: "임산부 스티커", color: "#db2777" },
  ];

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!code) {
          setPhase("invalid");
          setReason("NO_CODE");
          return;
        }

        // 0) 내 역할
        try {
          const me = await api.get("/me", { validateStatus: () => true });
          if (
            me.status === 200 &&
            (me.data?.role === "ADMIN" ||
              me.data?.role === "OWNER" ||
              me.data?.role === "USER")
          ) {
            setRole(me.data.role === "ADMIN" ? "admin" : "visitor");
          } else {
            setRole("visitor");
          }
        } catch {
          setRole("visitor");
        }

        // 1) by-code 로 유효성 + qrId 얻기
        const v = await api.get(`/qrs/by-code/${encodeURIComponent(code)}`, {
          validateStatus: () => true,
        });
        if (v.status !== 200 || v.data?.valid === false) {
          setPhase("invalid");
          setReason(v.data?.reason || `HTTP_${v.status}`);
          return;
        }
        const theQrId = v.data?.qrId ?? v.data?.id ?? null;
        setQrId(theQrId);

        // 2) 상세 뷰
        if (theQrId != null) {
          const view = await api.get(`/qrs/${theQrId}/view`, {
            validateStatus: () => true,
          });
          if (view.status === 200 && alive) {
            // 응답 필드명은 서버에 맞춰 매핑
            const d = view.data || {};
            const isAdminMode = d.mode === "ADMIN" || d.mode === "OWNER";
            setProfile({
              vehicleNumber: d.vehicleMask ?? "",
              ownerNameMasked: isAdminMode ? d.admin?.ownerMask ?? "" : "",
              apartment: isAdminMode ? d.admin?.address ?? "" : "",
              stickers: {
                resident: !!(isAdminMode ? d.admin?.resident : false),
                disabled: !!(isAdminMode ? d.admin?.disabled : false),
                pregnancy: !!(isAdminMode ? d.admin?.maternity : false),
              },
              note: isAdminMode ? d.admin?.note ?? "" : "",
            });
          }
        }

        if (alive) setPhase("ready");
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setPhase("error");
        setReason("NETWORK_ERROR");
      }
    })();
    return () => {
      alive = false;
    };
  }, [code]);

  const onStartCall = async () => {
    try {
      setCalling(true);
      const { sessionId } = await startCall(code, undefined);
      nav(`/call/${encodeURIComponent(sessionId)}`, { replace: true });
    } catch (e) {
      console.error(e);
      alert("통화 세션 생성 실패");
    } finally {
      setCalling(false);
    }
  };

  // 상태별 화면
  if (phase === "loading")
    return (
      <Shell>
        <Center>확인 중...</Center>
      </Shell>
    );
  if (phase === "invalid")
    return (
      <Shell>
        <Center>사용 불가: {reason}</Center>
      </Shell>
    );
  if (phase === "error")
    return (
      <Shell>
        <Center>오류: {reason}</Center>
      </Shell>
    );

  // ready
  const stickerActive = Object.entries(profile.stickers).some(([_, v]) => v);

  return (
    <Shell>
      <Header>SafeTag</Header>

      {/* vehicle & owner */}
      <Card>
        <Row>
          <Label>차량번호</Label>
          <Value big>{profile.vehicleNumber || "-"}</Value>
        </Row>
        <Row>
          <Label>차주</Label>
          <Value>{profile.ownerNameMasked || "-"}</Value>
        </Row>
        {profile.apartment && (
          <Row>
            <Label>주소</Label>
            <Value>{profile.apartment}</Value>
          </Row>
        )}
        {profile.note && <Note>{profile.note}</Note>}
      </Card>

      {/* 스티커 / 역할 분기 */}
      {profile.note !== "" || Object.values(profile.stickers).some(Boolean) ? (
        <Card>
          <SectionTitle>인증/스티커</SectionTitle>
          {stickerActive ? (
            <BadgeWrap>
              {badges.map((b) =>
                profile.stickers[b.key] ? (
                  <Badge key={b.key} style={{ background: b.color }}>
                    {b.label}
                  </Badge>
                ) : null
              )}
            </BadgeWrap>
          ) : (
            <Muted>등록된 스티커가 없습니다.</Muted>
          )}
        </Card>
      ) : (
        <CTA>
          <CtaTitle>차주에게 연락하기</CtaTitle>
          <PrimaryBtn onClick={onStartCall} disabled={calling}>
            {calling ? "세션 생성 중..." : "익명 통화 시작"}
          </PrimaryBtn>
          <Hint>통화는 개인 번호를 노출하지 않고 연결됩니다.</Hint>
        </CTA>
      )}

      <FootNote>
        code: <code>{code}</code>
      </FootNote>
    </Shell>
  );
}

const Shell = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 16px 16px 28px;
  background: #fafafa;
  min-height: 100vh;
`;
const Header = styled.h1`
  font-size: 22px;
  font-weight: 800;
  margin: 6px 0 14px;
`;
const Center = styled.div`
  padding: 24px;
  text-align: center;
  color: #374151;
`;
const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 16px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  & + & {
    margin-top: 10px;
  }
`;
const Label = styled.div`
  color: #6b7280;
  font-size: 13px;
`;
const Value = styled.div`
  color: #111827;
  font-weight: ${(p) => (p.big ? 800 : 700)};
  font-size: ${(p) => (p.big ? "20px" : "15px")};
  word-break: break-all;
`;
const Note = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #374151;
  background: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  padding: 10px;
`;
const SectionTitle = styled.div`
  font-weight: 800;
  font-size: 14px;
  margin-bottom: 10px;
`;
const BadgeWrap = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const Badge = styled.span`
  display: inline-block;
  color: #fff;
  font-weight: 800;
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 9999px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
`;
const Muted = styled.div`
  color: #6b7280;
  font-size: 14px;
  padding: 4px 2px;
`;
const CTA = styled(Card)`
  text-align: center;
`;
const CtaTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 8px;
`;
const PrimaryBtn = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
  background: #111827;
  color: #fff;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
const Hint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
`;
const FootNote = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
`;
