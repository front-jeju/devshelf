/**
 * HeroSection.tsx
 * 메인 페이지(/)의 풀스크린 히어로 영역입니다.
 *
 * 구성:
 *   Candle        — 촛불 장식 컴포넌트 (데스크탑 좌우 2개씩 배치)
 *   HeroSection   — 메인 타이틀, 설명 문구, CTA 버튼 2개, 스크롤 인디케이터
 *
 * CTA 버튼 로직:
 *   "서재 둘러보기" → /shelf 이동
 *   "내 서재 등록"  → 로그인 상태면 /portfolio/new, 비로그인이면 /login 으로 이동
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/** 촛불 장식 컴포넌트. delay 값으로 각 촛불의 애니메이션 위상을 다르게 합니다. */
function Candle({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {/* 불꽃 */}
      <motion.div
        style={{
          width: 8,
          height: 14,
          background: 'radial-gradient(ellipse at 50% 80%, #fff 0%, #ff8c00 30%, #ff4500 70%, transparent 100%)',
          borderRadius: '50% 50% 30% 30%',
          filter: 'blur(1px)',
        }}
        animate={{ scaleX: [1, 0.8, 1.1, 0.9, 1], scaleY: [1, 1.1, 0.9, 1.05, 1], opacity: [0.9, 1, 0.85, 1, 0.9] }}
        transition={{ duration: 1.5 + delay * 0.3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* glow */}
      <motion.div
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,0,0.4) 0%, transparent 70%)',
          marginTop: -20,
          marginBottom: 4,
        }}
        animate={{ opacity: [0.6, 1, 0.7, 0.9, 0.6] }}
        transition={{ duration: 2 + delay * 0.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 몸통 */}
      <div
        style={{
          width: 10,
          height: 50,
          background: 'linear-gradient(180deg, #f5e6c8 0%, #e8d5a3 50%, #c8b08a 100%)',
          borderRadius: '1px',
          boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.2)',
        }}
      />
    </motion.div>
  );
}

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center"
      style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 40 }}
    >
      {/* 배경 빛 효과 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 65%)' }}
      />

      {/* 촛불 그룹 - 왼쪽 */}
      <motion.div
        className="absolute hidden md:flex gap-4"
        style={{ left: '10%', top: '35%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Candle delay={0} />
        <Candle delay={0.5} />
      </motion.div>

      {/* 촛불 그룹 - 오른쪽 */}
      <motion.div
        className="absolute hidden md:flex gap-4"
        style={{ right: '10%', top: '35%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <Candle delay={0.3} />
        <Candle delay={0.8} />
      </motion.div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-[2]">
        {/* 상단 장식 */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
          <span style={{ color: '#d4af37', fontSize: '1.2rem' }}>✦</span>
          <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
        </motion.div>

        {/* 서브타이틀 */}
        <motion.p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: '1rem',
            letterSpacing: '0.3em',
            color: '#c8b08a',
            fontStyle: 'italic',
            marginBottom: '1.5rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Welcome to
        </motion.p>

        {/* 메인 제목 */}
        <motion.h1
          style={{
            fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
            fontSize: 'clamp(2.2rem, 6vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #f0c040 0%, #d4af37 30%, #c9a84c 60%, #f5d060 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.3))',
            marginBottom: '0.5rem',
          }}
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.08em' }}
          transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          DEVSHELF
        </motion.h1>

        {/* 한국어 부제목 */}
        <motion.p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            color: '#c8b08a',
            fontStyle: 'italic',
            letterSpacing: '0.05em',
            marginBottom: '2.5rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          개발자의 서재
        </motion.p>

        {/* 설명 문구 */}
        <motion.p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: 'rgba(200,176,138,0.8)',
            maxWidth: 560,
            margin: '0 auto 3rem',
            lineHeight: 1.9,
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          서재는 이야기이고, 프로젝트 페이지는 증명서다.
          <br />
          <span style={{ color: 'rgba(200,176,138,0.55)', fontStyle: 'italic', fontSize: '0.95em' }}>
            — 개발자 한 명 한 명의 이야기를 책으로 경험하세요.
          </span>
        </motion.p>

        {/* CTA 버튼 그룹 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <motion.button
            onClick={() => navigate('/shelf')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.9rem',
              letterSpacing: '0.15em',
              padding: '14px 36px',
              background: 'linear-gradient(135deg, #d4af37, #c9a84c)',
              color: '#1a0d00',
              fontWeight: 700,
              borderRadius: '2px',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(212,175,55,0.25)',
              border: 'none',
            }}
          >
            서재 둘러보기
          </motion.button>

          <motion.button
            onClick={() => navigate(user ? '/portfolio/new' : '/login')}
            whileHover={{ scale: 1.05, borderColor: 'rgba(212,175,55,0.8)' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.85rem',
              letterSpacing: '0.12em',
              padding: '13px 28px',
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#d4af37',
              background: 'transparent',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            내 서재 등록
          </motion.button>
        </motion.div>

        {/* 하단 장식 */}
        <motion.div
          className="flex items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="h-px w-15" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
          <span style={{ color: 'rgba(212,175,55,0.4)', fontSize: '0.8rem', fontFamily: "'Cinzel', serif", letterSpacing: '0.2em' }}>
            MMXXVI
          </span>
          <div className="h-px w-15" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
        </motion.div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        initial={{ opacity: 0 }}
        style={{ opacity: 0 }}
      >
        <motion.div
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="flex flex-col items-center gap-1"
          style={{ color: 'rgba(212,175,55,0.5)', fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', letterSpacing: '0.2em' }}
        >
          <span>scroll</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(180deg, rgba(212,175,55,0.5), transparent)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
