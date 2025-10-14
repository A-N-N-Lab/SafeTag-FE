import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getMyPage, updateMyPage } from "../api/mypage";

const Mypage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    gender: "",
    phoneNum: "",
    carNumber: "", //  화면 표준 키는 carNumber로 유지
    birthDate: "",
    address: "",
    company: "",
    permission: "",
  });

  const [editMode, setEditMode] = useState({});

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
        const d = res.data || {};

        // 1) 백엔드가 vehicleNumber로 줄 수도 있으니 화면 상태의 carNumber로 정규화
        const normalizedCar = d.carNumber ?? d.vehicleNumber ?? "";

        // 2) 생년월일 YYYY-MM-DD만 표시
        const birth = d.birthDate ? String(d.birthDate).slice(0, 10) : "";

        // 3) permission 필드가 없으면 "-" 처리
        setUserInfo({
          name: d.name ?? "",
          email: d.email ?? "",
          gender: d.gender ?? "", // 원본 저장(표시는 아래에서 한글로)
          phoneNum: d.phoneNum ?? "",
          carNumber: normalizedCar,
          birthDate: birth,
          address: d.address ?? "",
          company: d.company ?? "",
          permission: d.permission ?? "-",
        });
      } catch (err) {
        // 401이면 로그인 만료로 간주
        if (err?.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login", { replace: true });
          return;
        }
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
      // carNumber를 수정하면 API는 vehicleNumber로 보내야 함
      const payload =
        field === "carNumber"
          ? { vehicleNumber: userInfo.carNumber }
          : { [field]: userInfo[field] };

      await updateMyPage(payload);
      alert("수정 완료!");
      toggleEdit(field);
    } catch (err) {
      console.error("수정 실패:", err);
      alert(err?.response?.data || "수정에 실패했습니다.");
    }
  };

  const onLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };

  const topRows = [
    { key: "name", label: "이름", editable: false },
    { key: "email", label: "이메일", editable: false },
    { key: "phoneNum", label: "전화번호", editable: false },
  ];

  const bottomRows = [
    { key: "carNumber", label: "차량번호", editable: true }, //  화면상 키 유지
    { key: "address", label: "아파트 정보", editable: true },
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

  // 표시에만 한글 매핑
  const genderLabel =
    userInfo.gender === "MALE"
      ? "남성"
      : userInfo.gender === "FEMALE"
      ? "여성"
      : userInfo.gender || "-";

  return (
    <Wrap>
      <PageTitle>마이페이지</PageTitle>

      <Card>{topRows.map(renderRow)}</Card>

      <Card>
        <SubtleRow>
          <SubtleKey>성별</SubtleKey>
          <SubtleVal>{genderLabel}</SubtleVal>
        </SubtleRow>
        <SubtleRow>
          <SubtleKey>생년월일</SubtleKey>
          <SubtleVal>{userInfo.birthDate || "-"}</SubtleVal>
        </SubtleRow>
      </Card>

      <Card>{bottomRows.map(renderRow)}</Card>

      <LogoutLink type="button" onClick={onLogout}>
        로그아웃
      </LogoutLink>

      <BottomSpacer />
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
