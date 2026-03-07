/**
 * useRegisterForm.ts
 * 회원가입 페이지(RegisterPage)의 폼 상태·유효성 검사·제출 로직을 담당하는 훅입니다.
 *
 * 유효성 검사 항목 (validate 함수):
 *   name     — 최소 2자
 *   email    — 이메일 형식 정규식
 *   password — 최소 8자 + 영문·숫자 모두 포함
 *   confirm  — password와 일치
 *
 * passwordStrength:
 *   비밀번호 강도를 4단계(약함/보통/양호/강함)로 계산해 UI 바 색상에 사용합니다.
 *
 * 로직 흐름:
 *   handleBlur(field) → touched 상태 업데이트 → 에러 메시지 표시 시작
 *   handleSubmit → touchAll() → isFormValid 체크 → register() → / 로 navigate
 *   실패 시 → Firebase 에러 코드별 한국어 메시지를 submitError에 저장
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface FieldError {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

function validate(name: string, email: string, password: string, confirm: string): FieldError {
  const errors: FieldError = { name: '', email: '', password: '', confirm: '' };

  if (name && name.length < 2) errors.name = '이름은 최소 2자 이상이어야 합니다.';

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = '올바른 이메일 형식이 아닙니다.';

  if (password && password.length < 8)
    errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
  else if (password && !/(?=.*[a-zA-Z])(?=.*\d)/.test(password))
    errors.password = '영문과 숫자를 모두 포함해야 합니다.';

  if (confirm && confirm !== password) errors.confirm = '비밀번호가 일치하지 않습니다.';

  return errors;
}

export function useRegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const errors = validate(name, email, password, confirm);

  const isFormValid =
    name.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 8 &&
    /(?=.*[a-zA-Z])(?=.*\d)/.test(password) &&
    confirm === password;

  const passwordStrength = (() => {
    if (!password) return null;
    if (password.length < 8) return { level: 1, label: '약함', color: '#f87171' };
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) return { level: 2, label: '보통', color: '#fb923c' };
    if (password.length >= 12 && /[!@#$%^&*]/.test(password)) return { level: 4, label: '강함', color: '#34d399' };
    return { level: 3, label: '양호', color: '#d4af37' };
  })();

  const handleBlur = (field: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!isFormValid) return;

    setSubmitError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/email-already-in-use') {
        setSubmitError('이미 사용 중인 이메일입니다.');
      } else if (code === 'firebase/not-configured') {
        setSubmitError('Firebase 설정이 필요합니다.');
      } else {
        setSubmitError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirm, setConfirm,
    showPassword, setShowPassword,
    showConfirm, setShowConfirm,
    touched,
    errors,
    isFormValid,
    isLoading,
    submitError,
    passwordStrength,
    handleBlur,
    handleSubmit,
  };
}
