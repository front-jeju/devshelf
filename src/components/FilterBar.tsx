/**
 * FilterBar.tsx
 * ShelfPage 상단에 표시되는 기술 스택 필터 바입니다.
 *
 * Props:
 *   selected  — 현재 선택된 스택 (null이면 '전체' 선택 상태)
 *   onSelect  — 버튼 클릭 시 호출되는 콜백 (선택된 스택 또는 null 전달)
 *
 * 로직 흐름:
 *   "All Books" 클릭  → onSelect(null)  → 전체 표시
 *   스택 버튼 클릭    → 이미 선택된 스택이면 onSelect(null) (토글 해제),
 *                       다른 스택이면 onSelect(stack) (해당 스택 선택)
 *   → ShelfPage의 selectedStack 변경 → BookShelf에서 isFiltered 계산 → 책 흐림/선명 처리
 */
import { motion } from 'framer-motion';
import type { TechStack } from '../types';
import { ALL_STACKS, STACK_ICONS } from '../data/stacks';

interface FilterBarProps {
  selected: TechStack | null;  // 현재 선택된 스택 (null = 전체)
  onSelect: (stack: TechStack | null) => void; // 스택 선택/해제 콜백
}

export function FilterBar({ selected, onSelect }: FilterBarProps) {
  return (
    <div className="relative py-12 pb-8">
      {/* 섹션 헤더 */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-15" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
          <span style={{ color: '#d4af37', fontSize: '1rem' }}>✦</span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', letterSpacing: '0.3em', color: '#c8b08a' }}>
            SMART SHELF
          </span>
          <span style={{ color: '#d4af37', fontSize: '1rem' }}>✦</span>
          <div className="h-px w-15" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
        </div>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: 'rgba(200,176,138,0.6)', fontStyle: 'italic' }}>
          기술 스택으로 원하는 책을 찾아보세요
        </p>
      </motion.div>

      {/* 필터 버튼들 */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, staggerChildren: 0.05 }}
      >
        {/* 전체 버튼 */}
        <motion.button
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(null)}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            padding: '8px 20px',
            borderRadius: '2px',
            cursor: 'pointer',
            transition: 'all 0.25s',
            border: selected === null ? '1px solid #d4af37' : '1px solid rgba(212,175,55,0.3)',
            background: selected === null
              ? 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))'
              : 'transparent',
            color: selected === null ? '#f0c040' : '#c8b08a',
            boxShadow: selected === null
              ? '0 0 15px rgba(212,175,55,0.2), inset 0 0 10px rgba(212,175,55,0.05)'
              : 'none',
          }}
        >
          All Books
        </motion.button>

        {ALL_STACKS.map((stack) => (
          <motion.button
            key={stack}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(selected === stack ? null : stack)}
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              padding: '7px 18px',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 0.25s',
              border: selected === stack
                ? '1px solid #d4af37'
                : '1px solid rgba(212,175,55,0.2)',
              background: selected === stack
                ? 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))'
                : 'rgba(212,175,55,0.03)',
              color: selected === stack ? '#f0c040' : 'rgba(200,176,138,0.7)',
              boxShadow: selected === stack ? '0 0 12px rgba(212,175,55,0.15)' : 'none',
            }}
          >
            <span>{STACK_ICONS[stack]}</span>
            {stack}
          </motion.button>
        ))}
      </motion.div>

      {/* 하단 장식선 */}
      <div
        className="mt-10 mx-auto gold-divider"
        style={{ maxWidth: 600 }}
      />
    </div>
  );
}
