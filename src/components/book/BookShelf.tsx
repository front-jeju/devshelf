/**
 * BookShelf.tsx
 * 포트폴리오 목록을 책장 형태로 표시하는 메인 컴포넌트입니다.
 *
 * 구성:
 *   BookShelf  — 전체 책장 프레임 + 책 클릭 상태 관리
 *   ShelfRow   — 책장의 한 행 (최대 BOOKS_PER_ROW개 책 + 장식용 빈 책)
 *   DecorBook  — 양 끝에 배치되는 장식용 빈 책
 *
 * 책 클릭 상태 머신 (BookPhase):
 *   null → 'cover' (BookCover 오버레이 표시)
 *   'cover' → 'open' (OpenBook 오버레이로 전환)
 *   'open' → null (닫기)
 *
 * 로직 흐름:
 *   책 클릭 → handleSelect → selection = { portfolio, phase: 'cover' }
 *   BookCover에서 "OPEN" 클릭 → handleOpen → phase = 'open'
 *   OpenBook에서 ESC/닫기 → handleClose → selection = null
 */
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookCard } from './BookCard';
import { BookCover } from './BookCover';
import { OpenBook } from './OpenBook';
import type { Portfolio, TechStack, DevStatus, ProjectType } from '../../types';

/** 책 상세 보기의 단계: 'cover' = 표지 오버레이, 'open' = 펼쳐진 책 모달 */
type BookPhase = 'cover' | 'open';
/** 현재 선택된 책과 단계를 함께 저장하는 상태 타입 */
interface BookSelection {
  portfolio: Portfolio;
  phase: BookPhase;
}

interface BookShelfProps {
  portfolios: Portfolio[];
  selectedStack: TechStack | null;
  selectedStatus: DevStatus | null;
  selectedProject: ProjectType | null;
  onDelete: (id: string) => void;
}

function ShelfRow({ portfolios, selectedStack, selectedStatus, selectedProject, rowIndex, onSelect }: {
  portfolios: Portfolio[];
  selectedStack: TechStack | null;
  selectedStatus: DevStatus | null;
  selectedProject: ProjectType | null;
  rowIndex: number;
  onSelect: (portfolio: Portfolio) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: rowIndex * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* 책 진열 영역 */}
      <div
        className="flex items-end gap-1.5 relative"
        style={{ padding: '20px 32px 0', minHeight: 230 }}
      >
        {/* 장식용 빈 책 (왼쪽) */}
        <DecorBook color="#2d1505" width={18} height={170} />
        <DecorBook color="#1a0e02" width={24} height={150} />

        {/* 실제 포트폴리오 책들 */}
        {portfolios.map((portfolio) => {
          const isFiltered =
            (selectedStack !== null && !portfolio.techStack.includes(selectedStack)) ||
            (selectedStatus !== null && portfolio.status !== selectedStatus) ||
            (selectedProject !== null && !portfolio.projectTypes?.includes(selectedProject));
          return (
            <BookCard
              key={portfolio.id}
              portfolio={portfolio}
              isFiltered={isFiltered}
              onSelect={onSelect}
            />
          );
        })}

        {/* 장식용 빈 책 (오른쪽) */}
        <DecorBook color="#1e0d04" width={20} height={185} />
        <DecorBook color="#2a1106" width={28} height={160} />
        <DecorBook color="#150902" width={16} height={175} />

        {/* 책 아래 그림자 */}
        <div
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: 32,
            right: 32,
            height: 8,
            background: 'rgba(0,0,0,0.4)',
            filter: 'blur(4px)',
            borderRadius: '0 0 4px 4px',
          }}
        />
      </div>

      {/* 책장 판자 */}
      <div
        className="relative"
        style={{
          height: 20,
          background: 'linear-gradient(180deg, #8b4513 0%, #6b3010 40%, #5c2a0e 70%, #4a1f0a 100%)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200,120,40,0.4), inset 0 -1px 0 rgba(0,0,0,0.4)',
        }}
      >
        {/* 판자 나무결 텍스처 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.05) 40px, rgba(0,0,0,0.05) 42px)' }}
        />
        {/* 판자 하단 그림자 */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{ bottom: -12, height: 12, background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)' }}
        />
      </div>
    </motion.div>
  );
}

