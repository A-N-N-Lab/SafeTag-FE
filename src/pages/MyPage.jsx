import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../components/home/Navbar";

const Mypage = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    carNumber: "",
    apartmentInfo: "",
    permission: "",
  });

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
    carNumber: false,
    apartmentInfo: false,
    permission: false,
  });

  //  마운트 시 사용자 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyPage();
        setUserInfo(res.data);
      } catch (err) {
        console.error("마이페이지 불러오기 실패:", err);
        alert("마이페이지 정보를 불러오는 데 실패했습니다.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const toggleEdit = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleSubmit = async (e, field) => {
    e.preventDefault();
    try {
      await updateMyPage(userInfo);
      alert("수정 완료!");
      toggleEdit(field);
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <Container>
      <Title>마이페이지</Title>

      <Box>
        {["name", "email", "phone"].map((field) => (
          <InfoRow key={field}>
            <Label>
              {field === "name"
                ? "이름"
                : field === "email"
                ? "이메일"
                : "전화번호"}
            </Label>
            {editMode[field] ? (
              <Form onSubmit={(e) => handleSubmit(e, field)}>
                <Input
                  type="text"
                  name={field}
                  value={userInfo[field]}
                  onChange={handleChange}
                  required
                />
                <Button type="submit">Save</Button>
              </Form>
            ) : (
              <StaticInfo>
                <InfoTextBold>{userInfo[field]}</InfoTextBold>
                <Button onClick={() => toggleEdit(field)}>Edit</Button>
              </StaticInfo>
            )}
          </InfoRow>
        ))}
      </Box>

      <Box>
        {["carNumber", "apartmentInfo", "permission"].map((field) => (
          <InfoRow key={field}>
            <Label>
              {field === "carNumber"
                ? "차량번호"
                : field === "apartmentInfo"
                ? "아파트 정보"
                : "권한"}
            </Label>
            {editMode[field] ? (
              <Form onSubmit={(e) => handleSubmit(e, field)}>
                <Input
                  type="text"
                  name={field}
                  value={userInfo[field]}
                  onChange={handleChange}
                  required
                />
                <Button type="submit">Save</Button>
              </Form>
            ) : (
              <StaticInfo>
                <InfoTextBold>{userInfo[field]}</InfoTextBold>
                <Button onClick={() => toggleEdit(field)}>Edit</Button>
              </StaticInfo>
            )}
          </InfoRow>
        ))}
      </Box>

      <LogoutButton
        onClick={() => alert("로그아웃 기능은 아직 구현되지 않았습니다.")}
      >
        로그아웃
      </LogoutButton>
      <Navbar />
    </Container>
  );
};

export default Mypage;

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  min-height: calc(110vh - 50px);
`;

const Title = styled.h2`
  text-align: left;
  font-size: 24px;
  margin-bottom: 30px;
`;

const Box = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  box-sizing: border-box;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const InfoRow = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.span`
  font-weight: normal;
`;

const StaticInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoTextBold = styled.span`
  font-weight: bold;
  flex: 1;
  margin-right: 10px;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  flex: 1;
`;

const Button = styled.button`
  background-color: #f0effa;
  color: black;
  border: none;
  border-radius: 20px;
  padding: 5px 20px;
  cursor: pointer;

  &:hover {
    background-color: rgb(195, 194, 204);
  }
`;

const LogoutButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  padding: 15px 20px;
  font-size: 15px;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  color: #6b89b9;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:hover {
    background-color: #f0f0f0;
  }
`;
