/**
 * usePortfolioFormBase.ts
 * 포트폴리오 등록(usePortfolioForm)과 수정(useEditPortfolioForm) 폼의
 * 공통 상태·유효성 검사·핸들러를 제공하는 베이스 훅입니다.
 *
 * 제공하는 것:
 *   form         — 현재 폼 입력값
 *   errors       — 필드별 에러 메시지 (빈 문자열 = 에러 없음)
 *   isValid      — 제출 가능 여부 (모든 필수 필드 유효)
 *   touched      — 사용자가 한 번이라도 포커스한 필드 (에러 표시 제어)
 *   selectedTheme — 현재 선택된 책 테마(색상) 객체
 *   setField     — 단일 필드 업데이트 함수
 *   toggleStack  — techStack 배열에서 항목 추가/제거
 *   touch / touchAll — 필드 touched 상태 설정 (제출 버튼 클릭 시 전체 표시)
 */
import { useState } from 'react';
import type { TechStack, DevStatus, ProjectType } from '../types';
import { BOOK_THEMES } from '../data/bookThemes';

export interface FormState {
  name: string;
  role: string;
  tagline: string;
  techStack: TechStack[];
  liveDemo: string;
  github: string;
  description: string;
  themeIdx: number;
  status: DevStatus | '';
  projectTypes: ProjectType[];
}

const initialForm: FormState = {
  name: '',
  role: '',
  tagline: '',
  techStack: [],
  liveDemo: '',
  github: '',
  description: '',
  themeIdx: 0,
  status: '',
  projectTypes: [],
};

export function usePortfolioFormBase(defaultForm: Partial<FormState> = {}) {
  const [form, setForm] = useState<FormState>({ ...initialForm, ...defaultForm });
  const [touched, setTouched] = useState({ name: false, role: false, tagline: false, liveDemo: false });
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedTheme = BOOK_THEMES[form.themeIdx];

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const errors = {
    name: form.name.length > 0 && form.name.length < 2 ? '이름은 최소 2자 이상이어야 합니다.' : '',
    role: touched.role && !form.role ? '직군을 선택해주세요.' : '',
    tagline: form.tagline.length > 60 ? '한 줄 소개는 60자 이내로 작성해주세요.' : '',
    liveDemo: form.liveDemo && !/^https?:\/\/.+/.test(form.liveDemo)
      ? '올바른 URL 형식이어야 합니다. (https://...)' : '',
  };

  const isValid =
    form.name.length >= 2 &&
    !!form.role &&
    form.tagline.length > 0 &&
    form.tagline.length <= 60 &&
    form.liveDemo.length > 0 &&
    /^https?:\/\/.+/.test(form.liveDemo);

  const touch = (field: keyof typeof touched) =>
    setTouched((p) => ({ ...p, [field]: true }));

  const touchAll = () =>
    setTouched({ name: true, role: true, tagline: true, liveDemo: true });

  const toggleStack = (stack: TechStack) =>
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(stack)
        ? prev.techStack.filter((s) => s !== stack)
        : [...prev.techStack, stack],
    }));

  const toggleProjectType = (type: ProjectType) =>
    setForm((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter((t) => t !== type)
        : [...prev.projectTypes, type],
    }));

  return {
    form, setForm,
    touched,
    errors,
    isValid,
    isLoading, setIsLoading,
    done, setDone,
    submitError, setSubmitError,
    selectedTheme,
    setField,
    touch,
    touchAll,
    toggleStack,
    toggleProjectType,
  };
}
