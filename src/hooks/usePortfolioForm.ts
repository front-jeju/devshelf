import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TechStack } from '../types';

export const BOOK_THEMES = [
  { label: '자수정', spineColor: '#7B2D8B', coverColor: '#4A0E6B', accentColor: '#E879F9' },
  { label: '사파이어', spineColor: '#1E3A5F', coverColor: '#0F2744', accentColor: '#60A5FA' },
  { label: '앰버', spineColor: '#7C3D0C', coverColor: '#5C2A08', accentColor: '#FB923C' },
  { label: '에메랄드', spineColor: '#065F46', coverColor: '#064E3B', accentColor: '#34D399' },
  { label: '루비', spineColor: '#7F1D1D', coverColor: '#6B1515', accentColor: '#F87171' },
  { label: '인디고', spineColor: '#312E81', coverColor: '#1E1B4B', accentColor: '#818CF8' },
];

export type BookTheme = typeof BOOK_THEMES[0];

export function usePortfolioForm() {
  const navigate = useNavigate();

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
  const [touched, setTouched] = useState({ name: false, role: false, tagline: false, liveDemo: false });
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);

  const selectedTheme = BOOK_THEMES[form.themeIdx];

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const errors = {
    name: form.name.length > 0 && form.name.length < 2 ? '이름은 최소 2자 이상이어야 합니다.' : '',
    role: touched.role && !form.role ? '직군을 선택해주세요.' : '',
    tagline: form.tagline.length > 60 ? '한 줄 소개는 60자 이내로 작성해주세요.' : '',
    liveDemo:
      form.liveDemo && !/^https?:\/\/.+/.test(form.liveDemo)
        ? '올바른 URL 형식이어야 합니다. (https://...)'
        : '',
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

  const toggleStack = (stack: TechStack) =>
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(stack)
        ? prev.techStack.filter((s) => s !== stack)
        : [...prev.techStack, stack],
    }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, role: true, tagline: true, liveDemo: true });
    if (!isValid) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const newPortfolio = {
      id: Date.now().toString(),
      name: form.name,
      role: form.role,
      tagline: form.tagline,
      techStack: form.techStack,
      description: form.description,
      github: form.github || 'https://github.com',
      liveDemo: form.liveDemo,
      ...selectedTheme,
      projectCount: 0,
      featured: false,
    };

    const existing = JSON.parse(localStorage.getItem('devlibrary_portfolios') || '[]');
    localStorage.setItem('devlibrary_portfolios', JSON.stringify([...existing, newPortfolio]));
    setIsLoading(false);
    setDone(true);
  };

  return {
    form,
    touched,
    errors,
    isValid,
    isLoading,
    done,
    showPreview, setShowPreview,
    iframeLoading, setIframeLoading,
    selectedTheme,
    setField,
    touch,
    toggleStack,
    handleSubmit,
    navigate,
  };
}
