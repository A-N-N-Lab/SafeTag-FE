import React, { useMemo } from "react";
import styled from "styled-components";

const STORAGE_KEY = "safetag_my_sticker";

const Title = () => <TitleBox>내 권한</TitleBox>;

const formatKoreanDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}년 ${m}월 ${day}일`;
};

const Sticker = () => {
  const sticker = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // 스티커가 없을 경우(아마도 거주민 스티커는 다 있을텐데 발급 전 )
  if (!sticker) {
    return (
      <EmptyContainer>
        <Title />
        <EmptyMessage>
          아직 발급된 스티커가 없습니다.
          <br />
          챗봇에서 인증 서류를 제출하고 스티커를 발급받아보세요!
        </EmptyMessage>
        <ChatbotButton onClick={() => (window.location.href = "/auth")}>
          챗봇 열기
        </ChatbotButton>
      </EmptyContainer>
    );
  }
  // 발급된 스티커 있을 경우
  const car = sticker?.carNumber ?? "-";
  const issued = formatKoreanDate(sticker?.issuedAt);
  const expires = formatKoreanDate(sticker?.expiresAt);
  const img = sticker?.imageUrl ?? "/Sticker.png";
  const issuer = sticker?.issuer ?? "SAFETAG";
  const title =
    sticker?.type === "PREGNANT"
      ? "임산부: 본인"
      : sticker?.type === "DISABLED"
      ? "장애인: 본인"
      : "거주민";

  return (
    <Container>
      <Title />
      <ProfileSection>
        <ProfileTitle>{title}</ProfileTitle>
        <ProfileImage src={img} alt={title} />
      </ProfileSection>

      <InfoBox>
        <InfoItem>차량 번호: {car}</InfoItem>
        <InfoItem>발급 일자: {issued}</InfoItem>
        <InfoItem>유효 기간: {expires}</InfoItem>
        <InfoItem>발급 기관: {issuer}</InfoItem>
      </InfoBox>
      {/* <Navbar /> */}
    </Container>
  );
};

export default Sticker;

// const Container = styled.div`
//   width: 100%;
//   max-width: 600px;
//   min-height: 100vh;
//   margin: 0 auto;
//   display: flex;
//   flex-direction: column;
// `;

const Container = styled.div`
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

const EmptyContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const EmptyMessage = styled.div`
  font-size: 18px;
  color: #444;
  margin-top: 20px;
  line-height: 1.6;
`;

const ChatbotButton = styled.button`
  margin-top: 25px;
  padding: 10px 18px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #0078ff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

// const TitleBox = styled.div`
//   background-color: #fff;
//   padding: 20px;
//   font-size: 24px;
//   font-weight: bold;
//   text-align: center;
//   margin-bottom: 30px;
// `;

const ProfileSection = styled.div`
  padding: 30px 20px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
  width: 100%;
`;

const ProfileImage = styled.img`
  width: 400px;
  height: auto;
  display: block;
`;

const InfoBox = styled.div`
  background-color: white;
  padding: 20px;
  margin-top: 10px;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  margin-bottom: 15px;
  font-size: 18px;
  color: #6b89b9;
`;
