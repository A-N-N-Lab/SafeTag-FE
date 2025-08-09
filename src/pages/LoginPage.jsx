import { useState } from "react";
import styled from "styled-components";
import { login } from "../api/login";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      alert("로그인 성공!");
      // 토큰 저장 등 추가 로직
      localStorage.setItem("access_token", res.token);
      navigate("/");
    } catch (err) {
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
        {/*아이디찾기/ 비밀번호찾기 없앨까 .. 흠  */}
        <span>아이디 찾기</span>
        <Divider>|</Divider>
        <span>비밀번호 찾기</span>
        <Divider>|</Divider>
        <span onClick={() => navigate("/signup")}>회원가입</span>
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
