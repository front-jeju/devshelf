import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingParticles } from '../components/FloatingParticles';
import { useLoginForm } from '../hooks/useLoginForm';

export function LoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    error,
    isLoading,
    oauthLoading,
    isConfigured,
    handleSubmit,
    handleOAuth,
  } = useLoginForm();

  return (
    <div className="page-bg-flex">
      <FloatingParticles />
      <div className="page-overlay" />
      <div className="gold-top-line" />

      {/* 로고 */}
      <motion.div
        className="relative z-[2] mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/">
          <div className="flex items-center gap-3 justify-center">
            <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.6))' }}>
              📚
            </div>
            <div>
              <div className="logo-title">The Developer's Library</div>
              <div className="logo-subtitle">개발자의 서재</div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 로그인 카드 */}
      <motion.div
        className="relative z-[2] w-full max-w-[420px] px-6"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="card-dark">
          <div className="card-top-bar" />

          <div className="p-9 px-8">
            {/* 타이틀 */}
            <div className="text-center mb-8">
              <div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.75rem',
                  color: 'rgba(200,176,138,0.5)',
                  letterSpacing: '0.25em',
                  fontStyle: 'italic',
                  marginBottom: 8,
                }}
              >
                — 서재에 입장하려면 —
              </div>
              <h1
                className="gold-gradient-text"
                style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.08em' }}
              >
                로그인
              </h1>
            </div>

            <div className="gold-divider mb-6" />

            {/* OAuth 버튼 */}
            <div className="flex flex-col gap-2.5 mb-6">
              {/* GitHub */}
              <motion.button
                type="button"
                whileHover={{ scale: (oauthLoading || !isConfigured) ? 1 : 1.02 }}
                whileTap={{ scale: (oauthLoading || !isConfigured) ? 1 : 0.98 }}
                disabled={!!oauthLoading || isLoading || !isConfigured}
                onClick={() => handleOAuth('github')}
                title={!isConfigured ? 'Firebase 설정이 필요합니다' : undefined}
                className="w-full flex items-center justify-center gap-2.5"
                style={{
                  padding: '11px 14px',
                  background: 'rgba(36,41,47,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  cursor: (oauthLoading || !isConfigured) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: (!isConfigured || (oauthLoading && oauthLoading !== 'github')) ? 0.4 : 1,
                }}
              >
                {oauthLoading === 'github' ? <LoadingSpinner color="#fff" /> : <GitHubIcon />}
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', letterSpacing: '0.08em', color: '#ffffff', fontWeight: 600 }}>
                  {oauthLoading === 'github' ? '연결 중...' : 'GitHub으로 계속하기'}
                </span>
              </motion.button>

              {/* Google */}
              <motion.button
                type="button"
                whileHover={{ scale: (oauthLoading || !isConfigured) ? 1 : 1.02 }}
                whileTap={{ scale: (oauthLoading || !isConfigured) ? 1 : 0.98 }}
                disabled={!!oauthLoading || isLoading || !isConfigured}
                onClick={() => handleOAuth('google')}
                title={!isConfigured ? 'Firebase 설정이 필요합니다' : undefined}
                className="w-full flex items-center justify-center gap-2.5"
                style={{
                  padding: '11px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: 3,
                  cursor: (oauthLoading || !isConfigured) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: (!isConfigured || (oauthLoading && oauthLoading !== 'google')) ? 0.4 : 1,
                }}
              >
                {oauthLoading === 'google' ? <LoadingSpinner color="#d4af37" /> : <GoogleIcon />}
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', letterSpacing: '0.08em', color: '#e8d5b0', fontWeight: 600 }}>
                  {oauthLoading === 'google' ? '연결 중...' : 'Google로 계속하기'}
                </span>
              </motion.button>
            </div>

            {/* OR 구분선 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(212,175,55,0.15)' }} />
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.78rem', color: 'rgba(200,176,138,0.35)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
                or
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(212,175,55,0.15)' }} />
            </div>

            {/* 이메일 폼 */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="label-field">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-field"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(200,176,138,0.5)', fontSize: '0.85rem', padding: 4 }}
                    title={showPassword ? '숨기기' : '보기'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  className="error-box"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !!oauthLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="btn-gold mt-1"
              >
                {isLoading ? '입장 중...' : '서재 입장 →'}
              </motion.button>
            </form>

            <div className="gold-divider-faint my-7" />

            <div className="text-center">
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'rgba(200,176,138,0.5)', fontStyle: 'italic' }}>
                아직 서재 회원이 아니신가요?{' '}
              </span>
              <Link
                to="/register"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  color: '#d4af37',
                  borderBottom: '1px solid rgba(212,175,55,0.3)',
                  paddingBottom: 1,
                }}
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="h-16" />
    </div>
  );
}

/* ── 아이콘 / 스피너 ── */
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function LoadingSpinner({ color }: { color: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: 18,
        height: 18,
        border: `2px solid ${color}30`,
        borderTopColor: color,
        borderRadius: '50%',
        flexShrink: 0,
      }}
    />
  );
}
