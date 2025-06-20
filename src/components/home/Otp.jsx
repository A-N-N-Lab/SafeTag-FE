import React, { useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row; /* 가로 배열 */
  align-items: center;
  background-color: #6B89B9; 
  border: 1px solid #6B89B9;
  border-radius: 10px;
  padding: 20px; 
  width: 350px; /* 크기 축소 */
  height: 150px; /* 높이 줄이기 */
  margin: 20px auto;
  cursor: pointer; /* 클릭 표시 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h2`
  color: rgb(255, 255, 255);
`;

const Description = styled.div`
  font-size: 15px;
  color: white;
`;

const QRImage = styled.img`
  width: 80px; 
  height: auto;
  margin-left: 0px;
`;

const VideoPreview = styled.video`
  display: none; 
`;

const QRScannerBox = () => {
  const videoRef = useRef(null);

  const handleClick = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          alert('카메라를 사용할 수 없습니다.');
          console.error(err);
        });
    } else {
      alert('이 브라우저는 카메라 기능을 지원하지 않습니다.');
    }
  };



  return (
    <Container onClick={handleClick}>
      <Content>
        <Title>QR 스캔</Title>
        <br></br>
        <Description>차량에 부착된 QR을<br></br>스캔한 후 차주에게<br></br>연락할 수 있습니다.</Description>
      </Content>
      {/* 이미지 넣기 */}
      <QRImage src="/qr-icon.png" alt="QR Scanner" />
      {/* 카메라 영상(hidden) */}
      <video ref={videoRef} style={{ display: 'none' }} />
    </Container>
  );
};

export default QRScannerBox;