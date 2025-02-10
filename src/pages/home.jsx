import "./App.css";
import Header from "./components/Header";
import Otp from "./components/Otp";
import Chat from "./components/Chat";
import Mgmt from "./components/Mgmt";
import Mart from "./components/Mart";
import Etc from "./components/Etc";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Otp />
      <Chat />
      <Mgmt />
      <div className="arr"> {/* 두 컴포넌트를 감싸는 div 추가 */}
        <Mart />
        <Etc />
      </div>
      <Footer />
      <Navbar />
    </div>
  );
}

export default App;
