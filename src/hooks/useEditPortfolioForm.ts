/**
 * useEditPortfolioForm.ts
 * 포트폴리오 수정 페이지에서 사용하는 커스텀 훅입니다.
 * usePortfolioForm(등록용)과 비슷하지만, 기존 데이터를 미리 불러와
 * 폼에 채워두고, 제출 시 addPortfolio 대신 updatePortfolio를 호출합니다.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TechStack } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getPortfolioById, updatePortfolio } from '../lib/portfolioService';

// 책 테마 색상 목록 (등록 페이지와 동일하게 사용)
export const BOOK_THEMES = [
  { label: '자수정', spineColor: '#7B2D8B', coverColor: '#4A0E6B', accentColor: '#E879F9' },
  { label: '사파이어', spineColor: '#1E3A5F', coverColor: '#0F2744', accentColor: '#60A5FA' },
  { label: '앰버', spineColor: '#7C3D0C', coverColor: '#5C2A08', accentColor: '#FB923C' },
  { label: '에메랄드', spineColor: '#065F46', coverColor: '#064E3B', accentColor: '#34D399' },
  { label: '루비', spineColor: '#7F1D1D', coverColor: '#6B1515', accentColor: '#F87171' },
  { label: '인디고', spineColor: '#312E81', coverColor: '#1E1B4B', accentColor: '#818CF8' },
];

/**
 * @param portfolioId - 수정할 포트폴리오의 Firestore 문서 ID (URL 파라미터로 받음)
 */
export function useEditPortfolioForm(portfolioId: string) {
  const navigate = useNavigate();
  const { user } = useAuth(); // 현재 로그인한 사용자 정보

  // 폼 입력값들을 하나의 객체로 관리합니다
  const [form, setForm] = useState({
    name: '',
    role: '',
    tagline: '',
    techStack: [] as TechStack[],
    liveDemo: '',
    github: '',
    description: '',
    themeIdx: 0,
  });

  // 각 필드를 사용자가 한 번이라도 건드렸는지 추적합니다
  // (건드린 필드에만 에러 메시지를 표시하기 위해)
  const [touched, setTouched] = useState({
    name: false, role: false, tagline: false, liveDemo: false,
  });

  const [isLoading, setIsLoading] = useState(false);   // 수정 요청 중 여부
  const [isFetching, setIsFetching] = useState(true);  // 기존 데이터 불러오는 중 여부
  const [done, setDone] = useState(false);              // 수정 완료 여부
  const [submitError, setSubmitError] = useState('');  // 수정 실패 에러 메시지
  const [notFound, setNotFound] = useState(false);     // 해당 포트폴리오가 없는 경우

  // 현재 선택된 테마 객체 (themeIdx 인덱스로 BOOK_THEMES에서 찾아옴)
  const selectedTheme = BOOK_THEMES[form.themeIdx];

  /**
   * 컴포넌트가 마운트될 때 Firestore에서 기존 포트폴리오 데이터를 불러와
   * 폼 초기값으로 설정합니다.
   */
  useEffect(() => {
    getPortfolioById(portfolioId)
      .then((portfolio) => {
        // 해당 ID의 포트폴리오가 없으면
        if (!portfolio) {
          setNotFound(true);
          return;
        }

        // 로그인한 사용자와 작성자가 다르면 접근 거부
        // (타인의 포트폴리오를 수정하지 못하도록)
        if (portfolio.uid && portfolio.uid !== user?.uid) {
          navigate('/shelf'); // 서재 페이지로 강제 이동
          return;
        }

        // 기존 테마 색상이 BOOK_THEMES 중 어느 것인지 찾아서 인덱스를 구합니다
        const themeIdx = BOOK_THEMES.findIndex(
          (t) => t.spineColor === portfolio.spineColor,
        );

        // 폼 초기값을 기존 포트폴리오 데이터로 설정
        setForm({
          name: portfolio.name,
          role: portfolio.role,
          tagline: portfolio.tagline,
          techStack: portfolio.techStack,
          liveDemo: portfolio.liveDemo,
          github: portfolio.github === 'https://github.com' ? '' : portfolio.github,
          description: portfolio.description,
          // 테마를 찾지 못하면(-1) 기본값 0 사용
          themeIdx: themeIdx >= 0 ? themeIdx : 0,
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsFetching(false));
  // portfolioId나 user가 바뀔 때만 다시 실행
  }, [portfolioId, user?.uid, navigate]);

  /** 폼의 특정 필드 값을 업데이트합니다 */
  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /**
   * 유효성 검사 에러 메시지들
   * 각 조건에 맞지 않을 때 에러 문자열을 반환하고, 맞으면 빈 문자열('')을 반환합니다.
   */
  const errors = {
    name: form.name.length > 0 && form.name.length < 2
      ? '이름은 최소 2자 이상이어야 합니다.' : '',
    role: touched.role && !form.role
      ? '직군을 선택해주세요.' : '',
    tagline: form.tagline.length > 60
      ? '한 줄 소개는 60자 이내로 작성해주세요.' : '',
    liveDemo: form.liveDemo && !/^https?:\/\/.+/.test(form.liveDemo)
      ? '올바른 URL 형식이어야 합니다. (https://...)' : '',
  };

  /** 모든 필수 항목이 유효한지 확인합니다 */
  const isValid =
    form.name.length >= 2 &&
    !!form.role &&
    form.tagline.length > 0 &&
    form.tagline.length <= 60 &&
    form.liveDemo.length > 0 &&
    /^https?:\/\/.+/.test(form.liveDemo);

  /** 사용자가 필드를 벗어날 때 'touched' 상태를 true로 설정합니다 */
  const touch = (field: keyof typeof touched) =>
    setTouched((p) => ({ ...p, [field]: true }));

  /** 기술 스택 태그를 토글(선택/해제)합니다 */
  const toggleStack = (stack: TechStack) =>
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(stack)
        ? prev.techStack.filter((s) => s !== stack)  // 이미 선택된 경우 제거
        : [...prev.techStack, stack],                 // 선택 안 된 경우 추가
    }));

  /** 수정 폼 제출 핸들러 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출(페이지 새로고침) 방지

    // 제출 시 모든 필드를 'touched' 상태로 만들어 에러를 표시합니다
    setTouched({ name: true, role: true, tagline: true, liveDemo: true });
    if (!isValid) return; // 유효성 검사 실패 시 중단

    setSubmitError('');
    setIsLoading(true);
    try {
      // Firestore의 기존 문서를 수정합니다
      await updatePortfolio(portfolioId, {
        name: form.name,
        role: form.role,
        tagline: form.tagline,
        techStack: form.techStack,
        description: form.description,
        github: form.github || 'https://github.com',
        liveDemo: form.liveDemo,
        ...selectedTheme, // 선택한 테마의 색상 정보 (spineColor, coverColor, accentColor, label)
        uid: user?.uid ?? '',
      });
      setDone(true); // 완료 상태로 전환
    } catch {
      setSubmitError('수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    touched,
    errors,
    isValid,
    isLoading,
    isFetching, // 기존 데이터를 불러오는 중인지 (로딩 UI 표시용)
    done,
    submitError,
    notFound,
    selectedTheme,
    setField,
    touch,
    toggleStack,
    handleSubmit,
    navigate,
  };
}
