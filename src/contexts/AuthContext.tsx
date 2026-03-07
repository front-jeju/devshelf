/**
 * AuthContext.tsx
 * Firebase 인증 상태를 전역으로 공유하는 React Context입니다.
 *
 * 역할:
 *   - Firebase onAuthStateChanged를 구독해 로그인 상태를 추적합니다.
 *   - 로그인·소셜 로그인·회원가입·로그아웃 함수를 하위 컴포넌트에 제공합니다.
 *   - useAuth() 훅으로 어느 컴포넌트에서든 인증 상태에 접근할 수 있습니다.
 *
 * 사용 방법:
 *   const { user, loading, login, logout } = useAuth();
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, githubProvider, googleProvider, isConfigured } from '../lib/firebase';

/** Context를 통해 공유되는 인증 관련 값과 함수들 */
interface AuthContextValue {
  user: User | null;        // 현재 로그인한 사용자 (null이면 비로그인)
  loading: boolean;         // 인증 상태 확인 중 여부 (true 동안 라우팅 판단 보류)
  isConfigured: boolean;    // Firebase 환경변수 설정 여부
  login: (email: string, password: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Context 기본값: AuthProvider 외부에서 실수로 호출할 경우를 대비한 안전장치
const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isConfigured: false,
  login: async () => {},
  loginWithGithub: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
});

/**
 * 앱 최상위(App.tsx)에서 감싸는 Provider 컴포넌트입니다.
 * 내부에서 Firebase 인증 상태를 구독하고, 하위 컴포넌트에 user·loading 등을 제공합니다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // loading: Firebase가 토큰을 확인하는 동안 true → 완료되면 false
  // PrivateRoute/GuestRoute는 loading=true인 동안 렌더링을 보류합니다
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase 미설정 시 로딩 상태만 해제하고 리스너 등록 생략
    if (!auth) {
      setLoading(false);
      return;
    }
    // onAuthStateChanged: 로그인·로그아웃·토큰 갱신 시 콜백 자동 호출
    // 반환값(unsubscribe)을 cleanup으로 등록해 메모리 누수를 방지합니다
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw Object.assign(new Error('Firebase 설정이 필요합니다.'), { code: 'firebase/not-configured' });
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGithub = async () => {
    if (!auth || !githubProvider) throw Object.assign(new Error('Firebase 설정이 필요합니다.'), { code: 'firebase/not-configured' });
    await signInWithPopup(auth, githubProvider);
  };

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) throw Object.assign(new Error('Firebase 설정이 필요합니다.'), { code: 'firebase/not-configured' });
    await signInWithPopup(auth, googleProvider);
  };

  const register = async (name: string, email: string, password: string) => {
    if (!auth) throw Object.assign(new Error('Firebase 설정이 필요합니다.'), { code: 'firebase/not-configured' });
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName: name });
    // updateProfile은 user 객체를 in-place로 변경하지만 onAuthStateChanged를 재발화하지 않으므로
    // 수동으로 React 상태를 갱신해 displayName이 즉시 반영되도록 함
    setUser({ ...newUser });
  };

  const logout = async () => {
    if (auth) await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured, login, loginWithGithub, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
