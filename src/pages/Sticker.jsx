import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/home/Navbar';

// 날짜 계산 함수
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

const getOneYearLaterString = () => {
  const today = new Date();
  const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  const year = nextYear.getFullYear();
  const month = String(nextYear.getMonth() + 1).padStart(2, '0');
  const day = String(nextYear.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};


// 컨테이너
const Container = styled.div`
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #f0f0f0; /* 전체 배경색 연한 회색을 유지 */
  display: flex;
  flex-direction: column;
`;

// 제목 박스
const TitleBox = styled.div`
  background-color: #fff;
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
`;

const ProfileSection = styled.div`
  padding: 30px 20px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 배경색 없애기, 필요시 삭제하세요 */
`;

const ProfileTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  /* 왼쪽 정렬 하고 싶으면: */
  text-align: left; /* 또는 justify-content 맞게 조절 */
  width: 100%; /* 너비 전체 */
`;

const ProfileImage = styled.img`
  width: 400px; /* 적당히 크기 조정 */
  height: auto;
  display: block; /* 블록으로 만들어 가운데 정렬 */
  margin-right: 0px
`;

const InfoBox = styled.div`
  background-color: white; /* 배경 제거 */
  padding: 20px;
  margin-top: 10px;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  margin-bottom: 15px;
  font-size: 20px; /* 크기 키우기 */
  color: #6B89B9; /* 파란색으로 변경 */
`;

// 메인 타이틀
const Title = () => (
  <TitleBox>내 권한</TitleBox>
);

const Sticker = () => {
  const issueDate = getTodayString();
  const expiryDate = getOneYearLaterString();

  return (
    <Container>

      {/* 제목 */}
      <Title />

      {/* 장애인: 본인와 사진 */}
      <ProfileSection>
        <ProfileTitle>장애인: 본인</ProfileTitle>
        <ProfileImage src="/Sticker.png" alt="장애인 본인" />
      </ProfileSection>

      {/* 세부 정보 */}
      <InfoBox>
        <InfoItem>차량 번호: 123가 1234</InfoItem>
        <InfoItem>발급 일자: {issueDate}</InfoItem> {/*발급일자는 오늘 날짜로 뜨게 해놨어용 추후 수정해야됨!*/}
        <InfoItem>유효 기간: {expiryDate}</InfoItem>
        <InfoItem>발급 기관: SAFETAG</InfoItem>
      </InfoBox>
    <Navbar />  
    </Container>
  );
};

export default Sticker;