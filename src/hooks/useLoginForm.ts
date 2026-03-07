/**
 * useLoginForm.ts
 * 로그인 페이지(LoginPage)의 폼 상태와 제출 로직을 담당하는 훅입니다.
 *
 * 지원하는 로그인 방식:
 *   1. 이메일/비밀번호 (handleSubmit)
 *   2. GitHub OAuth (handleOAuth('github'))
 *   3. Google OAuth (handleOAuth('google'))
 *
 * 로직 흐름 (이메일 로그인):
 *   handleSubmit → login() → 성공 시 / 로 navigate
 *   실패 시 → Firebase 에러 코드별 한국어 메시지를 error 상태에 저장
 *
 * 로직 흐름 (OAuth):
 *   handleOAuth → loginWithGithub/Google() → 팝업 인증 → 성공 시 / 로 navigate
 *   팝업 닫힘(사용자 취소) → 에러 메시지 없이 조용히 처리
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export type OAuthProvider = 'github' | 'google';

export function useLoginForm() {
  const navigate = useNavigate();
  const { isConfigured, login, loginWithGithub, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (code === 'firebase/not-configured') {
        setError('Firebase 설정이 필요합니다.');
      } else {
        setError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: OAuthProvider) => {
    if (!isConfigured) return;
    setError('');
    setOauthLoading(provider);
    try {
      if (provider === 'github') {
        await loginWithGithub();
      } else {
        await loginWithGoogle();
      }
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // 사용자가 직접 팝업을 닫은 경우 — 오류 표시 불필요
      } else if (code === 'auth/account-exists-with-different-credential') {
        setError('이미 다른 방법으로 가입된 이메일입니다.');
      } else {
        setError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setOauthLoading(null);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    error,
    isLoading,
    oauthLoading,
    isConfigured,
    handleSubmit,
    handleOAuth,
  };
}
