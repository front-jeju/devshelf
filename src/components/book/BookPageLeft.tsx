import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Portfolio } from '../../types';

interface BookPageLeftProps {
  portfolio: Portfolio;
}

export function BookPageLeft({ portfolio }: BookPageLeftProps) {
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#f6f1e7' }}
    >
      {/* Page header */}
      <div
        className="flex items-center justify-between px-5 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid rgba(80,50,20,0.1)' }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.58rem',
            letterSpacing: '0.22em',
            color: 'rgba(80,50,20,0.42)',
          }}
        >
          PORTFOLIO PREVIEW
        </div>
        <a
          href={portfolio.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.56rem',
            letterSpacing: '0.1em',
            color: 'rgba(80,50,20,0.5)',
            border: '1px solid rgba(80,50,20,0.16)',
            padding: '3px 9px',
            borderRadius: '2px',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          ↗ Open
        </a>
      </div>

      {/* iframe container */}
      <div
        className="flex-1 relative mx-4 my-3 rounded overflow-hidden"
        style={{
          minHeight: 0,
          border: '1px solid rgba(80,50,20,0.1)',
          background: '#ede8dc',
          boxShadow: 'inset 0 1px 3px rgba(80,50,20,0.08)',
        }}
      >
        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && !errored && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-[2] px-6"
              style={{ background: '#f6f1e7' }}
            >
              {/* Skeleton header block */}
              <motion.div
                animate={{ opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '65%',
                  height: 16,
                  background: 'rgba(80,50,20,0.1)',
                  borderRadius: 3,
                  marginBottom: 6,
                }}
              />
              {/* Skeleton lines */}
              {[72, 58, 66, 48, 62, 42, 55].map((w, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.45, 0.2] }}
                  transition={{
                    duration: 1.7,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                  style={{
                    width: `${w}%`,
                    height: 8,
                    background: 'rgba(80,50,20,0.09)',
                    borderRadius: 3,
                  }}
                />
              ))}
              <motion.p
                animate={{ opacity: [0.2, 0.42, 0.2] }}
                transition={{ duration: 1.7, repeat: Infinity, delay: 0.4 }}
                style={{
                  marginTop: 14,
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.78rem',
                  fontStyle: 'italic',
                  color: 'rgba(80,50,20,0.35)',
                }}
              >
                Loading preview…
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error / blocked state */}
        {errored && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: '#f6f1e7' }}
          >
            <div style={{ fontSize: '2rem', opacity: 0.22 }}>📖</div>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: '0.88rem',
                fontStyle: 'italic',
                color: 'rgba(80,50,20,0.38)',
                textAlign: 'center',
                padding: '0 28px',
                lineHeight: 1.6,
              }}
            >
              Preview unavailable
              <br />
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                Site may block embedding
              </span>
            </p>
            <a
              href={portfolio.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.6rem',
                letterSpacing: '0.16em',
                color: 'rgba(80,50,20,0.52)',
                border: '1px solid rgba(80,50,20,0.18)',
                padding: '5px 16px',
                borderRadius: '2px',
                textDecoration: 'none',
                marginTop: 4,
              }}
            >
              OPEN IN NEW TAB ↗
            </a>
          </div>
        )}

        {/* iframe */}
        {!errored && (
          <iframe
            src={portfolio.liveDemo}
            title={`${portfolio.name} preview`}
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setErrored(true);
            }}
            className="w-full h-full border-none block"
            style={{ background: '#fff' }}
          />
        )}

        {/* Inset vignette for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 4px 0 12px rgba(80,50,20,0.06), inset -4px 0 12px rgba(80,50,20,0.04)',
            borderRadius: 'inherit',
          }}
        />
      </div>

      {/* Page footer */}
      <div
        className="shrink-0 px-5 pb-3 pt-1 text-center"
        style={{ borderTop: '1px solid rgba(80,50,20,0.07)' }}
      >
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: '0.6rem',
            fontStyle: 'italic',
            color: 'rgba(80,50,20,0.26)',
          }}
        >
          * Some sites may restrict preview embedding
        </p>
        <div
          className="mt-1.5"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.56rem',
            letterSpacing: '0.18em',
            color: 'rgba(80,50,20,0.22)',
          }}
        >
          — i —
        </div>
      </div>
    </div>
  );
}
