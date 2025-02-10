import "./Mart.css";

const Mart = () => {
  return (
    <div className="Mart">
      <h2>마트</h2>
      <div className="button-group">
        <button className="Mart-button">
          <img src="/receipt-icon.png" alt="receipt" className="button-icon" />
          영수증 스캔
        </button>
        <button className="Mart-button">
          <img src="/card-icon.png" alt="card" className="button-icon" />
          사전 정산
        </button>
      </div>
    </div>
  );
};

export default Mart;