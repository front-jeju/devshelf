/**
 * MainPage.tsx
 * 루트 경로(/)에 렌더링되는 메인 랜딩 페이지입니다.
 *
 * 구성:
 *   FloatingParticles → 배경 파티클 애니메이션
 *   Header           → 상단 네비게이션
 *   HeroSection      → 메인 타이틀·CTA 버튼·방명록
 *   Footer           → 하단 팀 소개
 */
import { FloatingParticles } from '../components/FloatingParticles';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { Footer } from '../components/Footer';

export function MainPage() {
  return (
    <div className="page-bg">
      <FloatingParticles />
      <div className="page-overlay" />

      <div className="relative z-[2]">
        <Header />
        <main>
          <HeroSection />
        </main>
        <div className="max-w-[800px] mx-auto px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
