/**
 * App.tsx
 * 앱의 최상위 컴포넌트입니다.
 *
 * 역할:
 *   - AuthProvider로 전체 앱을 감싸 인증 상태를 전역 공유합니다.
 *   - React Router로 URL별 페이지를 연결합니다.
 *   - lazy + Suspense로 각 페이지를 코드 스플리팅해 초기 로딩 속도를 개선합니다.
 *
 * 라우트 구조:
 *   /            → MainPage (공개)
 *   /shelf       → ShelfPage (공개)
 *   /login       → LoginPage (GuestRoute: 로그인 상태면 / 로 리다이렉트)
 *   /register    → RegisterPage (GuestRoute)
 *   /portfolio/new       → CreatePortfolioPage (PrivateRoute: 비로그인 시 /login 으로)
 *   /portfolio/edit/:id  → EditPortfolioPage (PrivateRoute)
 */
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
const RepoAnalyzerPage = lazy(() => import('./pages/RepoAnalyzerPage').then((m) => ({ default: m.RepoAnalyzerPage })));

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
            <Route path="/analyzer" element={<PrivateRoute><RepoAnalyzerPage /></PrivateRoute>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
