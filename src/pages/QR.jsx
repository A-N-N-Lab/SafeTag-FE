import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/home/Navbar';

// 컨테이너
const Container = styled.div`
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #f0f0f0; /* 연한 회색 배경 */
  display: flex;
  flex-direction: column;
`;

// 제목 박스 (수정: 좌우 여백 포함)
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

// 사진 섹션
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

const ProfileImage = styled.img`
  width: 300px; /* 크기 조절 가능 */
  height: auto;
  display: block; /* 가운데 정렬 */
  margin: 0 auto;
`;

// 타원형 시간 진행 배경
const OvalContainer = styled.div`
  width: 80%;
  height: 15px;
  background-color: #d3d3d3; /* 회색 바탕 */
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  margin-top: 0px;
  margin-left: 10%;
`;

// 시간 진행 부분 (노란색)
const ProgressBar = styled.div`
  height: 100%;
  background-color: #ffd700; /* 노란색 */
  width: ${(props) => props.width}%; /* 진행률에 따라 폭 변경 */
  transition: width 1s linear;
`;

const RemainingTimeText = styled.div`
  margin-top: 10px;
  padding-right: 30px; /* 오른쪽 여백 추가 */
  text-align: right;
  font-size: 18px;
  font-weight: bold;
`;

const RetryButton = styled.button`
  width: 80%;
  margin-top: 80px;
  margin-left: 10%;
  padding: 12px 24px; /* 더 여유롭게 조절 */
  font-size: 16px;
  cursor: pointer;
  background-color: #6B89B9; /* 파랑색 */
  color: #fff; /* 하얀색 글씨 */
  border: none;
  border-radius: 8px; /* 둥근 모서리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(43, 94, 148, 1); /* hover 시 색상 변경 */
  }
`;

const QR = () => {
  const totalTime = 60; // 5분(초)
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    if (remainingTime <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingTime]);

  useEffect(() => {
    setProgressWidth((remainingTime / totalTime) * 100);
  }, [remainingTime]);
  useEffect(() => {
  if (remainingTime === 0) {
    handleRefresh();
  }
}, [remainingTime]);

  const handleRefresh = () => {
    setRemainingTime(totalTime);
  };

  return (
    <Container>
      {/* 제목 (좌우 여백 포함) */}
      <TitleBox>QR</TitleBox>

      {/* 차량 번호와 큐알*/}
      <ProfileSection>
        <ProfileTitle>123가 1234</ProfileTitle>
        <img src="/myQR.png" alt="내 큐알" style={{ width: '200px', marginBottom: '20px' }} />
      </ProfileSection>

      {/* 시간 흐름 모양 */}
      <OvalContainer>
        <ProgressBar width={progressWidth} />
      </OvalContainer>
      <RemainingTimeText>남은시간: {remainingTime}초</RemainingTimeText>

      {/* 버튼 */}
      <RetryButton onClick={handleRefresh}>QR 재생성</RetryButton>
    <Navbar />  
    </Container>
  );
};

export default QR;