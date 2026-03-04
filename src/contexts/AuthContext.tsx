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

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
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
