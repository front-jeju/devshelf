/**
 * BookCover.tsx
 * 책을 클릭했을 때 나타나는 '표지 오버레이' 컴포넌트입니다.
 * BookShelf의 phase='cover' 단계에서 표시됩니다.
 *
 * 역할:
 *   - 선택된 포트폴리오의 이름·역할·태그라인을 표지 디자인으로 보여줍니다.
 *   - 표지 클릭 → onOpen() → BookShelf에서 phase='open' (OpenBook)으로 전환합니다.
 *   - ESC 키 또는 배경 클릭 → onClose() → 오버레이를 닫습니다.
 *
 * 로직 흐름:
 *   useEffect로 keydown 이벤트 리스너 등록 → ESC 감지 → onClose()
 *   배경(motion.div) 클릭 → onClose()
 *   표지(motion.div) 클릭 → e.stopPropagation() 후 onOpen()
 */
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Portfolio } from '../../types';

interface BookCoverProps {
  portfolio: Portfolio;
  onOpen: () => void;   // 표지 클릭 시 호출 → OpenBook으로 전환
  onClose: () => void;  // ESC/배경 클릭 시 호출 → 오버레이 닫기
}

export function BookCover({ portfolio, onOpen, onClose }: BookCoverProps) {
  // ESC 키로 오버레이를 닫는 키보드 이벤트 등록
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(5,2,0,0.90)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      {/* ESC hint */}
      <div
        className="absolute top-6 right-6"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: 'rgba(200,176,138,0.3)',
        }}
      >
        ESC to close
      </div>

      {/* Bottom instruction */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        className="absolute bottom-10"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.62rem',
          letterSpacing: '0.28em',
          color: 'rgba(200,176,138,0.35)',
        }}
      >
        CLICK COVER TO OPEN
      </motion.div>

      {/* Perspective wrapper */}
      <div style={{ perspective: '1200px' }}>
        <motion.div
          initial={{ scale: 0.78, opacity: 0, rotateY: -20, y: 24 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0, y: 0 }}
          exit={{ scale: 0.82, opacity: 0, rotateY: 14, y: -10 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotateY: -8, scale: 1.02, transition: { duration: 0.25 } }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="relative cursor-pointer select-none"
          style={{ width: 280, height: 420 }}
        >
          {/* Ambient glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: -60,
              background: `radial-gradient(ellipse at center, ${portfolio.accentColor}20 0%, transparent 68%)`,
              filter: 'blur(20px)',
            }}
          />

          {/* Floor shadow */}
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: -28,
              left: '8%',
              right: '8%',
              height: 32,
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.75) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }}
          />

          {/* Left binding shadow */}
          <div
            className="absolute left-0 top-0 bottom-0 z-[2] pointer-events-none"
            style={{
              width: 22,
              borderRadius: '3px 0 0 3px',
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.18) 65%, transparent 100%)',
            }}
          />

          {/* Main cover body */}
          <div
            className="w-full h-full relative overflow-hidden flex flex-col"
            style={{
              borderRadius: '3px 6px 6px 3px',
              background: `linear-gradient(158deg,
                ${portfolio.coverColor}ff 0%,
                ${portfolio.spineColor}f0 30%,
                ${portfolio.coverColor}cc 62%,
                ${portfolio.spineColor}bb 100%
              )`,
              boxShadow: `
                6px 10px 44px rgba(0,0,0,0.88),
                -2px 0 14px rgba(0,0,0,0.55),
                inset 0 1px 0 rgba(255,255,255,0.07),
                0 0 0 1px rgba(0,0,0,0.35)
              `,
            }}
          >
            {/* Linen texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.18]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.06) 2px,
                  rgba(0,0,0,0.06) 3px
                ), repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 6px,
                  rgba(255,255,255,0.02) 6px,
                  rgba(255,255,255,0.02) 7px
                )`,
              }}
            />

            {/* Top rule */}
            <div
              className="absolute"
              style={{
                top: 20,
                left: 22,
                right: 22,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${portfolio.accentColor}75, transparent)`,
              }}
            />

            {/* Inner border frame */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: 30,
                border: `1px solid ${portfolio.accentColor}28`,
                borderRadius: 2,
              }}
            />

            {/* Bottom rule */}
            <div
              className="absolute"
              style={{
                bottom: 20,
                left: 22,
                right: 22,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${portfolio.accentColor}75, transparent)`,
              }}
            />

            {/* Content */}
            <div className="flex flex-col items-center justify-center flex-1 px-10 text-center gap-4">
              {/* Top ornament */}
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.1rem',
                  color: portfolio.accentColor,
                  opacity: 0.5,
                  letterSpacing: '0.35em',
                }}
              >
                ✦
              </div>

              {/* Name */}
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: portfolio.name.length > 12 ? '1.2rem' : '1.45rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: portfolio.accentColor,
                  textShadow: `0 0 28px ${portfolio.accentColor}55`,
                  lineHeight: 1.25,
                }}
              >
                {portfolio.name}
              </h1>

              {/* Gold rule */}
              <div
                style={{
                  width: 48,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${portfolio.accentColor}90, transparent)`,
                }}
              />

              {/* Role */}
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.86rem',
                  fontStyle: 'italic',
                  color: `${portfolio.accentColor}cc`,
                  letterSpacing: '0.08em',
                  lineHeight: 1.4,
                }}
              >
                {portfolio.role}
              </p>

              {/* Tagline */}
              {portfolio.tagline && (
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '0.76rem',
                    color: `${portfolio.accentColor}58`,
                    lineHeight: 1.65,
                    fontStyle: 'italic',
                    marginTop: 2,
                  }}
                >
                  &ldquo;{portfolio.tagline}&rdquo;
                </p>
              )}

              {/* Bottom ornament */}
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.1rem',
                  color: portfolio.accentColor,
                  opacity: 0.5,
                  letterSpacing: '0.35em',
                  marginTop: 2,
                }}
              >
                ✦
              </div>

              {/* Pulsing "OPEN" hint */}
              <motion.div
                animate={{ opacity: [0.3, 0.65, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.56rem',
                  letterSpacing: '0.3em',
                  color: `${portfolio.accentColor}70`,
                  marginTop: 6,
                }}
              >
                OPEN →
              </motion.div>
            </div>

            {/* Stack indicator dots */}
            <div className="flex justify-center gap-1.5 pb-6 shrink-0">
              {portfolio.techStack.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: portfolio.accentColor,
                    opacity: Math.max(0.15, 0.45 - i * 0.07),
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
