/**
 * ShelfPage.tsx
 * /shelf 경로에 렌더링되는 책장 페이지입니다.
 *
 * 상태:
 *   selectedStack — FilterBar에서 선택한 기술 스택 (null이면 전체 표시)
 *
 * 로직 흐름:
 *   1. usePortfolios()로 Firestore에서 포트폴리오 목록을 불러옵니다.
 *   2. FilterBar에서 스택 선택 → selectedStack 변경 → BookShelf가 필터링 처리.
 *   3. BookShelf에서 책 삭제 → removePortfolio()로 UI에서 즉시 제거.
 */
import { useState } from 'react';
import { FloatingParticles } from '../components/FloatingParticles';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { BookShelf } from '../components/book/BookShelf';
import { usePortfolios } from '../hooks/usePortfolios';
import type { TechStack, DevStatus, ProjectType } from '../types';

export function ShelfPage() {
  const [selectedStack, setSelectedStack] = useState<TechStack | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DevStatus | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const { portfolios, loading, removePortfolio } = usePortfolios();

  return (
    <div className="page-bg">
      <FloatingParticles />
      <div className="page-overlay" />

      <div className="relative z-[2]">
        <Header />

        <main className="pt-20">
          <div className="max-w-[900px] mx-auto gold-divider" />

          <FilterBar
            selected={selectedStack}
            onSelect={setSelectedStack}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
          />

          <div className="px-6 pb-20">
            {loading ? (
              <div
                className="text-center py-20"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  color: 'rgba(200,176,138,0.5)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                서재를 불러오는 중...
              </div>
            ) : (
              <BookShelf
                portfolios={portfolios}
                selectedStack={selectedStack}
                selectedStatus={selectedStatus}
                selectedProject={selectedProject}
                onDelete={removePortfolio}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
