import './Otp.css';

const Otp = () => {
  return (
    <div className="Otp">
      <h2>OTP를 입력하여 연락하기</h2>
      <div className="Otp-inputs">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <input
              key={index}
              type="text"
              className="Otp-input"
              maxLength="1"
            />
          ))}
      </div>
      <div className="button-group">
        <button className="Otp-button">음성 통화</button>
        <button className="Otp-button">메시지</button>
      </div>
    </div>
  );
};

export default Otp;
