import { type ReactNode, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const MainPage = lazy(() => import('./pages/MainPage').then((m) => ({ default: m.MainPage })));
const ShelfPage = lazy(() => import('./pages/ShelfPage').then((m) => ({ default: m.ShelfPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const CreatePortfolioPage = lazy(() => import('./pages/CreatePortfolioPage').then((m) => ({ default: m.CreatePortfolioPage })));
const EditPortfolioPage = lazy(() => import('./pages/EditPortfolioPage').then((m) => ({ default: m.EditPortfolioPage })));

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
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/shelf" element={<ShelfPage />} />
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/portfolio/new" element={<PrivateRoute><CreatePortfolioPage /></PrivateRoute>} />
            <Route path="/portfolio/edit/:id" element={<PrivateRoute><EditPortfolioPage /></PrivateRoute>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
