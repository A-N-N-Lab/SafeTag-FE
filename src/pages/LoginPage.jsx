import { useState } from "react";
import styled from "styled-components";
import { login } from "../api/login";
import { useNavigate } from "react-router-dom";
import { setupFcm } from "../lib/firebase";
import { saveFcmToken } from "../api/fcmToken";
import { getMe } from "../api/me";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1) 로그인
      const data = await login({ username, password });
      const jwt = data.token;
      if (!jwt) throw new Error("로그인 응답에 token이 없음");
      localStorage.setItem("access_token", jwt);

      // 2) 로그인한 사용자 정보(/me) 불러와서 이름 저장
      try {
        const me = await getMe(); // 예: { id, username, name, ... }
        const displayName =
          me?.name?.trim() || me?.username?.trim() || username.trim();
        localStorage.setItem("name", displayName);
      } catch (meErr) {
        console.warn("프로필 조회 실패, username으로 대체:", meErr);
        localStorage.setItem("name", username.trim());
      }

      // 3) 전역에 로그인 상태 변경 브로드캐스트 (Header 갱신용)
      window.dispatchEvent(new Event("auth-changed"));

      // 4) 이동
      alert("로그인 성공!");
      navigate("/main", { replace: true });

      // 5) FCM 등록은 백그라운드로
      Promise.resolve().then(async () => {
        try {
          const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
          if (!VAPID_PUBLIC_KEY) {
            console.warn("VAPID 키 비어있음 - FCM 스킵");
            return;
          }
          const fcmToken = await setupFcm(VAPID_PUBLIC_KEY);
          if (fcmToken) {
            await saveFcmToken(fcmToken); // Authorization은 axios 인터셉터가 자동 첨부
            console.log("FCM Token saved");
          }
        } catch (fcmErr) {
          console.warn("FCM 등록 실패:", fcmErr);
        }
      });
    } catch (err) {
      console.error(err);
      alert("로그인 실패! 아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <Container>
      <Title>로그인</Title>
      <Form onSubmit={handleSubmit}>
        <Label>아이디</Label>
        <Input
          type="text"
          placeholder="아이디를 입력하세요."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Label>비밀번호</Label>
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">로그인</Button>
      </Form>
      <BottomLinks>
        <span>아이디 찾기</span>
        <Divider>|</Divider>
        <span>비밀번호 찾기</span>
        <Divider>|</Divider>
        <span onClick={() => navigate("/signup/select")}>회원가입</span>
      </BottomLinks>
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 32px;
`;

const Form = styled.form`
  width: 100%;
  max-width: 300px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  width: 100%;
  background: black;
  color: white;
  padding: 14px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  border: none;
`;

const BottomLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  font-size: 13px;
  color: gray;
  span {
    cursor: pointer;
  }
`;

const Divider = styled.span`
  color: lightgray;
`;
