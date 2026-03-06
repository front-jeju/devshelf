import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TechStack } from '../types';
import { ROLES } from '../data/roles';
import { ALL_STACKS, STACK_ICONS } from '../data/stacks';
import { BOOK_THEMES } from '../data/bookThemes';
import type { BookTheme } from '../data/bookThemes';

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
export function MiniBook({ name, role, theme }: { name: string; role: string; theme: BookTheme }) {
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

/* ── 기본 정보 필드 (이름 / 직군 / 한 줄 소개) ── */
export function BasicInfoFields({ fields, touched, errors, onChange, onBlur }: {
  fields: { name: string; role: string; tagline: string };
  touched: { name: boolean; role: boolean; tagline: boolean };
  errors: { name: string; role: string; tagline: string };
  onChange: (key: 'name' | 'role' | 'tagline', value: string) => void;
  onBlur: (key: 'name' | 'role' | 'tagline') => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="label-field">이름 <span style={{ color: '#d4af37' }}>*</span></label>
        <input
          type="text"
          value={fields.name}
          onChange={(e) => onChange('name', e.target.value)}
          onBlur={() => onBlur('name')}
          placeholder="홍길동"
          className={`input-field ${touched.name && errors.name ? 'error' : ''}`}
        />
        <FieldError show={touched.name && !!errors.name} message={errors.name} />
      </div>

      <div>
        <label className="label-field">직군 <span style={{ color: '#d4af37' }}>*</span></label>
        <select
          value={fields.role}
          onChange={(e) => onChange('role', e.target.value)}
          onBlur={() => onBlur('role')}
          className={`input-field ${touched.role && errors.role ? 'error' : ''}`}
          style={{
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23d4af37' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
            paddingRight: 36,
            color: fields.role ? '#e8d5b0' : 'rgba(200,176,138,0.4)',
            cursor: 'pointer',
          }}
        >
          <option value="" style={{ background: '#120800', color: 'rgba(200,176,138,0.5)' }}>직군을 선택하세요</option>
          {ROLES.map((r) => (
            <option key={r} value={r} style={{ background: '#120800', color: '#e8d5b0' }}>{r}</option>
          ))}
        </select>
        <FieldError show={touched.role && !!errors.role} message={errors.role} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="label-field" style={{ marginBottom: 0 }}>한 줄 소개 <span style={{ color: '#d4af37' }}>*</span></label>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: fields.tagline.length > 60 ? '#f87171' : 'rgba(200,176,138,0.35)', fontStyle: 'italic' }}>
            {fields.tagline.length} / 60
          </span>
        </div>
        <input
          type="text"
          value={fields.tagline}
          onChange={(e) => onChange('tagline', e.target.value)}
          onBlur={() => onBlur('tagline')}
          placeholder="사용자의 경험을 코드로 완성하는 개발자"
          className={`input-field ${touched.tagline && errors.tagline ? 'error' : ''}`}
        />
        <FieldError show={touched.tagline && !!errors.tagline} message={errors.tagline} />
      </div>
    </div>
  );
}

/* ── 기술 스택 필드 ── */
export function TechStackFields({ techStack, toggleStack, showHint = false }: {
  techStack: TechStack[];
  toggleStack: (stack: TechStack) => void;
  showHint?: boolean;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {ALL_STACKS.map((stack) => {
          const selected = techStack.includes(stack);
          return (
            <motion.button
              key={stack}
              type="button"
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleStack(stack)}
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: '0.88rem',
                letterSpacing: '0.04em',
                padding: '6px 14px',
                borderRadius: 2,
                cursor: 'pointer',
                border: selected ? '1px solid #d4af37' : '1px solid rgba(212,175,55,0.2)',
                background: selected
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))'
                  : 'rgba(212,175,55,0.03)',
                color: selected ? '#f0c040' : 'rgba(200,176,138,0.6)',
                boxShadow: selected ? '0 0 10px rgba(212,175,55,0.15)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span>{STACK_ICONS[stack]}</span>
              {stack}
              {selected && <span style={{ marginLeft: 2, fontSize: '0.7rem' }}>✓</span>}
            </motion.button>
          );
        })}
      </div>
      {showHint && techStack.length === 0 && (
        <p style={{ marginTop: 10, fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(200,176,138,0.3)', fontStyle: 'italic' }}>
          사용하는 기술 스택을 선택하세요 (복수 선택 가능)
        </p>
      )}
    </>
  );
}

