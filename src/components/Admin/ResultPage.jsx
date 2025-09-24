import React from 'react';
import styled from 'styled-components';

const ResultContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0; /* 경계 선색상 약간 변경 */
  border-radius: 10px;
  padding: 20px;
  width: 170px;             /* 전체 너비 조절 */
  margin: 0px auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;        /* 가운데 정렬 */
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: left;
  color: #333;
`;

const ImagesWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;               /* 사진과 텍스트 사이 간격 */
`;

const ImageBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StickerImage = styled.img`
  width: 30px;
  height: auto;
`;

const TextLabel = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #5C78A4;
`;

const ResultPage = () => {
  return (
    <ResultContainer>
      <Title>스캔 결과</Title>
      
      <ImagesWrapper>
        {/* 첫 번째 사진 + 텍스트 */}
        <ImageBlock>
          <StickerImage src="/sticker-blue-icon.png" alt="스티커" />
          <TextLabel>스티커<br></br>정상</TextLabel>
        </ImageBlock>
        {/* 두 번째 사진 + 텍스트 */}
        <ImageBlock>
          <StickerImage src="/auth-blue-icon.png" alt="인증된 주민" />
          <TextLabel>인증된<br></br>주민</TextLabel>
        </ImageBlock>
      </ImagesWrapper>
    </ResultContainer>
  );
};

export default ResultPage;