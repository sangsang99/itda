import { Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage/MainPage';
import { ContentRegistrationPage } from './pages/ContentRegistrationPage/ContentRegistrationPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/content/register" element={<ContentRegistrationPage />} />
      <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
    </Routes>
  );
}

export default App;