/* ── 링크 필드 (포트폴리오 URL + GitHub) ── */
export function LinksFields({ liveDemo, liveDemoTouched, liveDemoError, github, onLiveDemoChange, onLiveDemoBlur, onGithubChange, children }: {
  liveDemo: string;
  liveDemoTouched: boolean;
  liveDemoError: string;
  github: string;
  onLiveDemoChange: (v: string) => void;
  onLiveDemoBlur: () => void;
  onGithubChange: (v: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <label className="label-field">포트폴리오 URL <span style={{ color: '#d4af37' }}>*</span></label>
        <input
          type="url"
          value={liveDemo}
          onChange={(e) => onLiveDemoChange(e.target.value)}
          onBlur={onLiveDemoBlur}
          placeholder="https://your-portfolio.com"
          className={`input-field ${liveDemoTouched && liveDemoError ? 'error' : ''}`}
        />
        <FieldError show={liveDemoTouched && !!liveDemoError} message={liveDemoError} />
        {children}
      </div>
      <div>
        <label className="label-field">
          GitHub URL{' '}
          <span style={{ fontFamily: "'EB Garamond', serif", letterSpacing: 0, fontStyle: 'italic', color: 'rgba(200,176,138,0.4)' }}>(선택)</span>
        </label>
        <input
          type="url"
          value={github}
          onChange={(e) => onGithubChange(e.target.value)}
          placeholder="https://github.com/username"
          className="input-field"
        />
      </div>
    </div>
  );
}

/* ── 자기소개 필드 ── */
export function AboutMeField({ value, onChange }: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="나의 개발 철학, 경험, 관심사를 자유롭게 작성해주세요..."
      rows={4}
      className="input-field -mt-3"
      style={{ resize: 'vertical', minHeight: 100, lineHeight: 1.7 }}
    />
  );
}

/* ── 책 테마 선택 ── */
export function BookThemePicker({ name, role, themeIdx, selectedTheme, onThemeChange }: {
  name: string;
  role: string;
  themeIdx: number;
  selectedTheme: BookTheme;
  onThemeChange: (idx: number) => void;
}) {
  return (
    <div className="flex gap-4 items-center">
      <MiniBook name={name} role={role} theme={selectedTheme} />
      <div className="flex-1">
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.82rem', color: 'rgba(200,176,138,0.5)', fontStyle: 'italic', marginBottom: 12 }}>
          서재에 꽂힐 당신의 책 색상을 골라보세요.
        </p>
        <div className="flex flex-wrap gap-2">
          {BOOK_THEMES.map((theme, i) => (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => onThemeChange(i)}
              title={theme.label}
              className="relative flex-shrink-0"
              style={{
                width: 36,
                height: 36,
                borderRadius: 3,
                border: themeIdx === i ? `2px solid ${theme.accentColor}` : '2px solid transparent',
                background: `linear-gradient(135deg, ${theme.coverColor}, ${theme.spineColor})`,
                cursor: 'pointer',
                boxShadow: themeIdx === i ? `0 0 12px ${theme.accentColor}60` : '0 2px 8px rgba(0,0,0,0.4)',
                transition: 'box-shadow 0.2s',
              }}
            >
              {themeIdx === i && (
                <span className="absolute inset-0 flex items-center justify-center" style={{ fontSize: '0.7rem', color: theme.accentColor }}>✓</span>
              )}
            </motion.button>
          ))}
        </div>
        <p style={{ marginTop: 8, fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(200,176,138,0.4)' }}>
          {selectedTheme.label}
        </p>
      </div>
    </div>
  );
}

/* ── 폼 액션 버튼 (취소 / 제출) ── */
export function FormActionButtons({ isLoading, onCancel, loadingText, submitText }: {
  isLoading: boolean;
  onCancel: () => void;
  loadingText: string;
  submitText: string;
}) {
  return (
    <div className="flex gap-2.5 mt-1">
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCancel}
        className="btn-ghost flex-shrink-0"
        style={{ padding: '13px 20px', fontSize: '0.78rem', letterSpacing: '0.1em' }}
      >
        ← 취소
      </motion.button>
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="btn-gold flex-1"
      >
        {isLoading ? loadingText : submitText}
      </motion.button>
    </div>
  );
}

/* ── 완료 화면 ── */
export function DoneScreen({ name, role, theme, subtitle, title, description, onNavigate }: {
  name: string;
  role: string;
  theme: BookTheme;
  subtitle: string;
  title: string;
  description: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <motion.div
      className="relative z-[2] text-center max-w-[420px]"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="flex justify-center mb-8"
        initial={{ rotateY: 90 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <MiniBook name={name} role={role} theme={theme} />
      </motion.div>
      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(200,176,138,0.5)', letterSpacing: '0.2em', fontStyle: 'italic', marginBottom: 10 }}>
        {subtitle}
      </div>
      <h2
        className="gold-gradient-text mb-3"
        style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 700 }}
      >
        {title}
      </h2>
      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: 'rgba(200,176,138,0.7)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 32 }}>
        {description}
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNavigate}
        className="btn-gold"
      >
        서재 둘러보기 →
      </motion.button>
    </motion.div>
  );
}
