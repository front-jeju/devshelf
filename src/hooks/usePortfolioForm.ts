import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addPortfolio } from '../lib/portfolioService';
import { usePortfolioFormBase } from './usePortfolioFormBase';

export { BOOK_THEMES } from '../data/bookThemes';
export type { BookTheme } from '../data/bookThemes';

export function usePortfolioForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);

  const base = usePortfolioFormBase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    base.touchAll();
    if (!base.isValid) return;

    base.setSubmitError('');
    base.setIsLoading(true);
    try {
      await addPortfolio({
        name: base.form.name,
        role: base.form.role,
        tagline: base.form.tagline,
        techStack: base.form.techStack,
        description: base.form.description,
        github: base.form.github || 'https://github.com',
        liveDemo: base.form.liveDemo,
        ...base.selectedTheme,
        projectCount: 0,
        featured: false,
        uid: user?.uid ?? '',
      });
      base.setDone(true);
    } catch {
      base.setSubmitError('등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      base.setIsLoading(false);
    }
  };

  return {
    ...base,
    showPreview, setShowPreview,
    iframeLoading, setIframeLoading,
    handleSubmit,
    navigate,
  };
}
