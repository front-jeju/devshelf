/**
 * FilterBar.tsx
 * ShelfPage 상단에 표시되는 필터 바입니다.
 *
 * 필터 그룹:
 *   기술 스택 — TechStack (React, TypeScript, ...)
 *   상태      — DevStatus (취준, 재직, 학생, 이직준비)
 *   프로젝트  — ProjectType (토이, 팀, 사이드, 오픈소스)
 *
 * 각 필터는 독립적으로 동작하며, 모두 AND 조건으로 결합됩니다.
 */
import { motion } from 'framer-motion';
import type { TechStack, DevStatus, ProjectType } from '../types';
import { ALL_STACKS, STACK_ICONS } from '../data/stacks';

const ALL_STATUSES: DevStatus[] = ['취준', '재직', '학생', '이직준비'];
const STATUS_ICONS: Record<DevStatus, string> = {
  취준: '🔍',
  재직: '💼',
  학생: '🎓',
  이직준비: '🚀',
};

const ALL_PROJECT_TYPES: ProjectType[] = ['토이', '팀', '사이드', '오픈소스'];
const PROJECT_ICONS: Record<ProjectType, string> = {
  토이: '🧸',
  팀: '👥',
  사이드: '⚡',
  오픈소스: '🌐',
};

interface FilterBarProps {
  selected: TechStack | null;
  onSelect: (stack: TechStack | null) => void;
  selectedStatus: DevStatus | null;
  onSelectStatus: (status: DevStatus | null) => void;
  selectedProject: ProjectType | null;
  onSelectProject: (project: ProjectType | null) => void;
}

/** 필터 버튼 공통 스타일 계산 */
function chipStyle(active: boolean) {
  return {
    fontFamily: "'EB Garamond', serif",
    fontSize: '0.88rem',
    letterSpacing: '0.05em',
    padding: '6px 16px',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'all 0.25s',
    border: active ? '1px solid #d4af37' : '1px solid rgba(212,175,55,0.2)',
    background: active
      ? 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))'
      : 'rgba(212,175,55,0.03)',
    color: active ? '#f0c040' : 'rgba(200,176,138,0.7)',
    boxShadow: active ? '0 0 12px rgba(212,175,55,0.15)' : 'none',
  } as const;
}

/** 그룹 레이블 */
function GroupLabel({ children }: { children: string }) {
  return (
    <span
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.68rem',
        letterSpacing: '0.2em',
        color: 'rgba(200,176,138,0.45)',
        alignSelf: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export function FilterBar({
  selected,
  onSelect,
  selectedStatus,
  onSelectStatus,
  selectedProject,
  onSelectProject,
}: FilterBarProps) {
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

      <div className="flex flex-col gap-4 px-6 max-w-[900px] mx-auto">
        {/* ── 기술 스택 필터 ── */}
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <GroupLabel>STACK</GroupLabel>

          <motion.button
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(null)}
            style={{
              ...chipStyle(selected === null),
              fontFamily: "'Cinzel', serif",
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              padding: '7px 18px',
            }}
          >
            All
          </motion.button>

          {ALL_STACKS.map((stack) => (
            <motion.button
              key={stack}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(selected === stack ? null : stack)}
              className="flex items-center gap-1.5"
              style={chipStyle(selected === stack)}
            >
              <span>{STACK_ICONS[stack]}</span>
              {stack}
            </motion.button>
          ))}
        </motion.div>

        {/* 구분선 */}
        <div style={{ height: 1, background: 'rgba(212,175,55,0.1)' }} />

        {/* ── 상태 필터 ── */}
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <GroupLabel>상태</GroupLabel>

          <motion.button
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectStatus(null)}
            style={{
              ...chipStyle(selectedStatus === null),
              fontFamily: "'Cinzel', serif",
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              padding: '7px 18px',
            }}
          >
            All
          </motion.button>

          {ALL_STATUSES.map((status) => (
            <motion.button
              key={status}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectStatus(selectedStatus === status ? null : status)}
              className="flex items-center gap-1.5"
              style={chipStyle(selectedStatus === status)}
            >
              <span>{STATUS_ICONS[status]}</span>
              {status}
            </motion.button>
          ))}
        </motion.div>

        {/* 구분선 */}
        <div style={{ height: 1, background: 'rgba(212,175,55,0.1)' }} />

        {/* ── 프로젝트 필터 ── */}
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          <GroupLabel>프로젝트</GroupLabel>

          <motion.button
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectProject(null)}
            style={{
              ...chipStyle(selectedProject === null),
              fontFamily: "'Cinzel', serif",
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              padding: '7px 18px',
            }}
          >
            All
          </motion.button>

          {ALL_PROJECT_TYPES.map((type) => (
            <motion.button
              key={type}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectProject(selectedProject === type ? null : type)}
              className="flex items-center gap-1.5"
              style={chipStyle(selectedProject === type)}
            >
              <span>{PROJECT_ICONS[type]}</span>
              {type}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* 하단 장식선 */}
      <div
        className="mt-10 mx-auto gold-divider"
        style={{ maxWidth: 600 }}
      />
    </div>
  );
}
