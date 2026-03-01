import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Portfolio } from '../types';

interface BookCardProps {
  portfolio: Portfolio;
  isFiltered: boolean;
}

const techColors: Record<string, string> = {
  React: '#61DAFB',
  TypeScript: '#3178C6',
  'Next.js': '#ffffff',
  Vue: '#42B883',
  'Node.js': '#339933',
  Python: '#FFD43B',
  'UI/UX': '#FF6B9D',
  Spring: '#6DB33F',
  GraphQL: '#E10098',
  'Three.js': '#ffffff',
};

export function BookCard({ portfolio, isFiltered }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);

  return (
    <>
      {/* 책 카드 */}
      <motion.div
        className="book-wrapper relative select-none"
        style={{
          width: 80,
          height: 200,
          cursor: 'pointer',
        }}
        animate={{
          opacity: isFiltered ? 0.18 : 1,
          filter: isFiltered ? 'saturate(0) brightness(0.4)' : 'none',
          scale: isFiltered ? 0.97 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onHoverStart={() => !isFiltered && setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => !isFiltered && setShowDetail(true)}
      >
        {/* 책 본체 */}
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            borderRadius: '2px 4px 4px 2px',
            transformOrigin: 'left center',
          }}
          animate={{
            x: isHovered ? -12 : 0,
            rotateY: isHovered ? 8 : 0,
            boxShadow: isHovered
              ? `8px 12px 30px rgba(0,0,0,0.8), -2px 0 8px rgba(0,0,0,0.4), 0 0 20px ${portfolio.spineColor}40`
              : '4px 6px 15px rgba(0,0,0,0.6), -1px 0 4px rgba(0,0,0,0.3)',
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 책 등(spine) */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '2px 4px 4px 2px',
              background: `linear-gradient(180deg,
                ${portfolio.coverColor}ee 0%,
                ${portfolio.spineColor} 30%,
                ${portfolio.spineColor}dd 70%,
                ${portfolio.coverColor}cc 100%
              )`,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 6px',
            }}
          >
            {/* 왼쪽 바인딩 선 */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 6,
                background: `linear-gradient(180deg,
                  rgba(0,0,0,0.4) 0%,
                  rgba(0,0,0,0.2) 50%,
                  rgba(0,0,0,0.4) 100%
                )`,
                boxShadow: 'inset -1px 0 2px rgba(255,255,255,0.1)',
              }}
            />

            {/* 황금 장식선 상단 */}
            <div
              style={{
                width: '70%',
                height: 1,
                background: `linear-gradient(90deg, transparent, ${portfolio.accentColor}80, transparent)`,
                marginBottom: 8,
              }}
            />

            {/* 제목 (세로) */}
            <div
              style={{
                writingMode: 'vertical-lr',
                textOrientation: 'mixed',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: portfolio.accentColor,
                textShadow: `0 0 10px ${portfolio.accentColor}60`,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: 120,
                overflow: 'hidden',
                lineHeight: 1.2,
              }}
            >
              {portfolio.name}
            </div>

            {/* 역할 (세로 작게) */}
            <div
              style={{
                writingMode: 'vertical-lr',
                textOrientation: 'mixed',
                fontFamily: "'EB Garamond', serif",
                fontSize: '0.58rem',
                color: `${portfolio.accentColor}90`,
                letterSpacing: '0.05em',
                marginTop: 4,
              }}
            >
              {portfolio.role.split(' ')[0]}
            </div>

            {/* 황금 장식선 하단 */}
            <div
              style={{
                width: '70%',
                height: 1,
                background: `linear-gradient(90deg, transparent, ${portfolio.accentColor}80, transparent)`,
                marginTop: 8,
              }}
            />

            {/* featured 배지 */}
            {portfolio.featured && (
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 4,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#d4af37',
                  boxShadow: '0 0 8px rgba(212,175,55,0.8)',
                }}
              />
            )}

            {/* 텍스처 오버레이 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </motion.div>

        {/* 호버 시 미리보기 패널 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                left: 'calc(100% + 12px)',
                top: 0,
                width: 220,
                background: `linear-gradient(135deg, #1a0d00f5 0%, #0f0700f0 100%)`,
                border: `1px solid ${portfolio.accentColor}40`,
                borderRadius: 4,
                padding: '16px',
                boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 20px ${portfolio.accentColor}15`,
                zIndex: 20,
                pointerEvents: 'none',
              }}
            >
              {/* 이름 */}
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: portfolio.accentColor,
                  marginBottom: 4,
                }}
              >
                {portfolio.name}
              </div>

              {/* 역할 */}
              <div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.82rem',
                  color: '#c8b08a',
                  fontStyle: 'italic',
                  marginBottom: 10,
                }}
              >
                {portfolio.role}
              </div>

              {/* 구분선 */}
              <div
                style={{
                  height: 1,
                  background: `linear-gradient(90deg, ${portfolio.accentColor}40, transparent)`,
                  marginBottom: 10,
                }}
              />

              {/* 한 줄 소개 */}
              <div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.82rem',
                  color: 'rgba(200,176,138,0.8)',
                  lineHeight: 1.6,
                  marginBottom: 10,
                }}
              >
                {portfolio.tagline}
              </div>

              {/* 기술 스택 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {portfolio.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: 2,
                      border: `1px solid ${techColors[tech] || '#d4af37'}30`,
                      color: techColors[tech] || '#d4af37',
                      background: `${techColors[tech] || '#d4af37'}10`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* 프로젝트 수 */}
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.7rem',
                  color: 'rgba(200,176,138,0.5)',
                  letterSpacing: '0.1em',
                }}
              >
                {portfolio.projectCount} projects · 클릭하여 열람
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 상세 모달 */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5,2,0,0.92)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => { setShowDetail(false); setShowIframe(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 720,
                background: 'linear-gradient(135deg, #1e0f00 0%, #120800 60%, #0a0500 100%)',
                border: `1px solid ${portfolio.accentColor}30`,
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: `0 24px 80px rgba(0,0,0,0.9), 0 0 60px ${portfolio.accentColor}10`,
              }}
            >
              {/* 모달 헤더 바 */}
              <div
                style={{
                  height: 4,
                  background: `linear-gradient(90deg, ${portfolio.coverColor}, ${portfolio.spineColor}, ${portfolio.accentColor})`,
                }}
              />

              <div style={{ padding: '36px' }}>
                {/* 상단 정보 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "'EB Garamond', serif",
                        fontSize: '0.8rem',
                        color: 'rgba(200,176,138,0.5)',
                        letterSpacing: '0.2em',
                        fontStyle: 'italic',
                        marginBottom: 6,
                      }}
                    >
                      — {portfolio.role}
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        color: portfolio.accentColor,
                        letterSpacing: '0.08em',
                        textShadow: `0 0 20px ${portfolio.accentColor}30`,
                      }}
                    >
                      {portfolio.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => { setShowDetail(false); setShowIframe(false); }}
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.75rem',
                      color: 'rgba(200,176,138,0.5)',
                      background: 'none',
                      border: '1px solid rgba(200,176,138,0.2)',
                      padding: '6px 12px',
                      borderRadius: 2,
                      cursor: 'pointer',
                      letterSpacing: '0.1em',
                    }}
                  >
                    닫기 ✕
                  </button>
                </div>

                {/* 구분선 */}
                <div
                  style={{
                    height: 1,
                    background: `linear-gradient(90deg, ${portfolio.accentColor}40, transparent)`,
                    marginBottom: 24,
                  }}
                />

                {/* 한 줄 소개 */}
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                    color: '#c8b08a',
                    lineHeight: 1.7,
                    marginBottom: 20,
                  }}
                >
                  "{portfolio.tagline}"
                </p>

                {/* 설명 */}
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '1rem',
                    color: 'rgba(200,176,138,0.8)',
                    lineHeight: 1.9,
                    marginBottom: 24,
                  }}
                >
                  {portfolio.description}
                </p>

                {/* 기술 스택 */}
                <div style={{ marginBottom: 28 }}>
                  <div
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.72rem',
                      letterSpacing: '0.2em',
                      color: 'rgba(200,176,138,0.5)',
                      marginBottom: 10,
                    }}
                  >
                    TECH STACK
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {portfolio.techStack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontFamily: "'EB Garamond', serif",
                          fontSize: '0.9rem',
                          padding: '4px 14px',
                          borderRadius: 2,
                          border: `1px solid ${techColors[tech] || '#d4af37'}40`,
                          color: techColors[tech] || '#d4af37',
                          background: `${techColors[tech] || '#d4af37'}12`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 포트폴리오 미리보기 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showIframe ? 10 : 0 }}>
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.72rem',
                        letterSpacing: '0.2em',
                        color: 'rgba(200,176,138,0.5)',
                      }}
                    >
                      PREVIEW
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (!showIframe) setIframeLoading(true);
                        setShowIframe((v) => !v);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.62rem',
                        letterSpacing: '0.1em',
                        color: showIframe ? portfolio.accentColor : 'rgba(200,176,138,0.5)',
                        background: 'transparent',
                        border: `1px solid ${showIframe ? portfolio.accentColor + '50' : 'rgba(200,176,138,0.2)'}`,
                        borderRadius: 2,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span>{showIframe ? '▲' : '▼'}</span>
                      {showIframe ? '닫기' : '열기'}
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showIframe && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            border: `1px solid ${portfolio.accentColor}25`,
                            borderRadius: 4,
                            overflow: 'hidden',
                            background: '#0a0500',
                          }}
                        >
                          {/* 브라우저 크롬 바 */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '6px 10px',
                              background: `${portfolio.accentColor}0a`,
                              borderBottom: `1px solid ${portfolio.accentColor}20`,
                            }}
                          >
                            <div style={{ display: 'flex', gap: 4 }}>
                              {['#f87171', '#fb923c', '#34d399'].map((c) => (
                                <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.55 }} />
                              ))}
                            </div>
                            <div
                              style={{
                                flex: 1,
                                fontFamily: "'EB Garamond', serif",
                                fontSize: '0.68rem',
                                color: 'rgba(200,176,138,0.35)',
                                fontStyle: 'italic',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {portfolio.liveDemo}
                            </div>
                            <a
                              href={portfolio.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: '0.58rem',
                                letterSpacing: '0.06em',
                                color: `${portfolio.accentColor}80`,
                                textDecoration: 'none',
                                flexShrink: 0,
                              }}
                            >
                              ↗ 열기
                            </a>
                          </div>

                          {/* 로딩 오버레이 */}
                          {iframeLoading && (
                            <div
                              style={{
                                position: 'absolute',
                                inset: '30px 0 0 0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#0a0500',
                                zIndex: 1,
                                gap: 10,
                              }}
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                style={{
                                  width: 22,
                                  height: 22,
                                  border: `2px solid ${portfolio.accentColor}20`,
                                  borderTopColor: portfolio.accentColor,
                                  borderRadius: '50%',
                                }}
                              />
                              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.78rem', color: 'rgba(200,176,138,0.4)', fontStyle: 'italic' }}>
                                불러오는 중...
                              </span>
                            </div>
                          )}

                          <iframe
                            src={portfolio.liveDemo}
                            title={`${portfolio.name} 포트폴리오 미리보기`}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            onLoad={() => setIframeLoading(false)}
                            onError={() => setIframeLoading(false)}
                            style={{
                              display: 'block',
                              width: '100%',
                              height: 380,
                              border: 'none',
                              background: '#fff',
                            }}
                          />
                        </div>
                        <p
                          style={{
                            marginTop: 5,
                            fontFamily: "'EB Garamond', serif",
                            fontSize: '0.7rem',
                            color: 'rgba(200,176,138,0.25)',
                            fontStyle: 'italic',
                          }}
                        >
                          * 보안 정책에 따라 일부 사이트는 미리보기가 제한될 수 있습니다.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 링크 버튼 */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <a
                    href={portfolio.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      padding: '12px',
                      border: '1px solid rgba(212,175,55,0.4)',
                      borderRadius: 2,
                      color: '#d4af37',
                      background: 'rgba(212,175,55,0.06)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>📦</span> GitHub
                  </a>
                  <a
                    href={portfolio.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      padding: '12px',
                      borderRadius: 2,
                      color: '#1a0d00',
                      background: `linear-gradient(135deg, ${portfolio.accentColor}, ${portfolio.spineColor})`,
                      textDecoration: 'none',
                      fontWeight: 700,
                    }}
                  >
                    <span>🌐</span> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
