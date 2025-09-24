import React, { useRef } from "react";
import styled from "styled-components";

const QRScannerBox = () => {
  const videoRef = useRef(null);

  const handleClick = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          alert("카메라를 사용할 수 없습니다.");
          console.error(err);
        });
    } else {
      alert("이 브라우저는 카메라 기능을 지원하지 않습니다.");
    }
  };

  return (
    <Container onClick={handleClick}>
      <Content>
        <Title>QR 스캔</Title>
        <br></br>
        <QRImage src="/qr-icon.png" alt="QR Scanner" />
      </Content>
      <video ref={videoRef} style={{ display: "none" }} />
    </Container>
  );
};

export default QRScannerBox;

const Container = styled.div`
  display: flex;
  flex-direction: row; /* 가로 배열 */
  align-items: center;
  background-color: #6b89b9;
  border: 1px solid #6b89b9;
  border-radius: 10px;
  padding: 10px;
  width: 170px; /* 크기 축소 */
  height: 170px; /* 높이 줄이기 */
  margin: 0px auto;
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

const QRImage = styled.img`
  width: 90px;
  height: auto;
  display: block; /* 또는 inline-block */
  margin: 0 auto; /* 가로 방향 가운데 정렬 */
`;

const VideoPreview = styled.video`
  display: none;
`;
