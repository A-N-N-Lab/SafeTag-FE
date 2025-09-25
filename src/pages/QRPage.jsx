import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

const QR = () => {
  const totalTime = 60; // 초
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [nonce, setNonce] = useState(Date.now()); // 캐시 무력화용

  // 1) 타이머: 마운트 시 1개만
  useEffect(() => {
    const id = setInterval(() => {
      setRemainingTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // 2) 진행률 계산
  const progressWidth = useMemo(
    () => (remainingTime / totalTime) * 100,
    [remainingTime, totalTime]
  );

  // 3) 0초 되면 QR 재생성
  useEffect(() => {
    if (remainingTime === 0) handleRefresh();
  }, [remainingTime]);

  const handleRefresh = () => {
    // TODO: 여기서 백엔드 호출해서 새로운 QR 이미지/데이터를 받아오면 진짜 재생성
    setNonce(Date.now()); // 캐시 무력화
    setRemainingTime(totalTime);
  };

  // public/myQR.png 가 있어야 함
  const qrSrc = `/myQR.png?t=${nonce}`;

  return (
    <Container>
      <TitleBox>QR</TitleBox>

      <ProfileSection>
        <ProfileTitle>123가 1234</ProfileTitle>
        <img
          src={qrSrc}
          alt="내 큐알"
          style={{ width: 200, marginBottom: 20 }}
        />
      </ProfileSection>

      <OvalContainer>
        <ProgressBar style={{ width: `${progressWidth}%` }} />
      </OvalContainer>
      <RemainingTimeText>남은시간: {remainingTime}초</RemainingTimeText>

      <RetryButton onClick={handleRefresh}>QR 재생성</RetryButton>
    </Container>
  );
};

export default QR;

// ===== styled-components 그대로 사용 =====
const Container = styled.div`
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
`;
const TitleBox = styled.div`
  background-color: #fff;
  padding: 20px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
  box-sizing: border-box;
`;
const ProfileSection = styled.div`
  padding: 30px 20px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileTitle = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
  width: 100%;
`;
const OvalContainer = styled.div`
  width: 80%;
  height: 15px;
  background-color: #d3d3d3;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  margin-top: 0;
  margin-left: 10%;
`;
const ProgressBar = styled.div`
  height: 100%;
  background-color: #ffd700;
  transition: width 1s linear;
`;
const RemainingTimeText = styled.div`
  margin-top: 10px;
  padding-right: 30px;
  text-align: right;
  font-size: 18px;
  font-weight: bold;
`;
const RetryButton = styled.button`
  width: 80%;
  margin-top: 80px;
  margin-left: 10%;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  background-color: #6b89b9;
  color: #fff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  &:hover {
    background-color: rgba(43, 94, 148, 1);
  }
`;
