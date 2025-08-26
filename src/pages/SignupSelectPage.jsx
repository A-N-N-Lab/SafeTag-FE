import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SignupSelect = () => {
  const navigate = useNavigate();

  return (
    <Wrap>
      <Title>회원유형을 선택하세요</Title>

      <Grid>
        <Card
          onClick={() => navigate("/signup/user")}
          aria-label="일반 사용자 가입"
        >
          <Square>일반 사용자</Square>
        </Card>

        <Card
          onClick={() => navigate("/signup/admin")}
          aria-label="관리자 가입"
        >
          <Square>관리자</Square>
        </Card>
      </Grid>

      <Note>
        서비스 시작 시 서비스 이용약관 및 개인정보처리방침 동의로 간주됩니다.
      </Note>
    </Wrap>
  );
};

export default SignupSelect;

/* -------- styles -------- */
const Wrap = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px 32px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  /* 아주 작은 화면에선 1열로 */
  @media (max-width: 340px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.button`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 10px 16px;
  border-radius: 14px;
  border: 1px solid #ececf3;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: transform 0.08s ease, box-shadow 0.12s ease,
    border-color 0.12s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
  }
  &:active {
    transform: translateY(0px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) inset;
  }
`;

const Square = styled.div`
  width: 100%;
  aspect-ratio: 1/1; /* 정사각형 */
  border-radius: 10px;
  background: #e5e7eb; /* 연회색 박스 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-weight: 800;
  font-size: 16px;
  line-height: 1.2;
`;

const Note = styled.p`
  margin-top: 18px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
`;