function DecorBook({ color, width, height }: { color: string; width: number; height: number }) {
  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{
        width,
        height,
        background: `linear-gradient(180deg, ${color}dd 0%, ${color} 50%, ${color}aa 100%)`,
        borderRadius: '1px 3px 3px 1px',
        boxShadow: '2px 3px 8px rgba(0,0,0,0.5), inset -2px 0 4px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'rgba(0,0,0,0.35)' }} />
    </div>
  );
}

const BOOKS_PER_ROW = 6;

export function BookShelf({ portfolios, selectedStack, selectedStatus, selectedProject, onDelete }: BookShelfProps) {
  const [selection, setSelection] = useState<BookSelection | null>(null);

  const handleSelect = useCallback((portfolio: Portfolio) => {
    setSelection({ portfolio, phase: 'cover' });
  }, []);

  const handleOpen = useCallback(() => {
    setSelection((prev) => prev ? { ...prev, phase: 'open' } : null);
  }, []);

  const handleClose = useCallback(() => {
    setSelection(null);
  }, []);

  const rows = useMemo(() => {
    const result: Portfolio[][] = [];
    for (let i = 0; i < portfolios.length; i += BOOKS_PER_ROW) {
      result.push(portfolios.slice(i, i + BOOKS_PER_ROW));
    }
    if (result.length === 0) result.push([]);
    return result;
  }, [portfolios]);

  return (
    <section id="bookshelf" className="relative pb-16">
      {/* 섹션 제목 */}
      <motion.div
        className="text-center pb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div style={{ height: 1, flex: 1, maxWidth: 120, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '0.2em',
              background: 'linear-gradient(135deg, #f0c040, #d4af37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Digital Bookshelf
          </h2>
          <div style={{ height: 1, flex: 1, maxWidth: 120, background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
        </div>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: 'rgba(200,176,138,0.6)', fontStyle: 'italic' }}>
          {portfolios.length}권의 이야기가 당신을 기다리고 있습니다 · 책에 마우스를 올려보세요
        </p>
      </motion.div>

      {/* 책장 프레임 */}
      <div
        className="max-w-[900px] mx-auto relative overflow-hidden rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #1a0d00 0%, #120800 100%)',
          border: '2px solid #3d1a06',
          boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* 책장 상단 몰딩 */}
        <div
          style={{
            height: 24,
            background: 'linear-gradient(180deg, #8b4513 0%, #6b3010 50%, #4a1f0a 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(200,120,40,0.4)',
          }}
        />

        {/* 책장 내부 좌우 기둥 */}
        <div className="relative">
          {/* 왼쪽 기둥 */}
          <div
            className="absolute left-0 top-0 bottom-0 z-[5]"
            style={{ width: 20, background: 'linear-gradient(90deg, #4a1f0a, #3d1a06)', boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3)' }}
          />
          {/* 오른쪽 기둥 */}
          <div
            className="absolute right-0 top-0 bottom-0 z-[5]"
            style={{ width: 20, background: 'linear-gradient(270deg, #4a1f0a, #3d1a06)', boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.3)' }}
          />

          {/* 행들 */}
          {rows.map((rowPortfolios, idx) => (
            <ShelfRow
              key={idx}
              portfolios={rowPortfolios}
              selectedStack={selectedStack}
              selectedStatus={selectedStatus}
              selectedProject={selectedProject}
              rowIndex={idx}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* 책장 하단 몰딩 */}
        <div
          style={{
            height: 20,
            background: 'linear-gradient(180deg, #4a1f0a 0%, #3d1a06 50%, #2a1104 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
          }}
        />
      </div>

      {/* 바닥 장식 */}
      <motion.div
        className="max-w-[900px] mx-auto text-center pt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="inline-flex items-center gap-3"
          style={{ fontFamily: "'Cinzel', serif", fontSize: '0.72rem', letterSpacing: '0.2em', color: 'rgba(200,176,138,0.4)' }}
        >
          <span>✦</span>
          <span>책을 클릭하면 포트폴리오 상세 정보를 볼 수 있습니다</span>
          <span>✦</span>
        </div>
      </motion.div>

      {/* Book interaction overlay (COVER → OPEN) */}
      <AnimatePresence>
        {selection?.phase === 'cover' && (
          <BookCover
            key="cover"
            portfolio={selection.portfolio}
            onOpen={handleOpen}
            onClose={handleClose}
          />
        )}
        {selection?.phase === 'open' && (
          <OpenBook
            key="open"
            portfolio={selection.portfolio}
            onDelete={onDelete}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
