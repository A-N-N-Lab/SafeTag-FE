import './Mgmt.css';

const Mgmt = () => {
  return (
    <div className="Mgmt">
      <h2>차량 관리</h2>
      <div className="button-group">
        <button className="Mgmt-button">
          <img src="/sticker-icon.png" alt="Sticker" className="button-icon" />
          스티커 발급
        </button>
        <button className="Mgmt-button">
          <img src="/auth-icon.png" alt="Auth" className="button-icon" />
          권한 인증
        </button>
      </div>
    </div>
  );
};

export default Mgmt;
