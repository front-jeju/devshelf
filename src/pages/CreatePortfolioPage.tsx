import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles } from '../components/FloatingParticles';
import {
  SectionTitle,
  BasicInfoFields, TechStackFields, LinksFields, AboutMeField,
  StatusField, ProjectTypeField,
  BookThemePicker, FormActionButtons, DoneScreen, GithubAutofillPanel,
} from '../components/PortfolioFormShared';
import { useGithubAutofill } from '../hooks/useGithubAutofill';
import { usePortfolioForm } from '../hooks/usePortfolioForm';

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
    setForm,
    touch,
    toggleStack,
    toggleProjectType,
    handleSubmit,
    navigate,
  } = usePortfolioForm();

  const githubAutofill = useGithubAutofill(({ tagline, description, techStack }) => {
    setForm((prev) => ({ ...prev, tagline, description, techStack }));
  });

  if (done) {
    return (
      <div className="page-bg-flex px-6">
        <FloatingParticles />
        <DoneScreen
          name={form.name}
          role={form.role}
          theme={selectedTheme}
          subtitle="— 서재에 새 책이 꽂혔습니다 —"
          title="등록 완료"
          description={<>"{form.name}"의 서재가 개발자의 도서관에<br />아름답게 자리를 잡았습니다.</>}
          onNavigate={() => navigate('/shelf')}
        />
      </div>
    );
  }

  return (
    <div className="page-bg-flex py-16">
      <FloatingParticles />
      <div className="page-overlay" />
      <div className="gold-top-line" />

      {/* 뒤로 가기 */}
      <motion.div
        className="relative z-[2] w-full max-w-[600px] px-6 mb-4 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'Cinzel', serif",
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            color: 'rgba(200,176,138,0.55)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ← 뒤로
        </button>
      </motion.div>

      {/* 로고 */}
      <motion.div
        className="relative z-[2] mb-9 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/">
          <div className="flex items-center gap-3 justify-center">
            <div>
              <div className="logo-title">DEVSHELF</div>
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
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: 'rgba(200,176,138,0.5)', letterSpacing: '0.25em', marginBottom: 8 }}>
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

              {/* ── 1. 링크 ── */}
              <div>
                <SectionTitle>LINKS</SectionTitle>
                <LinksFields
                  liveDemo={form.liveDemo}
                  liveDemoTouched={touched.liveDemo}
                  liveDemoError={errors.liveDemo}
                  github={form.github}
                  onLiveDemoChange={(v) => { setField('liveDemo', v); setShowPreview(false); }}
                  onLiveDemoBlur={() => touch('liveDemo')}
                  onGithubChange={(v) => { setField('github', v); githubAutofill.handleUrlChange(v); }}
                  githubChildren={
                    <GithubAutofillPanel
                      github={form.github}
                      isAnalyzing={githubAutofill.isAnalyzing}
                      error={githubAutofill.error}
                      success={githubAutofill.success}
                      onAutofill={() => githubAutofill.handleAutofillWithUrl(form.github)}
                    />
                  }
                >
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
                              style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.72rem', color: 'rgba(200,176,138,0.4)' }}
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

                          {iframeLoading && (
                            <div className="absolute inset-0 top-8 flex flex-col items-center justify-center z-[1] gap-2.5" style={{ background: '#0a0500' }}>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                style={{ width: 24, height: 24, border: '2px solid rgba(212,175,55,0.15)', borderTopColor: '#d4af37', borderRadius: '50%' }}
                              />
                              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(200,176,138,0.4)' }}>
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

                        <p style={{ marginTop: 6, fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: 'rgba(200,176,138,0.3)' }}>
                          * 일부 사이트는 보안 정책(X-Frame-Options)으로 인해 미리보기가 제한될 수 있습니다.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </LinksFields>
              </div>

              {/* ── 2. 기본 정보 ── */}
              <div>
                <SectionTitle>BASIC INFO</SectionTitle>
                <BasicInfoFields
                  fields={{ name: form.name, role: form.role, tagline: form.tagline }}
                  touched={touched}
                  errors={errors}
                  onChange={(key, value) => setField(key, value)}
                  onBlur={(key) => touch(key)}
                />
              </div>

              {/* ── 3. 기술 스택 ── */}
              <div>
                <SectionTitle>TECH STACK</SectionTitle>
                <TechStackFields techStack={form.techStack} toggleStack={toggleStack} showHint />
              </div>

              {/* ── 4. 상태 ── */}
              <div>
                <SectionTitle>STATUS</SectionTitle>
                <StatusField
                  value={form.status}
                  onChange={(v) => setField('status', v)}
                />
              </div>

              {/* ── 5. 프로젝트 유형 ── */}
              <div>
                <SectionTitle>PROJECT TYPE</SectionTitle>
                <ProjectTypeField
                  projectTypes={form.projectTypes}
                  toggleProjectType={toggleProjectType}
                />
              </div>

              {/* ── 6. 자기소개 ── */}
              <div>
                <SectionTitle>ABOUT ME</SectionTitle>
                <AboutMeField value={form.description} onChange={(v) => setField('description', v)} />
              </div>

              {/* ── 7. 책 테마 ── */}
              <div>
                <SectionTitle>BOOK THEME</SectionTitle>
                <BookThemePicker
                  name={form.name}
                  role={form.role}
                  themeIdx={form.themeIdx}
                  selectedTheme={selectedTheme}
                  onThemeChange={(i) => setField('themeIdx', i)}
                />
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

              <FormActionButtons
                isLoading={isLoading}
                onCancel={() => navigate(-1)}
                loadingText="서재에 꽂는 중..."
                submitText="서재에 등록하기 →"
              />
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
