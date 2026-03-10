/**
 * usePortfolioForm.ts
 * 포트폴리오 신규 등록 페이지(CreatePortfolioPage)에서 사용하는 폼 훅입니다.
 * usePortfolioFormBase의 공통 로직을 확장해 Firestore 저장을 처리합니다.
 *
 * 추가 상태:
 *   showPreview   — 미리보기 iframe 패널 표시 여부
 *   iframeLoading — 미리보기 iframe 로딩 중 여부
 *
 * 제출 로직 흐름:
 *   handleSubmit → touchAll() (미입력 필드 에러 즉시 표시)
 *   → isValid 체크 → addPortfolio() → done=true (성공 화면 표시)
 *   실패 시 → submitError 메시지 설정
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { addPortfolio } from '../lib/portfolioService';
import { usePortfolioFormBase } from './usePortfolioFormBase';


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
        ...(base.form.status ? { status: base.form.status } : {}),
        ...(base.form.projectTypes.length > 0 ? { projectTypes: base.form.projectTypes } : {}),
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
