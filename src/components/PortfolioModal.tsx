/**
 * PortfolioModal.tsx
 * 책을 클릭했을 때 나타나는 상세 정보 모달입니다.
 *
 * 새로 추가된 기능:
 * - 현재 로그인한 사용자가 이 포트폴리오의 작성자일 경우
 *   "수정" / "삭제" 버튼이 나타납니다.
 * - 삭제 버튼 클릭 시 확인 단계를 거친 후 Firestore에서 삭제합니다.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Portfolio } from '../types';
import { TECH_COLORS } from '../data/stacks';
import { useAuth } from '../contexts/AuthContext';       // 현재 로그인 사용자 정보
import { deletePortfolio } from '../lib/portfolioService'; // 삭제 함수

interface PortfolioModalProps {
  portfolio: Portfolio;
  onClose: () => void;
  onDelete: (id: string) => void; // 삭제 성공 후 목록에서 제거하는 콜백
}

export function PortfolioModal({ portfolio, onClose, onDelete }: PortfolioModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth(); // 현재 로그인한 사용자 (null이면 비로그인)

  // 포트폴리오 미리보기 iframe 관련 상태
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);

  // 삭제 확인 단계를 보여줄지 여부
  // false: 기본 상태 / true: "정말 삭제하시겠습니까?" 확인 UI 표시
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 삭제 요청 중인지 여부 (중복 클릭 방지)
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * 현재 사용자가 이 포트폴리오의 소유자인지 확인합니다.
   * - user가 null이면 비로그인 → false
   * - portfolio.uid가 없으면 (정적 데모 데이터) → false
   * - 둘 다 있고 일치하면 → true
   */
  const isOwner = !!user && !!portfolio.uid && user.uid === portfolio.uid;

  /**
   * 삭제 실행 함수
   * 1. Firestore에서 문서를 삭제합니다
   * 2. onDelete 콜백을 호출해 목록에서도 제거합니다
   * 3. 모달을 닫습니다
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePortfolio(portfolio.id); // Firestore에서 삭제
      onDelete(portfolio.id);              // 부모 컴포넌트의 목록에서도 제거
      onClose();                           // 모달 닫기
    } catch {
      // 삭제 실패 시 확인 단계를 닫고 일반 상태로 돌아갑니다
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
      onClick={onClose} // 배경 클릭 시 모달 닫기
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.9 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 닫기 방지
        style={{
          width: '100%',
          maxWidth: 720,
          background: 'linear-gradient(135deg, #1e0f00 0%, #120800 60%, #0a0500 100%)',
          border: `1px solid ${portfolio.accentColor}30`,
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: `0 24px 80px rgba(0,0,0,0.9), 0 0 60px ${portfolio.accentColor}10`,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* 상단 컬러 바 (포트폴리오 테마 색상) */}
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg, ${portfolio.coverColor}, ${portfolio.spineColor}, ${portfolio.accentColor})`,
          }}
        />

        <div style={{ padding: '36px' }}>

          {/* ── 상단 정보: 이름, 직군, 닫기 버튼 ── */}
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
              onClick={onClose}
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

          {/* ── 소유자 전용: 수정 / 삭제 버튼 ── */}
          {/* isOwner가 true일 때만 이 영역이 렌더링됩니다 */}
          {isOwner && (
            <div style={{ marginBottom: 20 }}>

              {/* 삭제 확인 단계 (showDeleteConfirm이 true일 때 표시) */}
              <AnimatePresence mode="wait">
                {showDeleteConfirm ? (
                  // 삭제 확인 UI
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 16px',
                      background: 'rgba(248,113,113,0.08)',
                      border: '1px solid rgba(248,113,113,0.25)',
                      borderRadius: 3,
                    }}
                  >
                    <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'rgba(200,176,138,0.8)', flex: 1, fontStyle: 'italic' }}>
                      정말 삭제하시겠습니까? 복구할 수 없습니다.
                    </span>
                    {/* 삭제 취소 */}
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em',
                        color: 'rgba(200,176,138,0.6)',
                        background: 'transparent',
                        border: '1px solid rgba(200,176,138,0.2)',
                        padding: '6px 14px',
                        borderRadius: 2,
                        cursor: 'pointer',
                      }}
                    >
                      취소
                    </button>
                    {/* 삭제 최종 확인 */}
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDelete}
                      disabled={isDeleting}
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em',
                        color: '#fff',
                        background: isDeleting ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.8)',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: 2,
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isDeleting ? '삭제 중...' : '삭제'}
                    </motion.button>
                  </motion.div>
                ) : (
                  // 수정 / 삭제 버튼 (기본 상태)
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', gap: 8 }}
                  >
                    {/* 수정 버튼: 수정 페이지로 이동 */}
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/portfolio/edit/${portfolio.id}`)}
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.72rem',
                        letterSpacing: '0.1em',
                        color: '#d4af37',
                        background: 'rgba(212,175,55,0.08)',
                        border: '1px solid rgba(212,175,55,0.35)',
                        padding: '7px 18px',
                        borderRadius: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      ✏ 수정
                    </motion.button>
                    {/* 삭제 버튼: 삭제 확인 단계 표시 */}
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowDeleteConfirm(true)}
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.72rem',
                        letterSpacing: '0.1em',
                        color: 'rgba(248,113,113,0.8)',
                        background: 'rgba(248,113,113,0.06)',
                        border: '1px solid rgba(248,113,113,0.25)',
                        padding: '7px 18px',
                        borderRadius: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      🗑 삭제
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

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
                    border: `1px solid ${TECH_COLORS[tech] || '#d4af37'}40`,
                    color: TECH_COLORS[tech] || '#d4af37',
                    background: `${TECH_COLORS[tech] || '#d4af37'}12`,
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
                  const opening = !showIframe;
                  if (opening) setIframeLoading(true);
                  setShowIframe(opening);
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
  );
}
