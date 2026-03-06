import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── 섹션 구분 제목 컴포넌트 ── */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="section-header">
      <div className="section-header-line-l" />
      <span className="section-header-text">{children}</span>
      <div className="section-header-line-r" />
    </div>
  );
}

/* ── 필드 에러 메시지 컴포넌트 ── */
export function FieldError({ show, message }: { show: boolean; message: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden"
        >
          <p className="field-error">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── 미니 책 미리보기 ── */
export function MiniBook({ name, role, theme }: { name: string; role: string; theme: { coverColor: string; spineColor: string; accentColor: string; label: string } }) {
  return (
    <div
      style={{
        width: 52,
        height: 130,
        borderRadius: '2px 4px 4px 2px',
        background: `linear-gradient(180deg, ${theme.coverColor}ee 0%, ${theme.spineColor} 35%, ${theme.spineColor}dd 65%, ${theme.coverColor}cc 100%)`,
        boxShadow: `3px 5px 16px rgba(0,0,0,0.7), -1px 0 4px rgba(0,0,0,0.3), 0 0 12px ${theme.accentColor}30`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 5px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: 'rgba(0,0,0,0.35)' }} />
      <div style={{ width: '70%', height: 1, background: `linear-gradient(90deg, transparent, ${theme.accentColor}70, transparent)` }} />
      <div style={{
        writingMode: 'vertical-lr',
        fontFamily: "'Cinzel', serif",
        fontSize: '0.58rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: theme.accentColor,
        textShadow: `0 0 8px ${theme.accentColor}50`,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 76,
        overflow: 'hidden',
      }}>
        {name || '이름'}
      </div>
      <div style={{
        writingMode: 'vertical-lr',
        fontFamily: "'EB Garamond', serif",
        fontSize: '0.48rem',
        color: `${theme.accentColor}80`,
        marginTop: 2,
      }}>
        {role.split(' ')[0] || 'Role'}
      </div>
      <div style={{ width: '70%', height: 1, background: `linear-gradient(90deg, transparent, ${theme.accentColor}70, transparent)` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)', pointerEvents: 'none' }} />
    </div>
  );
}
