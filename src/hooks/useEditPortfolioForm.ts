import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TechStack } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getPortfolioById, updatePortfolio } from '../lib/portfolioService';
import { BOOK_THEMES } from '../data/bookThemes';

export { BOOK_THEMES } from '../data/bookThemes';

export function useEditPortfolioForm(portfolioId: string) {
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
  const [touched, setTouched] = useState({
    name: false, role: false, tagline: false, liveDemo: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const selectedTheme = BOOK_THEMES[form.themeIdx];

  useEffect(() => {
    getPortfolioById(portfolioId)
      .then((portfolio) => {
        if (!portfolio) {
          setNotFound(true);
          return;
        }
        if (portfolio.uid && portfolio.uid !== user?.uid) {
          navigate('/shelf');
          return;
        }
        const themeIdx = BOOK_THEMES.findIndex((t) => t.spineColor === portfolio.spineColor);
        setForm({
          name: portfolio.name,
          role: portfolio.role,
          tagline: portfolio.tagline,
          techStack: portfolio.techStack,
          liveDemo: portfolio.liveDemo,
          github: portfolio.github === 'https://github.com' ? '' : portfolio.github,
          description: portfolio.description,
          themeIdx: themeIdx >= 0 ? themeIdx : 0,
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsFetching(false));
  }, [portfolioId, user?.uid, navigate]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
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
      await updatePortfolio(portfolioId, {
        name: form.name,
        role: form.role,
        tagline: form.tagline,
        techStack: form.techStack,
        description: form.description,
        github: form.github || 'https://github.com',
        liveDemo: form.liveDemo,
        ...selectedTheme,
        uid: user?.uid ?? '',
      });
      setDone(true);
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
    isFetching,
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
