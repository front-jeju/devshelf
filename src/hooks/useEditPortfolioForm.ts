import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPortfolioById, updatePortfolio } from '../lib/portfolioService';
import { BOOK_THEMES } from '../data/bookThemes';
import { usePortfolioFormBase } from './usePortfolioFormBase';

export { BOOK_THEMES } from '../data/bookThemes';

export function useEditPortfolioForm(portfolioId: string) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const base = usePortfolioFormBase();

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
        base.setForm({
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId, user?.uid, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    base.touchAll();
    if (!base.isValid) return;

    base.setSubmitError('');
    base.setIsLoading(true);
    try {
      await updatePortfolio(portfolioId, {
        name: base.form.name,
        role: base.form.role,
        tagline: base.form.tagline,
        techStack: base.form.techStack,
        description: base.form.description,
        github: base.form.github || 'https://github.com',
        liveDemo: base.form.liveDemo,
        ...base.selectedTheme,
        uid: user?.uid ?? '',
      });
      base.setDone(true);
    } catch {
      base.setSubmitError('수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      base.setIsLoading(false);
    }
  };

  return {
    ...base,
    isFetching,
    notFound,
    handleSubmit,
    navigate,
  };
}
