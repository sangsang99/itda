import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MainPage } from './pages/MainPage/MainPage';
import { ContentRegistrationPage } from './pages/ContentRegistrationPage/ContentRegistrationPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/content/register" element={<ContentRegistrationPage />} />
        <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
