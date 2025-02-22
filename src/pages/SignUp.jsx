import React, { useState } from 'react';
import styled from 'styled-components';

const SignUp = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    gender: '여자',
    phone: '',
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value });
  };

  // 회원가입 버튼 클릭시 콘솔 출력
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('회원가입 데이터:', formData);
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit}>
        <Label>아이디</Label>
        <Input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          palceholer="아이디를 입력하세요."
        />

        <Label>비밀번호</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요."
        />
        <Input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호를 확인하세요."
        />

        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="이메일을 입력하세요."
        />

        <Row>
          <Column>
            <Label>이름</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요."
            />
          </Column>
          <Column>
            <Label>성별</Label>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}>
              <option value="여자">여자</option>
              <option value="남자">남자</option>
            </Select>
          </Column>
        </Row>

        <Label>전화번호</Label>
        <Input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="전화번호를 입력하세요."
        />

        <Button type="submit">회원가입</Button>
      </Form>
    </Container>
  );
};

export default SignUp;

const Container = styled.div`
  width: 100%;
  max-width: 393px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  background-color: white;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const Label = styled.label`
  text-align: left;
  font-weight: 600;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f8f8f8;
  outlone: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border: 1px solid black;
    background-color: white;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Column = styled.div`
  width: 48%;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 16px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #333;
  }
`;
