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
