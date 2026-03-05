import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles } from '../components/FloatingParticles';
import { ALL_STACKS, STACK_ICONS } from '../data/stacks';
import { usePortfolioForm, BOOK_THEMES } from '../hooks/usePortfolioForm';

/* ── 상수 ── */
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

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="section-header">
      <div className="section-header-line-l" />
      <span className="section-header-text">{children}</span>
      <div className="section-header-line-r" />
    </div>
  );
}

function FieldError({ show, message }: { show: boolean; message: string }) {
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

/* ── 미니 책 등 미리보기 ── */
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
export function CreatePortfolioPage() {
  const {
    form,
    touched,
    errors,
    isLoading,
    done,
    submitError,
    showPreview, setShowPreview,
    iframeLoading, setIframeLoading,
    selectedTheme,
    setField,
    touch,
    toggleStack,
    handleSubmit,
    navigate,
  } = usePortfolioForm();

  /* 완료 화면 */
  if (done) {
    return (
      <div className="page-bg-flex px-6">
        <FloatingParticles />
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
            <MiniBook name={form.name} role={form.role} theme={selectedTheme} />
          </motion.div>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(200,176,138,0.5)', letterSpacing: '0.2em', fontStyle: 'italic', marginBottom: 10 }}>
            — 서재에 새 책이 꽂혔습니다 —
          </div>
          <h2
            className="gold-gradient-text mb-3"
            style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 700 }}
          >
            등록 완료
          </h2>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: 'rgba(200,176,138,0.7)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 32 }}>
            "{form.name}"의 서재가 개발자의 도서관에<br />아름답게 자리를 잡았습니다.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/shelf')}
            className="btn-gold"
          >
            서재 둘러보기 →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-bg-flex py-16">
      <FloatingParticles />
      <div className="page-overlay" />
      <div className="gold-top-line" />

      {/* 로고 */}
      <motion.div
        className="relative z-[2] mb-9 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/">
          <div className="flex items-center gap-3 justify-center">
            <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.6))' }}>📚</div>
            <div>
              <div className="logo-title">The Developer's Library</div>
              <div className="logo-subtitle">개발자의 서재</div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 메인 카드 */}
      <motion.div
        className="relative z-[2] w-full max-w-[600px] px-6"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="card-dark">
          <div className="card-top-bar" />

          <div className="p-9 px-8">
            {/* 타이틀 */}
            <div className="text-center mb-7">
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: 'rgba(200,176,138,0.5)', letterSpacing: '0.25em', fontStyle: 'italic', marginBottom: 8 }}>
                — 나의 이야기를 서재에 —
              </div>
              <h1
                className="gold-gradient-text"
                style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.08em' }}
              >
                서재 등록
              </h1>
            </div>

            <div className="gold-divider mb-7" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* ── 1. 기본 정보 ── */}
              <div>
                <SectionTitle>BASIC INFO</SectionTitle>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="label-field">이름 <span style={{ color: '#d4af37' }}>*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      onBlur={() => touch('name')}
                      placeholder="홍길동"
                      className={`input-field ${touched.name && errors.name ? 'error' : ''}`}
                    />
                    <FieldError show={touched.name && !!errors.name} message={errors.name} />
                  </div>

                  <div>
                    <label className="label-field">직군 <span style={{ color: '#d4af37' }}>*</span></label>
                    <select
                      value={form.role}
                      onChange={(e) => setField('role', e.target.value)}
                      onBlur={() => touch('role')}
                      className={`input-field ${touched.role && errors.role ? 'error' : ''}`}
                      style={{
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23d4af37' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 14px center',
                        paddingRight: 36,
                        color: form.role ? '#e8d5b0' : 'rgba(200,176,138,0.4)',
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
                      className={`input-field ${touched.tagline && errors.tagline ? 'error' : ''}`}
                    />
                    <FieldError show={touched.tagline && !!errors.tagline} message={errors.tagline} />
                  </div>
                </div>
              </div>

              {/* ── 2. 기술 스택 ── */}
              <div>
                <SectionTitle>TECH STACK</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {ALL_STACKS.map((stack) => {
                    const selected = form.techStack.includes(stack);
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
                {form.techStack.length === 0 && (
                  <p style={{ marginTop: 10, fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(200,176,138,0.3)', fontStyle: 'italic' }}>
                    사용하는 기술 스택을 선택하세요 (복수 선택 가능)
                  </p>
                )}
              </div>

              {/* ── 3. 링크 ── */}
              <div>
                <SectionTitle>LINKS</SectionTitle>
                <div className="flex flex-col gap-3.5">
                  <div>
                    <label className="label-field">포트폴리오 URL <span style={{ color: '#d4af37' }}>*</span></label>
                    <input
                      type="url"
                      value={form.liveDemo}
                      onChange={(e) => {
                        setField('liveDemo', e.target.value);
                        setShowPreview(false);
                      }}
                      onBlur={() => touch('liveDemo')}
                      placeholder="https://your-portfolio.com"
                      className={`input-field ${touched.liveDemo && errors.liveDemo ? 'error' : ''}`}
                    />
                    <FieldError show={touched.liveDemo && !!errors.liveDemo} message={errors.liveDemo} />

                    {/* 미리보기 토글 버튼 */}
                    {form.liveDemo && /^https?:\/\/.+/.test(form.liveDemo) && !errors.liveDemo && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const opening = !showPreview;
                          if (opening) setIframeLoading(true);
                          setShowPreview(opening);
                        }}
                        className="mt-2 flex items-center gap-1.5"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: '0.65rem',
                          letterSpacing: '0.12em',
                          color: showPreview ? '#f0c040' : 'rgba(200,176,138,0.6)',
                          background: 'transparent',
                          border: `1px solid ${showPreview ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.15)'}`,
                          borderRadius: 2,
                          padding: '5px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span style={{ fontSize: '0.7rem' }}>{showPreview ? '▲' : '▼'}</span>
                        {showPreview ? 'PREVIEW CLOSE' : 'PREVIEW'}
                      </motion.button>
                    )}

                    {/* iframe 미리보기 */}
                    <AnimatePresence>
                      {showPreview && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden mt-2.5"
                        >
                          <div
                            className="relative overflow-hidden rounded"
                            style={{ border: '1px solid rgba(212,175,55,0.2)', background: '#0a0500' }}
                          >
                            {/* 브라우저 크롬 바 */}
                            <div
                              className="flex items-center gap-2"
                              style={{ padding: '7px 12px', background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}
                            >
                              <div className="flex gap-1.5">
                                {['#f87171', '#fb923c', '#34d399'].map((c) => (
                                  <div key={c} className="w-2 h-2 rounded-full opacity-60" style={{ background: c }} />
                                ))}
                              </div>
                              <div
                                className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                                style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.72rem', color: 'rgba(200,176,138,0.4)', fontStyle: 'italic' }}
                              >
                                {form.liveDemo}
                              </div>
                              <a
                                href={form.liveDemo}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.08em', color: 'rgba(212,175,55,0.5)', flexShrink: 0 }}
                              >
                                ↗ 열기
                              </a>
                            </div>

                            {/* 로딩 오버레이 */}
                            {iframeLoading && (
                              <div className="absolute inset-0 top-8 flex flex-col items-center justify-center z-[1] gap-2.5" style={{ background: '#0a0500' }}>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                  style={{ width: 24, height: 24, border: '2px solid rgba(212,175,55,0.15)', borderTopColor: '#d4af37', borderRadius: '50%' }}
                                />
                                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(200,176,138,0.4)', fontStyle: 'italic' }}>
                                  불러오는 중...
                                </span>
                              </div>
                            )}

                            <iframe
                              src={form.liveDemo}
                              title="포트폴리오 미리보기"
                              sandbox="allow-scripts allow-same-origin allow-forms"
                              onLoad={() => setIframeLoading(false)}
                              onError={() => setIframeLoading(false)}
                              className="block w-full border-none"
                              style={{ height: 360, background: '#fff' }}
                            />
                          </div>

                          <p style={{ marginTop: 6, fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: 'rgba(200,176,138,0.3)', fontStyle: 'italic' }}>
                            * 일부 사이트는 보안 정책(X-Frame-Options)으로 인해 미리보기가 제한될 수 있습니다.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label className="label-field">
                      GitHub URL{' '}
                      <span style={{ fontFamily: "'EB Garamond', serif", letterSpacing: 0, fontStyle: 'italic', color: 'rgba(200,176,138,0.4)' }}>(선택)</span>
                    </label>
                    <input
                      type="url"
                      value={form.github}
                      onChange={(e) => setField('github', e.target.value)}
                      placeholder="https://github.com/username"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* ── 4. 자기소개 ── */}
              <div>
                <SectionTitle>ABOUT ME</SectionTitle>
                <textarea
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="나의 개발 철학, 경험, 관심사를 자유롭게 작성해주세요..."
                  rows={4}
                  className="input-field -mt-3"
                  style={{ resize: 'vertical', minHeight: 100, lineHeight: 1.7 }}
                />
              </div>

              {/* ── 5. 책 테마 ── */}
              <div>
                <SectionTitle>BOOK THEME</SectionTitle>
                <div className="flex gap-4 items-center">
                  <MiniBook name={form.name} role={form.role} theme={selectedTheme} />
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
                          onClick={() => setField('themeIdx', i)}
                          title={theme.label}
                          className="relative flex-shrink-0"
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 3,
                            border: form.themeIdx === i ? `2px solid ${theme.accentColor}` : '2px solid transparent',
                            background: `linear-gradient(135deg, ${theme.coverColor}, ${theme.spineColor})`,
                            cursor: 'pointer',
                            boxShadow: form.themeIdx === i ? `0 0 12px ${theme.accentColor}60` : '0 2px 8px rgba(0,0,0,0.4)',
                            transition: 'box-shadow 0.2s',
                          }}
                        >
                          {form.themeIdx === i && (
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
              </div>

              {/* 에러 메시지 */}
              {submitError && (
                <motion.div
                  className="error-box"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submitError}
                </motion.div>
              )}

              {/* ── 버튼 영역 ── */}
              <div className="flex gap-2.5 mt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(-1)}
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
                  {isLoading ? '서재에 꽂는 중...' : '서재에 등록하기 →'}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
