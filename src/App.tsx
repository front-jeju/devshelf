import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainPage } from './pages/MainPage';
import { ShelfPage } from './pages/ShelfPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreatePortfolioPage } from './pages/CreatePortfolioPage';
import { EditPortfolioPage } from './pages/EditPortfolioPage';

/** 로그인 필수 라우트 — 미인증 시 /login으로 리다이렉트 */
function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

/** 비로그인 전용 라우트 — 이미 로그인된 경우 홈으로 리다이렉트 */
function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/shelf" element={<ShelfPage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/portfolio/new" element={<PrivateRoute><CreatePortfolioPage /></PrivateRoute>} />
          <Route path="/portfolio/edit/:id" element={<PrivateRoute><EditPortfolioPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
