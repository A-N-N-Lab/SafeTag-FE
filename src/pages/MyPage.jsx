import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import Navbar from "../components/NavBar/Navbar";
import { useNavigate } from "react-router-dom";
import { getMyPage, updateMyPage } from "../api/mypage";

const Mypage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    gender: "",
    phoneNum: "",
    carNumber: "",
    birthDate: "",
    address: "",
    company: "",
    permission: "",
  });

  const [editMode, setEditMode] = useState({
    // name: false,
    // email: false,
    // gender: false,
    // phoneNum: false,
    // birthDate: false,
    // carNumber: false,
    // address: false,
    // company: false,
  });

  //  마운트 시 사용자 정보 가져오기
  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (!t) {
      navigate("/login", { replace: true });
      return;
    }
    (async () => {
      try {
        const res = await getMyPage();
        setUserInfo(res.data);
      } catch (err) {
        console.error("마이페이지 불러오기 실패:", err);
        alert("마이페이지 정보를 불러오는 데 실패했습니다.");
      }
    })();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const toggleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e, field) => {
    e.preventDefault();
    try {
      await updateMyPage({ [field]: userInfo[field] });
      alert("수정 완료!");
      toggleEdit(field);
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  const onLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };

  const topRows = [
    { key: "name", label: "이름", editable: false },
    { key: "email", label: "이메일", editable: false }, // 수정 불가면 editable: false로 바꿔
    { key: "phoneNum", label: "전화번호", editable: false },
  ];

  const bottomRows = [
    { key: "carNumber", label: "차량번호", editable: true },
    { key: "address", label: "아파트 정보", editable: true },
    // 시안의 '권한' 영역: 응답에 permission 없다면 "-"로 표시
    { key: "permission", label: "권한", editable: false },
  ];

  const renderRow = ({ key, label, editable }) => (
    <Row key={key}>
      <div>
        <RowLabel>{label}</RowLabel>
        {editMode[key] ? (
          <form onSubmit={(e) => handleSubmit(e, key)}>
            <Input
              name={key}
              value={userInfo[key] ?? ""}
              onChange={handleChange}
              placeholder={`${label} 입력`}
            />
            <Buttons>
              <SmallBtn type="button" onClick={() => toggleEdit(key)}>
                Cancel
              </SmallBtn>
              <PrimarySmallBtn type="submit">Save</PrimarySmallBtn>
            </Buttons>
          </form>
        ) : (
          <RowValue>{userInfo[key] || "-"}</RowValue>
        )}
      </div>

      {!editMode[key] && editable && (
        <EditPill onClick={() => toggleEdit(key)}>Edit</EditPill>
      )}
    </Row>
  );

  return (
    <Wrap>
      <PageTitle>마이페이지</PageTitle>

      {/* 카드 1 */}
      <Card>{topRows.map(renderRow)}</Card>

      <Card>
        <SubtleRow>
          <SubtleKey>성별</SubtleKey>
          <SubtleVal>{userInfo.gender || "-"}</SubtleVal>
        </SubtleRow>
        <SubtleRow>
          <SubtleKey>생년월일</SubtleKey>
          <SubtleVal>{userInfo.birthDate || "-"}</SubtleVal>
        </SubtleRow>
      </Card>

      {/* 카드 2 */}
      <Card>{bottomRows.map(renderRow)}</Card>

      <LogoutLink type="button" onClick={onLogout}>
        로그아웃
      </LogoutLink>

      <BottomSpacer />
      {/* <Navbar /> */}
    </Wrap>
  );
};

export default Mypage;

const Wrap = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 20px 16px 90px;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin: 6px 0 16px;
`;

const Card = styled.div`
  background: #f7f7fb;
  border: 1px solid #ececf3;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 16px;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 12px;

  & + & {
    margin-top: 6px;
  }
`;

const RowLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const RowValue = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  word-break: break-all;
`;

const EditPill = styled.button`
  align-self: center;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 9999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
`;

const Input = styled.input`
  width: 100%;
  font-size: 15px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fff;
  margin: 6px 0 8px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const SmallBtn = styled.button`
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  color: #6b7280;
`;

const PrimarySmallBtn = styled(SmallBtn)`
  background: #111827;
  color: #fff;
  border-color: #111827;
`;

const SubtleRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 6px;
`;
const SubtleKey = styled.div`
  color: #6b7280;
  font-size: 13px;
`;
const SubtleVal = styled.div`
  color: #111827;
  font-weight: 700;
  font-size: 14px;
`;

const LogoutLink = styled.button`
  width: 100%;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #2563eb;
  padding: 14px 16px;
  border-radius: 10px;
  font-weight: 700;
`;

const BottomSpacer = styled.div`
  height: 70px;
`;
