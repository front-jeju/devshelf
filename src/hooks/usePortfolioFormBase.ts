import { useState } from 'react';
import type { TechStack } from '../types';
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
  };
}
