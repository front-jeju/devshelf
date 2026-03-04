/**
 * EditPortfolioPage.tsx
 * 포트폴리오 수정 페이지입니다.
 * URL: /portfolio/edit/:id (예: /portfolio/edit/abc123)
 *
 * CreatePortfolioPage와 UI가 거의 동일하지만,
 * - 폼이 기존 데이터로 미리 채워집니다
 * - 제출 시 Firestore 문서를 수정합니다
 */

import type { CSSProperties, ReactNode } from 'react';
import { useParams } from 'react-router-dom'; // URL에서 :id 파라미터를 읽는 훅
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles } from '../components/FloatingParticles';
import { ALL_STACKS, STACK_ICONS } from '../data/stacks';
import { useEditPortfolioForm, BOOK_THEMES } from '../hooks/useEditPortfolioForm';

/* ── 직군 선택 목록 ── */
const ROLES = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full-Stack Developer',
  'UI/UX & Frontend',
  'Mobile Developer',
  'DevOps Engineer',
  'Data Engineer',
  'ML / AI Engineer',
];

/* ── 공통 스타일 상수 ── */
const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: "'Cinzel', serif",
  fontSize: '0.68rem',
  letterSpacing: '0.18em',
  color: 'rgba(200,176,138,0.7)',
  marginBottom: 8,
};

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: 3,
  padding: '11px 14px',
  fontFamily: "'EB Garamond', serif",
  fontSize: '1rem',
  color: '#e8d5b0',
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
  boxSizing: 'border-box' as const,
};

/* ── 섹션 구분 제목 컴포넌트 ── */
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25))' }} />
      <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.22em', color: 'rgba(212,175,55,0.7)' }}>
        {children}
      </span>
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(212,175,55,0.25), transparent)' }} />
    </div>
  );
}

