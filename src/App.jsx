import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './layout/root-layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
