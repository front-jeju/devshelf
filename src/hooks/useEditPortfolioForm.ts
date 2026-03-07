/**
 * useEditPortfolioForm.ts
 * 포트폴리오 수정 페이지(EditPortfolioPage)에서 사용하는 폼 훅입니다.
 * usePortfolioFormBase의 공통 로직을 확장해 기존 데이터 로딩과 Firestore 업데이트를 처리합니다.
 *
 * 추가 상태:
 *   isFetching — Firestore에서 기존 데이터를 불러오는 중 여부
 *   notFound   — 해당 ID의 포트폴리오가 없거나 조회 실패
 *
 * 초기 데이터 로딩 흐름:
 *   마운트 → getPortfolioById(id) → 소유자 확인
 *     본인 아닌 경우: /shelf 리다이렉트 (타인 수정 방지)
 *     본인인 경우: setForm()으로 기존 값 채우기 → isFetching=false
 *     없는 경우: notFound=true
 *
 * 제출 로직 흐름:
 *   handleSubmit → isValid 체크 → updatePortfolio() → done=true
 */
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