/* ── 필드 에러 메시지 컴포넌트 (애니메이션 포함) ── */
function FieldError({ show, message }: { show: boolean; message: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          style={{ overflow: 'hidden' }}
        >
          <p style={{ marginTop: 6, fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: '#f87171', fontStyle: 'italic' }}>
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── 미니 책 미리보기 (테마 선택 시 실시간 반영) ── */
function MiniBook({ name, role, theme }: { name: string; role: string; theme: typeof BOOK_THEMES[0] }) {
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

/* ── 메인 컴포넌트 ── */
export function EditPortfolioPage() {
  // URL에서 ":id" 부분을 꺼냅니다 (예: /portfolio/edit/abc123 → id = "abc123")
  const { id } = useParams<{ id: string }>();

  // 수정 폼 훅 — 기존 데이터 불러오기, 수정 제출 등 모든 로직이 여기에 있습니다
  const {
    form,
    touched,
    errors,
    isLoading,
    isFetching,  // 기존 데이터를 Firestore에서 불러오는 중
    done,
    submitError,
    notFound,    // 해당 포트폴리오 ID가 없는 경우
    selectedTheme,
    setField,
    touch,
    toggleStack,
    handleSubmit,
    navigate,
  } = useEditPortfolioForm(id ?? '');

  /* ── 데이터 불러오는 중 화면 ── */
  if (isFetching) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0500 0%, #0f0700 30%, #120800 60%, #0a0500 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'EB Garamond', serif", color: 'rgba(200,176,138,0.5)', fontStyle: 'italic', fontSize: '1rem', letterSpacing: '0.1em' }}>
          서재 정보를 불러오는 중...
        </div>
      </div>
    );
  }

  /* ── 해당 포트폴리오가 없는 경우 화면 ── */
  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0500 0%, #0f0700 30%, #120800 60%, #0a0500 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', color: 'rgba(200,176,138,0.6)', letterSpacing: '0.1em' }}>
          해당 서재를 찾을 수 없습니다.
        </p>
        <button
          onClick={() => navigate('/shelf')}
          style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', color: '#d4af37', background: 'transparent', border: '1px solid rgba(212,175,55,0.4)', padding: '10px 24px', borderRadius: 2, cursor: 'pointer', letterSpacing: '0.1em' }}
        >
          ← 서재로 돌아가기
        </button>
      </div>
    );
  }

  /* ── 수정 완료 화면 ── */
  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0500 0%, #0f0700 30%, #120800 60%, #0a0500 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 420 }}
        >
          <motion.div
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}
          >
            <MiniBook name={form.name} role={form.role} theme={selectedTheme} />
          </motion.div>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(200,176,138,0.5)', letterSpacing: '0.2em', fontStyle: 'italic', marginBottom: 10 }}>
            — 서재가 새롭게 정돈되었습니다 —
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #f0c040, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 12 }}>
            수정 완료
          </h2>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: 'rgba(200,176,138,0.7)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 32 }}>
            "{form.name}"의 서재가 아름답게 수정되었습니다.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/shelf')}
            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #d4af37, #f0c040, #d4af37)', border: 'none', borderRadius: 3, fontFamily: "'Cinzel', serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', color: '#1a0d00', cursor: 'pointer' }}
          >
            서재 둘러보기 →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ── 수정 폼 화면 ── */
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0500 0%, #0f0700 30%, #120800 60%, #0a0500 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 0 60px',
      }}
    >
      <FloatingParticles />

      {/* 배경 장식 */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `radial-gradient(circle at 15% 25%, rgba(139,69,19,0.04) 0%, transparent 50%), radial-gradient(circle at 85% 75%, rgba(100,40,10,0.05) 0%, transparent 50%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #d4af37, #f0c040, #d4af37, transparent)', zIndex: 10 }} />

      {/* 로고 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 2, marginBottom: 36, textAlign: 'center' }}
      >
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.6))' }}>📚</div>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.12em', background: 'linear-gradient(135deg, #f0c040, #d4af37, #c9a84c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                The Developer's Library
              </div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.7rem', color: '#c8b08a', letterSpacing: '0.15em', fontStyle: 'italic' }}>
                개발자의 서재
              </div>
            </div>
          </div>
        </button>
      </motion.div>

      {/* 메인 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 600, padding: '0 24px' }}
      >
        <div style={{ background: 'linear-gradient(135deg, #1e0f00 0%, #120800 60%, #0a0500 100%)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.05)' }}>
          <div style={{ height: 3, background: 'linear-gradient(90deg, #d4af37, #f0c040, #d4af37)' }} />

          <div style={{ padding: '36px 32px' }}>

            {/* 타이틀 */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: 'rgba(200,176,138,0.5)', letterSpacing: '0.25em', fontStyle: 'italic', marginBottom: 8 }}>
                — 나의 이야기를 다듬다 —
              </div>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.08em', background: 'linear-gradient(135deg, #f0c040, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                서재 수정
              </h1>
            </div>

            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)', marginBottom: 28 }} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* ── 1. 기본 정보 ── */}
              <div>
                <SectionTitle>BASIC INFO</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* 이름 */}
                  <div>
                    <label style={labelStyle}>이름 <span style={{ color: '#d4af37' }}>*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      onBlur={() => touch('name')}
                      placeholder="홍길동"
                      style={{ ...inputStyle, borderColor: touched.name && errors.name ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)' }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(212,175,55,0.05)'; }}
                      onBlurCapture={(e) => { e.target.style.borderColor = touched.name && errors.name ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                    />
                    <FieldError show={touched.name && !!errors.name} message={errors.name} />
                  </div>

                  {/* 직군 */}
                  <div>
                    <label style={labelStyle}>직군 <span style={{ color: '#d4af37' }}>*</span></label>
                    <select
                      value={form.role}
                      onChange={(e) => setField('role', e.target.value)}
                      onBlur={() => touch('role')}
                      style={{
                        ...inputStyle,
                        appearance: 'none' as const,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23d4af37' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 14px center',
                        paddingRight: 36,
                        color: form.role ? '#e8d5b0' : 'rgba(200,176,138,0.4)',
                        borderColor: touched.role && errors.role ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)',
                        cursor: 'pointer',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(212,175,55,0.05)'; }}
                      onBlurCapture={(e) => { e.target.style.borderColor = touched.role && errors.role ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                    >
                      <option value="" style={{ background: '#120800', color: 'rgba(200,176,138,0.5)' }}>직군을 선택하세요</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r} style={{ background: '#120800', color: '#e8d5b0' }}>{r}</option>
                      ))}
                    </select>
                    <FieldError show={touched.role && !!errors.role} message={errors.role} />
                  </div>

                  {/* 한 줄 소개 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>한 줄 소개 <span style={{ color: '#d4af37' }}>*</span></label>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: form.tagline.length > 60 ? '#f87171' : 'rgba(200,176,138,0.35)', fontStyle: 'italic' }}>
                        {form.tagline.length} / 60
                      </span>
                    </div>
                    <input
                      type="text"
                      value={form.tagline}
                      onChange={(e) => setField('tagline', e.target.value)}
                      onBlur={() => touch('tagline')}
                      placeholder="사용자의 경험을 코드로 완성하는 개발자"
                      style={{ ...inputStyle, borderColor: touched.tagline && errors.tagline ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)' }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(212,175,55,0.05)'; }}
                      onBlurCapture={(e) => { e.target.style.borderColor = touched.tagline && errors.tagline ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                    />
                    <FieldError show={touched.tagline && !!errors.tagline} message={errors.tagline} />
                  </div>
                </div>
              </div>

              {/* ── 2. 기술 스택 ── */}
              <div>
                <SectionTitle>TECH STACK</SectionTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ALL_STACKS.map((stack) => {
                    const selected = form.techStack.includes(stack);
                    return (
                      <motion.button
                        key={stack}
                        type="button"
                        whileHover={{ y: -2, scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleStack(stack)}
                        style={{
                          fontFamily: "'EB Garamond', serif",
                          fontSize: '0.88rem',
                          letterSpacing: '0.04em',
                          padding: '6px 14px',
                          borderRadius: 2,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
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
              </div>

              {/* ── 3. 링크 ── */}
              <div>
                <SectionTitle>LINKS</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>포트폴리오 URL <span style={{ color: '#d4af37' }}>*</span></label>
                    <input
                      type="url"
                      value={form.liveDemo}
                      onChange={(e) => setField('liveDemo', e.target.value)}
                      onBlur={() => touch('liveDemo')}
                      placeholder="https://your-portfolio.com"
                      style={{ ...inputStyle, borderColor: touched.liveDemo && errors.liveDemo ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)' }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(212,175,55,0.05)'; }}
                      onBlurCapture={(e) => { e.target.style.borderColor = touched.liveDemo && errors.liveDemo ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                    />
                    <FieldError show={touched.liveDemo && !!errors.liveDemo} message={errors.liveDemo} />
                  </div>
                  <div>
                    <label style={labelStyle}>GitHub URL <span style={{ fontFamily: "'EB Garamond', serif", letterSpacing: 0, fontStyle: 'italic', color: 'rgba(200,176,138,0.4)' }}>(선택)</span></label>
                    <input
                      type="url"
                      value={form.github}
                      onChange={(e) => setField('github', e.target.value)}
                      placeholder="https://github.com/username"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(212,175,55,0.05)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                    />
                  </div>
                </div>
              </div>

              {/* ── 4. 자기소개 ── */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <SectionTitle>ABOUT ME</SectionTitle>
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="나의 개발 철학, 경험, 관심사를 자유롭게 작성해주세요..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 100, lineHeight: 1.7, marginTop: -12 }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(212,175,55,0.05)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
              </div>

              {/* ── 5. 책 테마 ── */}
              <div>
                <SectionTitle>BOOK THEME</SectionTitle>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {/* 선택한 테마가 실시간으로 미리보기에 반영됩니다 */}
                  <MiniBook name={form.name} role={form.role} theme={selectedTheme} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.82rem', color: 'rgba(200,176,138,0.5)', fontStyle: 'italic', marginBottom: 12 }}>
                      서재에 꽂힐 당신의 책 색상을 골라보세요.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {BOOK_THEMES.map((theme, i) => (
                        <motion.button
                          key={i}
                          type="button"
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => setField('themeIdx', i)}
                          title={theme.label}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 3,
                            border: form.themeIdx === i ? `2px solid ${theme.accentColor}` : '2px solid transparent',
                            background: `linear-gradient(135deg, ${theme.coverColor}, ${theme.spineColor})`,
                            cursor: 'pointer',
                            boxShadow: form.themeIdx === i ? `0 0 12px ${theme.accentColor}60` : '0 2px 8px rgba(0,0,0,0.4)',
                            position: 'relative',
                            transition: 'box-shadow 0.2s',
                            flexShrink: 0,
                          }}
                        >
                          {form.themeIdx === i && (
                            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: theme.accentColor }}>✓</span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    <p style={{ marginTop: 8, fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(200,176,138,0.4)' }}>
                      {selectedTheme.label}
                    </p>
                  </div>
                </div>
              </div>

              {/* 에러 메시지 */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.88rem', color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 3, padding: '10px 14px', textAlign: 'center' }}
                >
                  {submitError}
                </motion.div>
              )}

              {/* ── 버튼 영역 ── */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {/* 취소 버튼: 이전 페이지(모달이 있던 서재)로 돌아갑니다 */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(-1)}
                  style={{
                    flex: '0 0 auto',
                    padding: '13px 20px',
                    background: 'transparent',
                    border: '1px solid rgba(212,175,55,0.25)',
                    borderRadius: 3,
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(200,176,138,0.6)',
                    cursor: 'pointer',
                  }}
                >
                  ← 취소
                </motion.button>
                {/* 수정 완료 버튼 */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  style={{
                    flex: 1,
                    padding: '13px',
                    background: isLoading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #d4af37, #f0c040, #d4af37)',
                    border: 'none',
                    borderRadius: 3,
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: isLoading ? 'rgba(26,13,0,0.5)' : '#1a0d00',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {isLoading ? '수정하는 중...' : '수정 완료 →'}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
