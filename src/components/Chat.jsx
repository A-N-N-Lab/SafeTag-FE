import "./Chat.css";

const Chat = () => {
  return (
    <div className="Chat">
      <img src="/search-icon.png" alt="Search" className="icon" /> {/* 돋보기 아이콘 */}
      <input className="chat-input" placeholder="챗봇에게 물어보세요!" />
      <img src="/mic-icon.png" alt="Microphone" className="icon" /> {/* 마이크 아이콘 */}
    </div>
  );
};

export default Chat;