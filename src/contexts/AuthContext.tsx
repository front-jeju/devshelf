import { useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, githubProvider, googleProvider, isConfigured } from '../lib/firebase';
import { AuthContext } from './authContextDef';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  // Firebase 미설정 시에는 인증 확인이 불필요하므로 초기값을 false로 설정
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth) return;
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
