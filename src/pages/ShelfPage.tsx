import { useState } from 'react';
import { FloatingParticles } from '../components/FloatingParticles';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { BookShelf } from '../components/book/BookShelf';
import { usePortfolios } from '../hooks/usePortfolios';
import type { TechStack } from '../types';

export function ShelfPage() {
  const [selectedStack, setSelectedStack] = useState<TechStack | null>(null);
  const { portfolios, loading, removePortfolio } = usePortfolios();

  return (
    <div className="page-bg">
      <FloatingParticles />
      <div className="page-overlay" />

      <div className="relative z-[2]">
        <Header />

        <main className="pt-20">
          <div className="max-w-[900px] mx-auto gold-divider" />

          <FilterBar selected={selectedStack} onSelect={setSelectedStack} />

          <div className="px-6 pb-20">
            {loading ? (
              <div
                className="text-center py-20"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  color: 'rgba(200,176,138,0.5)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                서재를 불러오는 중...
              </div>
            ) : (
              <BookShelf portfolios={portfolios} selectedStack={selectedStack} onDelete={removePortfolio} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
