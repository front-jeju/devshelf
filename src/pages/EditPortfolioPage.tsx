import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles } from '../components/FloatingParticles';
import {
  SectionTitle,
  BasicInfoFields, TechStackFields, LinksFields, AboutMeField,
  StatusField, ProjectTypeField,
  BookThemePicker, FormActionButtons, DoneScreen,
} from '../components/PortfolioFormShared';
import { useGithubAutofill } from '../components/GitHubAutofill';
import { useEditPortfolioForm } from '../hooks/useEditPortfolioForm';

export function EditPortfolioPage() {
  const { id } = useParams<{ id: string }>();

  const {
    form,
    touched,
    errors,
    isLoading,
    isFetching,
    done,
    submitError,
    notFound,
    selectedTheme,
    setField,
    setForm,
    touch,
    toggleStack,
    toggleProjectType,
    handleSubmit,
    navigate,
  } = useEditPortfolioForm(id ?? '');

  const githubAutofill = useGithubAutofill(({ tagline, description, techStack }) => {
    setForm((prev) => ({ ...prev, tagline, description, techStack }));
  });

  /* ── 데이터 불러오는 중 ── */
  if (isFetching) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div style={{ fontFamily: "'EB Garamond', serif", color: 'rgba(200,176,138,0.5)', fontSize: '1rem', letterSpacing: '0.1em' }}>
          서재 정보를 불러오는 중...
        </div>
      </div>
    );
  }

  /* ── 해당 포트폴리오가 없는 경우 ── */
  if (notFound) {
    return (
      <div className="page-bg flex flex-col items-center justify-center gap-5">
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
      <div className="page-bg-flex px-6">
        <FloatingParticles />
        <DoneScreen
          name={form.name}
          role={form.role}
          theme={selectedTheme}
          subtitle="— 서재가 새롭게 정돈되었습니다 —"
          title="수정 완료"
          description={`"${form.name}"의 서재가 아름답게 수정되었습니다.`}
          onNavigate={() => navigate('/shelf')}
        />
      </div>
    );
  }

  /* ── 수정 폼 화면 ── */
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
        <button onClick={() => navigate('/')} className="bg-transparent border-none cursor-pointer">
          <div className="flex items-center gap-3 justify-center">
            <div>
              <div className="logo-title">DEVSHELF</div>
              <div className="logo-subtitle">개발자의 서재</div>
            </div>
          </div>
        </button>
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
                — 나의 이야기를 다듬다 —
              </div>
              <h1
                className="gold-gradient-text"
                style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.08em' }}
              >
                서재 수정
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
                  onLiveDemoChange={(v) => setField('liveDemo', v)}
                  onLiveDemoBlur={() => touch('liveDemo')}
                  onGithubChange={(v) => { setField('github', v); githubAutofill.handleUrlChange(v); }}
                  githubChildren={
                    <div className="mt-2.5 flex flex-col gap-2">
                      {(() => {
                        const hasValidRepo = /^https:\/\/github\.com\/.+\/.+/.test(form.github);
                        const isDisabled = githubAutofill.isAnalyzing || !hasValidRepo;
                        return (
                          <div
                            style={{
                              border: `1px solid ${hasValidRepo ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.12)'}`,
                              borderRadius: 4,
                              background: hasValidRepo ? 'rgba(212,175,55,0.06)' : 'rgba(212,175,55,0.02)',
                              padding: '10px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 12,
                              transition: 'all 0.2s',
                            }}
                          >
                            <div>
                              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.16em', color: hasValidRepo ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.35)', marginBottom: 3, transition: 'color 0.2s' }}>
                                AI 자동완성
                              </div>
                              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: hasValidRepo ? 'rgba(200,176,138,0.5)' : 'rgba(200,176,138,0.25)', transition: 'color 0.2s' }}>
                                {hasValidRepo ? '기술 스택 · 소개 · 한줄 소개를 자동으로 채웁니다' : 'GitHub 레포 URL을 입력하면 자동완성이 활성화됩니다'}
                              </div>
                            </div>
                            <motion.button
                              type="button"
                              onClick={() => githubAutofill.handleAutofillWithUrl(form.github)}
                              disabled={isDisabled}
                              whileHover={!isDisabled ? { scale: 1.03 } : {}}
                              whileTap={!isDisabled ? { scale: 0.97 } : {}}
                              style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: '0.65rem',
                                letterSpacing: '0.14em',
                                fontWeight: 700,
                                padding: '8px 16px',
                                borderRadius: 3,
                                border: `1px solid ${isDisabled ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.6)'}`,
                                background: isDisabled
                                  ? 'rgba(212,175,55,0.02)'
                                  : 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))',
                                color: isDisabled ? 'rgba(200,176,138,0.2)' : '#d4af37',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                transition: 'all 0.2s',
                              }}
                            >
                              {githubAutofill.isAnalyzing && (
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  style={{ display: 'inline-block', width: 9, height: 9, border: '1.5px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', borderRadius: '50%' }}
                                />
                              )}
                              {githubAutofill.isAnalyzing ? '분석 중...' : '자동완성 →'}
                            </motion.button>
                          </div>
                        );
                      })()}
                      <AnimatePresence>
                        {githubAutofill.error && (
                          <motion.p key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(248,113,113,0.8)', margin: 0 }}>
                            {githubAutofill.error}
                          </motion.p>
                        )}
                        {githubAutofill.success && (
                          <motion.p key="ok" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(52,211,153,0.8)', margin: 0 }}>
                            ✓ 자동완성 완료 — 내용을 확인하고 필요 시 수정해주세요.
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  }
                />
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
                <TechStackFields techStack={form.techStack} toggleStack={toggleStack} />
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
                loadingText="수정하는 중..."
                submitText="수정 완료 →"
              />
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
