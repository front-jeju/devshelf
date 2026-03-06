import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TechStack } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { addPortfolio } from '../lib/portfolioService';
import { BOOK_THEMES } from '../data/bookThemes';

export { BOOK_THEMES } from '../data/bookThemes';
export type { BookTheme } from '../data/bookThemes';

export function usePortfolioForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const [submitError, setSubmitError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, role: true, tagline: true, liveDemo: true });
    if (!isValid) return;

    setSubmitError('');
    setIsLoading(true);
    try {
      await addPortfolio({
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
        uid: user?.uid ?? '',
      });
      setDone(true);
    } catch {
      setSubmitError('등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
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
    done,
    submitError,
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
