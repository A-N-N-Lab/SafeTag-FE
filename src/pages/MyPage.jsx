// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import { getMyPage, updateMyPage } from "../api/mypage";

// /** JWT에서 username/sub/email 추출 */
// const getUsernameFromToken = () => {
//   try {
//     const t = localStorage.getItem("access_token");
//     if (!t) return "";
//     const b64 = t.split(".")[1] || "";
//     const pad = "===".slice((b64.length + 3) % 4);
//     const payload = JSON.parse(
//       atob(b64.replace(/-/g, "+").replace(/_/g, "/") + pad)
//     );
//     return payload?.username || payload?.sub || payload?.email || "";
//   } catch {
//     return "";
//   }
// };

// /** JWT에서 ROLE_* 문자열 배열/문자열을 뽑아 조인 */
// const getRoleFromToken = () => {
//   try {
//     const t = localStorage.getItem("access_token");
//     if (!t) return "";
//     const b64 = t.split(".")[1] || "";
//     const pad = "===".slice((b64.length + 3) % 4);
//     const payload = JSON.parse(
//       atob(b64.replace(/-/g, "+").replace(/_/g, "/") + pad)
//     );
//     const raw = payload?.auth ?? payload?.role ?? payload?.authorities ?? "";
//     if (Array.isArray(raw)) {
//       return raw
//         .map((v) => (typeof v === "string" ? v : v?.authority || ""))
//         .filter(Boolean)
//         .join(",");
//     }
//     return typeof raw === "string" ? raw : "";
//   } catch {
//     return "";
//   }
// };

// const Mypage = () => {
//   const navigate = useNavigate();

//   const [userInfo, setUserInfo] = useState({
//     name: "",
//     email: "",
//     gender: "",
//     phoneNum: "",
//     carNumber: "", // 화면 키는 carNumber로 유지
//     birthDate: "",
//     address: "", // 일반 유저: apartmentInfo를 여기에 매핑해 표시
//     company: "", // 관리자: 회사 정보
//     permission: "-", // ROLE_* 표기
//   });

//   const isAdmin = /ROLE_ADMIN/.test(userInfo.permission || "");
//   const [editMode, setEditMode] = useState({});
//   const fetchedRef = useRef(false);

//   /** 최초 로드 */
//   useEffect(() => {
//     if (fetchedRef.current) return;
//     fetchedRef.current = true;

//     const t = localStorage.getItem("access_token");
//     if (!t) {
//       navigate("/login", { replace: true });
//       return;
//     }

//     const ac = new AbortController();
//     (async () => {
//       try {
//         const d = await getMyPage(); // axios 인터셉터로 Authorization 붙는 상태
//         const normalizedCar = d.carNumber ?? d.vehicleNumber ?? "";
//         const birth = d.birthDate ? String(d.birthDate).slice(0, 10) : "";

//         setUserInfo({
//           name: d.name ?? "",
//           email: d.email ?? "",
//           gender: d.gender ?? "",
//           phoneNum: d.phoneNum ?? "",
//           carNumber: normalizedCar,
//           birthDate: birth,
//           // 주소는 일반유저면 apartmentInfo가 내려올 수 있으니 d.address || d.apartmentInfo
//           address: d.address ?? d.apartmentInfo ?? "",
//           company: d.company ?? "",
//           permission: (d.role ?? d.permission ?? getRoleFromToken()) || "-",
//         });
//       } catch (err) {
//         if (err?.response?.status === 401) {
//           localStorage.removeItem("access_token");
//           navigate("/login", { replace: true });
//           return;
//         }
//         console.error("마이페이지 불러오기 실패:", err);
//         alert("마이페이지 정보를 불러오는 데 실패했습니다.");
//       }
//     })();

