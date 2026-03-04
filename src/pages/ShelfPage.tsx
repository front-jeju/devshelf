import { useState } from 'react';
import { FloatingParticles } from '../components/FloatingParticles';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { BookShelf } from '../components/BookShelf';
import { usePortfolios } from '../hooks/usePortfolios';
import type { TechStack } from '../types';

export function ShelfPage() {
  const [selectedStack, setSelectedStack] = useState<TechStack | null>(null);
  const { portfolios, loading } = usePortfolios();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0500 0%, #0f0700 30%, #120800 60%, #0a0500 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FloatingParticles />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(100, 40, 10, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(60, 20, 5, 0.03) 0%, transparent 70%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Header />

        <main style={{ paddingTop: 80 }}>
          <div
            style={{
              maxWidth: 900,
              margin: '0 auto 0',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)',
            }}
          />

          <FilterBar selected={selectedStack} onSelect={setSelectedStack} />

          <div style={{ padding: '0 24px 80px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'EB Garamond', serif", color: 'rgba(200,176,138,0.5)', fontStyle: 'italic', fontSize: '1rem', letterSpacing: '0.1em' }}>
                서재를 불러오는 중...
              </div>
            ) : (
              <BookShelf portfolios={portfolios} selectedStack={selectedStack} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
