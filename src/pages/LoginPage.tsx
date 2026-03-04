import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingParticles } from '../components/FloatingParticles';
import { useLoginForm, type OAuthProvider } from '../hooks/useLoginForm';

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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0500 0%, #0f0700 30%, #120800 60%, #0a0500 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FloatingParticles />

      {/* 배경 패턴 */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(100, 40, 10, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(60, 20, 5, 0.03) 0%, transparent 70%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* 상단 황금 장식선 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #d4af37, #f0c040, #d4af37, transparent)',
          zIndex: 10,
        }}
      />

      {/* 로고 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 2, marginBottom: 40, textAlign: 'center' }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.6))' }}>
              📚
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  background: 'linear-gradient(135deg, #f0c040, #d4af37, #c9a84c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                The Developer's Library
              </div>
              <div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.7rem',
                  color: '#c8b08a',
                  letterSpacing: '0.15em',
                  fontStyle: 'italic',
                  textAlign: 'center',
                }}
              >
                개발자의 서재
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 로그인 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420, padding: '0 24px' }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #1e0f00 0%, #120800 60%, #0a0500 100%)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.05)',
          }}
        >
          {/* 상단 컬러 바 */}
          <div style={{ height: 3, background: 'linear-gradient(90deg, #d4af37, #f0c040, #d4af37)' }} />

          <div style={{ padding: '36px 32px' }}>
            {/* 타이틀 */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
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
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  background: 'linear-gradient(135deg, #f0c040, #d4af37)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                로그인
              </h1>
            </div>

            {/* 구분선 */}
            <div
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)',
                marginBottom: 24,
              }}
            />

            {/* ── OAuth 버튼 ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {/* GitHub */}
              <motion.button
                type="button"
                whileHover={{ scale: (oauthLoading || !isConfigured) ? 1 : 1.02 }}
                whileTap={{ scale: (oauthLoading || !isConfigured) ? 1 : 0.98 }}
                disabled={!!oauthLoading || isLoading || !isConfigured}
                onClick={() => handleOAuth('github')}
                title={!isConfigured ? 'Firebase 설정이 필요합니다' : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
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
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
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
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
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
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    color: '#e8d5b0',
                    fontWeight: 600,
                  }}
                >
                  {oauthLoading === 'google' ? '연결 중...' : 'Google로 계속하기'}
                </span>
              </motion.button>
            </div>

            {/* OR 구분선 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(212,175,55,0.15)' }} />
              <span
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.78rem',
                  color: 'rgba(200,176,138,0.35)',
                  fontStyle: 'italic',
                  letterSpacing: '0.1em',
                }}
              >
                or
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(212,175,55,0.15)' }} />
            </div>

            {/* 이메일 폼 */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* 이메일 */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(200,176,138,0.7)',
                    marginBottom: 8,
                  }}
                >
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
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
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(212,175,55,0.05)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(200,176,138,0.7)',
                    marginBottom: 8,
                  }}
                >
                  비밀번호
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: 3,
                      padding: '11px 44px 11px 14px',
                      fontFamily: "'EB Garamond', serif",
                      fontSize: '1rem',
                      color: '#e8d5b0',
                      outline: 'none',
                      transition: 'border-color 0.2s, background 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(212,175,55,0.05)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(200,176,138,0.5)',
                      fontSize: '0.85rem',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title={showPassword ? '숨기기' : '보기'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '0.88rem',
                    color: '#f87171',
                    background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    borderRadius: 3,
                    padding: '10px 14px',
                    textAlign: 'center',
                  }}
                >
                  {error}
                </motion.div>
              )}

              {/* 로그인 버튼 */}
              <motion.button
                type="submit"
                disabled={isLoading || !!oauthLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: isLoading
                    ? 'rgba(212,175,55,0.3)'
                    : 'linear-gradient(135deg, #d4af37, #f0c040, #d4af37)',
                  border: 'none',
                  borderRadius: 3,
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: isLoading ? 'rgba(26,13,0,0.5)' : '#1a0d00',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  marginTop: 4,
                }}
              >
                {isLoading ? '입장 중...' : '서재 입장 →'}
              </motion.button>
            </form>

            {/* 구분선 */}
            <div
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)',
                margin: '28px 0 20px',
              }}
            />

            {/* 회원가입 링크 */}
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.9rem',
                  color: 'rgba(200,176,138,0.5)',
                  fontStyle: 'italic',
                }}
              >
                아직 서재 회원이 아니신가요?{' '}
              </span>
              <Link
                to="/register"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  color: '#d4af37',
                  textDecoration: 'none',
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

      <div style={{ height: 60 }} />
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
