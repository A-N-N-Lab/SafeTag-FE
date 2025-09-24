import React from 'react';
import styled from 'styled-components';

const MgmtContainer = styled.div`
  background-color: #ffffff; 
  border: 1px solid #ffffff;
  border-radius: 10px;
  padding: 30px; 
  width: 370px; /* 전체 크기 조정 */
  margin: 20px auto;
`;

// 타이틀
const Title = styled.h2`
  color: rgb(0, 0, 0);
  margin-bottom: 20px; /* 타이틀과 버튼 사이 간격 */
`;

// 버튼 전체를 가로 배치하는 컨테이너
const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px; /* 버튼 사이 간격 */
`;

// 가로 긴 타원형 버튼
const LongButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬 */
  padding: 0 25px;
  height: 50px;
  width: 160px; /* 너비 작게 제한해서 크기 조절 */
  border: none;
  border-radius: 25px; /* 타원형 */
  background-color: #B0BFCC;
  cursor: pointer;
  font-size: 18px; /* 폰트 크기 조금 작게 */
  transition: background-color 0.3s;

  &:hover {
    background-color:rgb(122, 134, 144);
  }
`;

// 텍스트는 왼쪽에, 아이콘은 오른쪽에 배치
const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between; /* 텍스트 왼쪽, 아이콘 오른쪽 배치 */
`;

// 아이콘 스타일
const ButtonIcon = styled.img`
  width: 20px; /* 이미지 크기 작게 */
  height: 20px;
`;

// 텍스트에 대한 wrapper
const ButtonText = styled.span`
  flex: 1;
  text-align: left; /* 텍스트 왼쪽 정렬 */
`;

const Mgmt = () => {
  return (
    <MgmtContainer>
      <Title>차주에게 연락하기</Title>
      <ButtonWrap>
        <LongButton>
          <ButtonContent>
            <ButtonText>음성 통화</ButtonText>
            <ButtonIcon src="/call-icon.png" alt="Call" />
          </ButtonContent>
        </LongButton>
        <LongButton>
          <ButtonContent>
            <ButtonText>메시지</ButtonText>
            <ButtonIcon src="/message-icon.png" alt="Message" />
          </ButtonContent>
        </LongButton>
      </ButtonWrap>
    </MgmtContainer>
  );
};

export default Mgmt;