//     return () => ac.abort();
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const toggleEdit = (field) => {
//     setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   const handleSubmit = async (e, field) => {
//     e.preventDefault();

//     const isAdmin = /ROLE_ADMIN/.test(userInfo.permission || "");

//     /** 화면 키 -> 서버 키 매핑 */
//     const mapField = (key) => {
//       if (key === "carNumber") return "vehicleNumber";
//       if (!isAdmin && key === "address") return "apartmentInfo";
//       return key;
//     };

//     const serverKey = mapField(field);

//     /** ✅ 필수 필드 기본 세트 (birthDate 등 null 방지) */
//     const basePayload = {
//       username: userInfo.email || getUsernameFromToken(),
//       name: userInfo.name || "",
//       gender: userInfo.gender || "",
//       phoneNum: userInfo.phoneNum || "",
//       birthDate: userInfo.birthDate || "2000-01-01", // 기본값 or 기존값 유지
//       company: userInfo.company || "",
//       vehicleNumber: userInfo.carNumber || "",
//       apartmentInfo: userInfo.address || "",
//       fcmToken: localStorage.getItem("fcmToken") || undefined,
//     };

//     /** ✅ 변경한 필드만 덮어쓰기 */
//     const payload = {
//       ...basePayload,
//       [serverKey]: userInfo[field],
//     };

//     try {
//       await updateMyPage(payload);
//       alert("수정 완료!");
//       toggleEdit(field);
//     } catch (err) {
//       console.error("수정 실패:", err?.response?.data || err);
//       alert(
//         err?.response?.data?.error?.message ||
//           err?.response?.data?.message ||
//           "수정에 실패했습니다."
//       );
//     }
//   };

//   const onLogout = () => {
//     localStorage.removeItem("access_token");
//     navigate("/login", { replace: true });
//   };

//   const topRows = [
//     { key: "name", label: "이름", editable: false },
//     // { key: "email", label: "이메일", editable: false },
//     { key: "phoneNum", label: "전화번호", editable: false },
//   ];

//   const bottomRows = [
//     { key: "carNumber", label: "차량번호", editable: true },
//     isAdmin
//       ? { key: "company", label: "회사 정보", editable: true }
//       : { key: "address", label: "아파트 정보", editable: true },
//     { key: "permission", label: "권한", editable: false },
//   ];

//   const renderRow = ({ key, label, editable }) => (
//     <Row key={key}>
//       <div>
//         <RowLabel>{label}</RowLabel>
//         {editMode[key] ? (
//           <form onSubmit={(e) => handleSubmit(e, key)}>
//             <Input
//               name={key}
//               value={userInfo[key] ?? ""}
//               onChange={handleChange}
//               placeholder={`${label} 입력`}
//             />
//             <Buttons>
//               <SmallBtn type="button" onClick={() => toggleEdit(key)}>
//                 Cancel
//               </SmallBtn>
//               <PrimarySmallBtn type="submit">Save</PrimarySmallBtn>
//             </Buttons>
//           </form>
//         ) : (
//           <RowValue>{userInfo[key] || "-"}</RowValue>
//         )}
//       </div>

//       {!editMode[key] && editable && (
//         <EditPill onClick={() => toggleEdit(key)}>Edit</EditPill>
//       )}
//     </Row>
//   );

//   const genderLabel =
//     userInfo.gender === "MALE"
//       ? "남성"
//       : userInfo.gender === "FEMALE"
//       ? "여성"
//       : userInfo.gender || "-";

//   return (
//     <Wrap>
//       <PageTitle>마이페이지</PageTitle>

//       <Card>{topRows.map(renderRow)}</Card>

//       <Card>
//         <SubtleRow>
//           <SubtleKey>성별</SubtleKey>
//           <SubtleVal>{genderLabel}</SubtleVal>
//         </SubtleRow>
//         <SubtleRow>
//           <SubtleKey>생년월일</SubtleKey>
//           <SubtleVal>{userInfo.birthDate || "-"}</SubtleVal>
//         </SubtleRow>
//       </Card>

//       <Card>{bottomRows.map(renderRow)}</Card>

//       <LogoutLink type="button" onClick={onLogout}>
//         로그아웃
//       </LogoutLink>

//       <BottomSpacer />
//     </Wrap>
//   );
// };

// export default Mypage;

// /* ---------- styles ---------- */
// const Wrap = styled.div`
//   max-width: 480px;
//   margin: 0 auto;
//   padding: 20px 16px 90px;
// `;
// const PageTitle = styled.h2`
//   font-size: 24px;
//   font-weight: 800;
//   margin: 6px 0 16px;
// `;
// const Card = styled.div`
//   background: #f7f7fb;
//   border: 1px solid #ececf3;
//   border-radius: 16px;
//   padding: 14px;
//   margin-bottom: 16px;
// `;
// const Row = styled.div`
//   position: relative;
//   display: flex;
//   align-items: flex-start;
//   justify-content: space-between;
//   gap: 12px;
//   padding: 10px 8px;
//   border-radius: 12px;
//   & + & {
//     margin-top: 6px;
//   }
// `;
// const RowLabel = styled.div`
//   font-size: 13px;
//   color: #6b7280;
//   margin-bottom: 4px;
// `;
// const RowValue = styled.div`
//   font-size: 16px;
//   font-weight: 800;
//   color: #111827;
//   word-break: break-all;
// `;
// const EditPill = styled.button`
//   align-self: center;
//   border: 1px solid #e5e7eb;
//   background: #ffffff;
//   border-radius: 9999px;
//   padding: 6px 12px;
//   font-size: 12px;
//   font-weight: 700;
//   color: #6b7280;
// `;
// const Input = styled.input`
//   width: 100%;
//   font-size: 15px;
//   border: 1px solid #d1d5db;
//   border-radius: 12px;
//   padding: 10px 12px;
//   background: #fff;
//   margin: 6px 0 8px;
// `;
// const Buttons = styled.div`
//   display: flex;
//   gap: 8px;
// `;
// const SmallBtn = styled.button`
//   border: 1px solid #e5e7eb;
//   background: #fff;
//   border-radius: 10px;
//   padding: 6px 12px;
//   font-size: 12px;
//   color: #6b7280;
// `;
// const PrimarySmallBtn = styled(SmallBtn)`
//   background: #111827;
//   color: #fff;
//   border-color: #111827;
// `;
// const SubtleRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   padding: 8px 6px;
// `;
// const SubtleKey = styled.div`
//   color: #6b7280;
//   font-size: 13px;
// `;
// const SubtleVal = styled.div`
//   color: #111827;
//   font-weight: 700;
//   font-size: 14px;
// `;
// const LogoutLink = styled.button`
//   width: 100%;
//   text-align: center;
//   background: #ffffff;
//   border: 1px solid #e5e7eb;
//   color: #2563eb;
//   padding: 14px 16px;
//   border-radius: 10px;
//   font-weight: 700;
// `;
// const BottomSpacer = styled.div`
//   height: 70px;
// `;

// src/pages/MyPage.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getMyPage, updateMyPage } from "../api/mypage";

/** JWT에서 username/sub/email 추출 */
const getUsernameFromToken = () => {
  try {
    const t = localStorage.getItem("access_token");
    if (!t) return "";
    const seg = t.split(".")[1] || "";
    const pad = "===".slice((seg.length + 3) % 4);
    const payload = JSON.parse(
      atob(seg.replace(/-/g, "+").replace(/_/g, "/") + pad)
    );
    return payload?.username || payload?.sub || payload?.email || "";
  } catch {
    return "";
  }
};

const Mypage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    gender: "",
    phoneNum: "",
    carNumber: "",
    birthDate: "",
    address: "", // 일반 유저는 아파트 주소, 관리자는 그냥 표시 X
    company: "", // 관리자 전용
    permission: "-", // ROLE_*
  });

  const isAdmin = /ROLE_ADMIN/.test(userInfo.permission || "");
  const [editMode, setEditMode] = useState({});
  const fetchedRef = useRef(false);

  /** 최초 로드 */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const t = localStorage.getItem("access_token");
    if (!t) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const d = await getMyPage();
        setUserInfo({
          name: d.name ?? "",
          email: d.email ?? "",
          gender: d.gender ?? "",
          phoneNum: d.phoneNum ?? "",
          carNumber: d.carNumber ?? "",
          birthDate: d.birthDate ? String(d.birthDate).slice(0, 10) : "",
          address: d.address ?? "",
          company: d.company ?? "",
          permission: d.role || "-",
        });
      } catch (err) {
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
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (field) =>
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));

  /** 저장 (부분수정 PATCH) */
  const handleSubmit = async (e, field) => {
    e.preventDefault();

    // 화면 키 -> 서버 키 매핑: 차량번호만 vehicleNumber로 교체
    const mapField = (key) => {
      if (key === "carNumber") return "vehicleNumber";
      return key; // address는 그대로 'address'
    };

    const serverKey = mapField(field);
    const value = (userInfo[field] ?? "").toString().trim();

    // ✅ 변경 필드만 보냄 (null/빈값으로 다른 칼럼 덮지 않음)
    const payload = { [serverKey]: value };

    try {
      await updateMyPage(payload);
      alert("수정 완료!");
      toggleEdit(field);
    } catch (err) {
      console.error("수정 실패:", err?.response?.data || err);
      alert(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "수정에 실패했습니다."
      );
    }
  };

  const onLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };

  const topRows = [
    { key: "name", label: "이름", editable: false },
    { key: "phoneNum", label: "전화번호", editable: false },
  ];

  const bottomRows = [
    { key: "carNumber", label: "차량번호", editable: true },
    isAdmin
      ? { key: "company", label: "회사 정보", editable: true }
      : { key: "address", label: "아파트 정보", editable: true },
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

/* ---------------- styles ---------------- */
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
