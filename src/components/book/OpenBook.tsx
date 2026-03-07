import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Portfolio } from '../../types';
import { BookPageLeft } from './BookPageLeft';
import { BookPageRight } from './BookPageRight';

interface OpenBookProps {
  portfolio: Portfolio;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function OpenBook({ portfolio, onDelete, onClose }: OpenBookProps) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => setIsMobile(window.innerWidth < 768), 150);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      style={{ background: 'rgba(5,2,0,0.90)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      {/* Top-right close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 cursor-pointer"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: 'rgba(200,176,138,0.32)',
          background: 'none',
          border: '1px solid rgba(200,176,138,0.14)',
          padding: '5px 12px',
          borderRadius: '2px',
        }}
      >
        ESC ✕
      </button>

      {isMobile ? (
        <MobileCard portfolio={portfolio} onDelete={onDelete} onClose={onClose} />
      ) : (
        <DesktopBook portfolio={portfolio} onDelete={onDelete} onClose={onClose} />
      )}
    </motion.div>
  );
}

// ── Desktop two-page book ──────────────────────────────────────

function DesktopBook({ portfolio, onDelete, onClose }: OpenBookProps) {
  return (
    <motion.div
      initial={{ scale: 0.86, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.86, opacity: 0, transition: { duration: 0.22 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="relative"
      style={{
        width: 'min(900px, 94vw)',
        height: 'min(600px, 88vh)',
      }}
    >
      {/* Book floor shadow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -24,
          left: '5%',
          right: '5%',
          height: 32,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Perspective wrapper for 3-D page opening */}
      <div
        className="w-full h-full"
        style={{ perspective: '2400px', perspectiveOrigin: 'center center' }}
      >
        <div
          className="w-full h-full flex"
          style={{
            borderRadius: '3px 6px 6px 3px',
            overflow: 'hidden',
            boxShadow: `
              0 24px 80px rgba(0,0,0,0.92),
              0 8px 32px rgba(0,0,0,0.6),
              0 0 0 1px rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* LEFT PAGE — opens from folded to flat */}
          <motion.div
            className="flex-1 relative overflow-hidden"
            initial={{ rotateY: -28, originX: '100%' }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'right center' }}
          >
            <BookPageLeft portfolio={portfolio} />
            {/* Center-binding inner shadow */}
            <div
              className="absolute top-0 bottom-0 right-0 pointer-events-none z-[2]"
              style={{
                width: 28,
                background:
                  'linear-gradient(270deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 60%, transparent 100%)',
              }}
            />
            {/* Subtle page-curl top-left */}
            <div
              className="absolute top-0 left-0 pointer-events-none z-[2]"
              style={{
                width: 32,
                height: 32,
                background:
                  'radial-gradient(circle at 0% 0%, rgba(0,0,0,0.06) 0%, transparent 70%)',
              }}
            />
          </motion.div>

          {/* CENTER SPINE */}
          <motion.div
            initial={{ scaleX: 0.5, opacity: 0.4 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: 24,
              flexShrink: 0,
              position: 'relative',
              background: `linear-gradient(90deg,
                ${portfolio.spineColor}e8 0%,
                ${portfolio.coverColor}cc 40%,
                ${portfolio.spineColor}d0 60%,
                ${portfolio.coverColor}b0 100%
              )`,
            }}
          >
            {/* Left gutter shadow */}
            <div
              className="absolute left-0 top-0 bottom-0 pointer-events-none"
              style={{
                width: 10,
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.35) 0%, transparent 100%)',
              }}
            />
            {/* Right gutter shadow */}
            <div
              className="absolute right-0 top-0 bottom-0 pointer-events-none"
              style={{
                width: 10,
                background:
                  'linear-gradient(270deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
              }}
            />
            {/* Spine center line */}
            <div
              className="absolute left-1/2 top-6 bottom-6 pointer-events-none"
              style={{
                width: 1,
                transform: 'translateX(-50%)',
                background: `linear-gradient(180deg, transparent, ${portfolio.accentColor}30, transparent)`,
              }}
            />
          </motion.div>

          {/* RIGHT PAGE — opens from folded to flat */}
          <motion.div
            className="flex-1 relative overflow-hidden"
            initial={{ rotateY: 28, originX: '0%' }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.72, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left center' }}
          >
            <BookPageRight portfolio={portfolio} onDelete={onDelete} onClose={onClose} />
            {/* Center-binding inner shadow */}
            <div
              className="absolute top-0 bottom-0 left-0 pointer-events-none z-[2]"
              style={{
                width: 28,
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.04) 60%, transparent 100%)',
              }}
            />
            {/* Subtle page-curl top-right */}
            <div
              className="absolute top-0 right-0 pointer-events-none z-[2]"
              style={{
                width: 32,
                height: 32,
                background:
                  'radial-gradient(circle at 100% 0%, rgba(0,0,0,0.06) 0%, transparent 70%)',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Decorative top accent bar */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: 3,
          borderRadius: '3px 6px 0 0',
          background: `linear-gradient(90deg,
            ${portfolio.coverColor},
            ${portfolio.spineColor},
            ${portfolio.accentColor},
            ${portfolio.spineColor},
            ${portfolio.coverColor}
          )`,
          transformOrigin: 'left center',
        }}
      />
    </motion.div>
  );
}

// ── Mobile stacked card fallback ──────────────────────────────

function MobileCard({ portfolio, onDelete, onClose }: OpenBookProps) {
  const [tab, setTab] = useState<'info' | 'preview'>('info');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-[420px] rounded-md overflow-hidden flex flex-col"
      style={{
        maxHeight: '88vh',
        background: '#f6f1e7',
        boxShadow: '0 20px 60px rgba(0,0,0,0.88)',
      }}
    >
      {/* Color bar */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${portfolio.coverColor}, ${portfolio.spineColor}, ${portfolio.accentColor})`,
          flexShrink: 0,
        }}
      />

      {/* Tab switcher */}
      <div
        className="flex shrink-0"
        style={{ borderBottom: '1px solid rgba(80,50,20,0.12)', background: '#f0ebe0' }}
      >
        {(['info', 'preview'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              fontFamily: "'Cinzel', serif",
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              padding: '10px 0',
              background: tab === t ? '#f6f1e7' : 'transparent',
              border: 'none',
              borderBottom: tab === t ? '2px solid rgba(80,50,20,0.4)' : '2px solid transparent',
              color: tab === t ? 'rgba(80,50,20,0.7)' : 'rgba(80,50,20,0.38)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t === 'info' ? 'PROFILE' : 'PREVIEW'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {tab === 'info' ? (
          <BookPageRight portfolio={portfolio} onDelete={onDelete} onClose={onClose} />
        ) : (
          <BookPageLeft portfolio={portfolio} />
        )}
      </div>
    </motion.div>
  );
}
