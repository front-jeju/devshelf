/**
 * BookPageRight.tsx
 * OpenBook의 오른쪽 페이지 컴포넌트입니다.
 * 포트폴리오 상세 정보(이름·역할·태그라인·설명·기술스택·링크)를 표시합니다.
 *
 * 소유자 전용 기능:
 *   isOwner = 로그인 사용자 uid === portfolio.uid 일 때 Edit·Delete 버튼 노출
 *
 * 삭제 로직 흐름:
 *   "Delete" 클릭 → showDeleteConfirm=true → 확인 UI 표시
 *   "Delete" 재클릭 → handleDelete() → Firestore 삭제 → onDelete() → onClose()
 *   실패 시 → showDeleteConfirm=false (확인 UI 닫기, 에러 메시지는 미표시)
 *
 * 수정 로직 흐름:
 *   "Edit" 클릭 → /portfolio/edit/:id 로 navigate
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Portfolio } from '../../types';
import { TECH_COLORS } from '../../data/stacks';
import { useAuth } from '../../contexts/AuthContext';
import { deletePortfolio } from '../../lib/portfolioService';

interface BookPageRightProps {
  portfolio: Portfolio;
  onDelete: (id: string) => void; // 삭제 성공 후 부모(BookShelf)에서 목록 갱신
  onClose: () => void;            // 삭제 성공 후 모달 닫기
}

export function BookPageRight({ portfolio, onDelete, onClose }: BookPageRightProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  // 현재 로그인 사용자가 이 포트폴리오의 등록자인지 여부
  const isOwner = !!user && !!portfolio.uid && user.uid === portfolio.uid;

  // 삭제 확인 UI 표시 여부 (2단계 삭제 확인)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePortfolio(portfolio.id);
      onDelete(portfolio.id);
      onClose();
    } catch {
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        background: '#f9f5ee',
        fontFamily: "'EB Garamond', serif",
      }}
    >
      {/* Owner actions bar */}
      {isOwner && (
        <div
          className="shrink-0 px-5 py-2.5"
          style={{ borderBottom: '1px solid rgba(80,50,20,0.1)', background: '#f6f1e7' }}
        >
          <AnimatePresence mode="wait">
            {showDeleteConfirm ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2"
              >
                <span
                  className="flex-1"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '0.82rem',
                    color: 'rgba(80,50,20,0.6)',
                  }}
                >
                  Permanently delete this entry?
                </span>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(80,50,20,0.5)',
                    background: 'transparent',
                    border: '1px solid rgba(80,50,20,0.18)',
                    padding: '4px 11px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    color: '#fff',
                    background: isDeleting ? 'rgba(185,40,40,0.45)' : 'rgba(185,40,40,0.75)',
                    border: 'none',
                    padding: '4px 11px',
                    borderRadius: '2px',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex gap-2"
              >
                <button
                  onClick={() => navigate(`/portfolio/edit/${portfolio.id}`)}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(80,50,20,0.65)',
                    background: 'transparent',
                    border: '1px solid rgba(80,50,20,0.2)',
                    padding: '4px 13px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  ✏ Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(180,40,40,0.6)',
                    background: 'transparent',
                    border: '1px solid rgba(180,40,40,0.2)',
                    padding: '4px 13px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 px-8 pt-6 pb-4">
        {/* Profile header */}
        <div className="text-center mb-6">
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.85rem',
              color: 'rgba(80,50,20,0.38)',
              letterSpacing: '0.35em',
              marginBottom: 10,
            }}
          >
            ✦
          </div>
          <div
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: '0.76rem',
              color: 'rgba(80,50,20,0.48)',
              letterSpacing: '0.14em',
              marginBottom: 8,
            }}
          >
            {portfolio.role}
          </div>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.65rem',
              fontWeight: 700,
              color: '#2e1a08',
              letterSpacing: '0.05em',
              lineHeight: 1.22,
              marginBottom: 14,
            }}
          >
            {portfolio.name}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div
              style={{
                height: 1,
                width: 36,
                background: 'rgba(80,50,20,0.22)',
              }}
            />
            <div
              style={{
                fontSize: '0.6rem',
                color: 'rgba(80,50,20,0.36)',
              }}
            >
              ◆
            </div>
            <div
              style={{
                height: 1,
                width: 36,
                background: 'rgba(80,50,20,0.22)',
              }}
            />
          </div>
        </div>

        {/* Tagline */}
        {portfolio.tagline && (
          <blockquote
            className="text-center mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '0.95rem',
              color: 'rgba(60,30,10,0.62)',
              lineHeight: 1.72,
              margin: '0 0 20px',
            }}
          >
            &ldquo;{portfolio.tagline}&rdquo;
          </blockquote>
        )}

        {/* About section */}
        <div className="mb-5">
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.58rem',
              letterSpacing: '0.22em',
              color: 'rgba(80,50,20,0.38)',
              marginBottom: 7,
            }}
          >
            ABOUT
          </div>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'rgba(50,25,8,0.72)',
              lineHeight: 1.88,
            }}
          >
            {portfolio.description}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'rgba(80,50,20,0.1)',
            margin: '16px 0',
          }}
        />

        {/* Tech stack */}
        <div className="mb-5">
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.58rem',
              letterSpacing: '0.22em',
              color: 'rgba(80,50,20,0.38)',
              marginBottom: 9,
            }}
          >
            TECH STACK
          </div>
          <div className="flex flex-wrap gap-1.5">
            {portfolio.techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.85rem',
                  padding: '3px 11px',
                  border: `1px solid ${TECH_COLORS[tech] || '#8b4513'}38`,
                  color: TECH_COLORS[tech] ? adjustColorForLight(TECH_COLORS[tech]) : '#8b4513',
                  background: `${TECH_COLORS[tech] || '#8b4513'}14`,
                  borderRadius: '2px',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'rgba(80,50,20,0.1)',
            margin: '16px 0',
          }}
        />

        {/* Links */}
        <div className="mb-4">
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.58rem',
              letterSpacing: '0.22em',
              color: 'rgba(80,50,20,0.38)',
              marginBottom: 10,
            }}
          >
            LINKS
          </div>
          <div className="flex flex-col gap-3">
            <LinkRow
              label="GitHub"
              href={portfolio.github}
              display={formatUrl(portfolio.github)}
            />
            <LinkRow
              label="Portfolio"
              href={portfolio.liveDemo}
              display={formatUrl(portfolio.liveDemo)}
            />
          </div>
        </div>
      </div>

      {/* Page footer */}
      <div
        className="shrink-0 px-5 pb-3 pt-2 text-center"
        style={{ borderTop: '1px solid rgba(80,50,20,0.07)' }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.56rem',
            letterSpacing: '0.18em',
            color: 'rgba(80,50,20,0.22)',
          }}
        >
          — ii —
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────

function LinkRow({ label, href, display }: { label: string; href: string; display: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-baseline gap-2 group"
      style={{ textDecoration: 'none' }}
    >
      <span
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.62rem',
          letterSpacing: '0.12em',
          color: 'rgba(80,50,20,0.55)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {label} →
      </span>
      <span
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: '0.85rem',
          color: 'rgba(80,50,20,0.42)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          textDecoration: 'underline',
          textDecorationColor: 'rgba(80,50,20,0.15)',
          textUnderlineOffset: '3px',
        }}
      >
        {display}
      </span>
    </a>
  );
}

function formatUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname + (u.pathname !== '/' ? u.pathname : '');
  } catch {
    return url;
  }
}

/** Darken light tech colors so they read on the warm paper background */
function adjustColorForLight(hex: string): string {
  // Very light colors (near white) need to be darkened for the paper page
  const lightColors: Record<string, string> = {
    '#ffffff': '#4a3520',
    '#FFFFFF': '#4a3520',
  };
  return lightColors[hex] ?? hex;
}
