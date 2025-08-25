import React from "react";
import styled from "styled-components";
// import Navbar from "../components/NavBar/Navbar";

// 함수: 클릭 시 alert
const handleClick = (blockIdx, btnIdx) => {
  alert(`블록 ${blockIdx + 1}의 버튼 ${btnIdx + 1} 클릭`);
};

export default function AuthComp() {
  const disabledButtons = [
    {
      icon: "/disabled-icon.png",
      title: "장애인 본인 및 가족",
      description: "자동차 등록증 사본, 운전면허증 사본, 장애인 진단서",
    },
    {
      icon: "/disabled-icon.png",
      title: "장애인 복지 시설 및 단체",
      description: "복지시설 등록증, 단체 계약서 등",
    },
    {
      icon: "/disabled-icon.png",
      title: "외국인",
      description: "외국인 등록증, 국내거소신고증, 진단서",
    },
  ];

  const stickerReissueButtons = [
    {
      icon: "/disabled-icon.png",
      title: "장애인 스티커 재발급",
      description: "수거된 표지 또는 재발급 사유 증명서",
    },
    {
      icon: "/Pregnant-icon.png",
      title: "임산부 스티커 재발급",
      description: "수거된 표지 또는 재발급 사유 증명서",
    },
    // 필요한 만큼 더 추가
  ];

  return (
    <AppContainer>
      {/* 헤더 */}
      <HeaderWrapper>
        <HeaderText>권한 인증</HeaderText>
      </HeaderWrapper>

      {/* 장애인 블록 */}
      <div>
        <BlockTitle>장애인</BlockTitle>
        {disabledButtons.map((btn, i) => (
          <IconButton
            key={i}
            onClick={() =>
              alert(
                `서류 제출 과정은 구현하지 못하여 바로 다음 단계로 넘어가겠습니다.`
              )
            }
          >
            <IconImage src={btn.icon} alt={btn.title} />
            <TextContainer>
              <MainText>{btn.title}</MainText>
              <SubText>{btn.description}</SubText>
            </TextContainer>
          </IconButton>
        ))}
      </div>

      {/* 임산부 블록 */}
      <div>
        <BlockTitle>임산부</BlockTitle>
        <IconButton
          onClick={() =>
            alert(
              `서류 제출 과정은 구현하지 못하여 바로 다음 단계로 넘어가겠습니다.`
            )
          }
        >
          <IconImage src={`/Pregnant-icon.png`} alt="임산부" />
          <TextContainer>
            <MainText>임산부 본인 및 배우자</MainText>
            <SubText>신분증, 차량등록증, 임신 확인서 또는 산모수첩</SubText>
          </TextContainer>
        </IconButton>
      </div>

      {/* 스티커 재발급 블록 */}
      <div>
        <BlockTitle>스티커 재발급</BlockTitle>
        {stickerReissueButtons.map((btn, index) => (
          <IconButton
            key={index}
            onClick={() =>
              alert(
                `서류 제출 과정은 구현하지 못하여 바로 다음 단계로 넘어가겠습니다.`
              )
            }
          >
            <IconImage src={btn.icon} alt={btn.title} />
            <TextContainer>
              <MainText>{btn.title}</MainText>
              <SubText>{btn.description}</SubText>
            </TextContainer>
          </IconButton>
        ))}
      </div>
      {/* <Navbar /> */}
    </AppContainer>
  );
}

// 전체 배경색 연한 회색
const AppContainer = styled.div`
  min-height: 100vh;
`;

// 헤더 (권한 인증)
const HeaderWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 20px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const HeaderText = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
`;

// 블록 제목
const BlockTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin: 20px 10px 10px 10px;
`;

// 버튼 하나
const IconButton = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  height: 70px; /* 낮게 */
  border: 1px solid #ccc;
  border-radius: 0; /* 각진 모서리 */
  padding: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
`;

const IconImage = styled.img`
  width: 35px;
  height: 35p x;
  margin-right: 15px;
  margin-top: 5px;
`;

const TextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const MainText = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-align: left;
`;

const SubText = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 4px;
`;
