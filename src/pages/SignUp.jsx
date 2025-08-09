import React, { useState } from "react";
import styled from "styled-components";
import { signUp } from "../api/user";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
    email: "", // 서버에서 안 써도 그냥 같이 보낼 수 있음(무시됨)
    name: "",
    gender: "FEMALE", // 오타 수정
    birthDate: "", // YYYY-MM-DD
    phoneNum: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!formData.birthDate || !formData.address) {
      alert("생년월일/주소를 입력해주세요");
      return;
    }

    try {
      const res = await signUp(formData);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      console.error("회원가입 실패:", err.response?.data || err.message);
      alert(err.response?.data || "회원가입에 실패했습니다.");
    }
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit}>
        <Label>아이디</Label>
        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="아이디를 입력하세요."
        />

        <Label>비밀번호</Label>
        <Input
          type="password"
          name="password1"
          value={formData.password1}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요."
        />
        <Input
          type="password"
          name="password2"
          value={formData.password2}
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
              onChange={handleChange}
            >
              <option value="FEMALE">여자</option>
              <option value="MALE">남자</option>
            </Select>
          </Column>
        </Row>

        <Label>전화번호</Label>
        <Input
          type="text"
          name="phoneNum"
          value={formData.phoneNum}
          onChange={handleChange}
          placeholder="010-1234-5678"
        />

        <Label>생년월일</Label>
        <Input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />

        <Label>주소</Label>
        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="주소를 입력하세요."
        />

        <Button type="submit">회원가입</Button>
      </Form>
    </Container>
  );
};

export default SignUp;

/* styled-components (outline 오타도 수정 권장) */
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
  outline: none;
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
