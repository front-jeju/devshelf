import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles } from '../components/FloatingParticles';
import { useRegisterForm } from '../hooks/useRegisterForm';

const inputBaseStyle: React.CSSProperties = {
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Cinzel', serif",
  fontSize: '0.7rem',
  letterSpacing: '0.15em',
  color: 'rgba(200,176,138,0.7)',
  marginBottom: 8,
};

export function RegisterPage() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirm, setConfirm,
    showPassword, setShowPassword,
    showConfirm, setShowConfirm,
    touched,
    errors,
    isLoading,
    submitError,
    passwordStrength,
    handleBlur,
    handleSubmit,
  } = useRegisterForm();

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
        padding: '60px 0 40px',
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
        style={{ position: 'relative', zIndex: 2, marginBottom: 36, textAlign: 'center' }}
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

      {/* 회원가입 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 440,
          padding: '0 24px',
        }}
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
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
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
                — 서재의 일원이 되려면 —
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
                회원가입
              </h1>
            </div>

            {/* 구분선 */}
            <div
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)',
                marginBottom: 28,
              }}
            />

            {/* 폼 */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* 이름 */}
              <div>
                <label style={labelStyle}>이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="홍길동"
                  required
                  style={{
                    ...inputBaseStyle,
                    borderColor: touched.name && errors.name
                      ? 'rgba(248,113,113,0.5)'
                      : 'rgba(212,175,55,0.2)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(212,175,55,0.6)';
                    e.target.style.background = 'rgba(212,175,55,0.05)';
                  }}
                  onBlurCapture={(e) => {
                    e.target.style.borderColor =
                      touched.name && errors.name ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)';
                    e.target.style.background = 'rgba(255,255,255,0.04)';
                  }}
                />
                <FieldErrorMsg show={touched.name && !!errors.name} message={errors.name} />
              </div>

              {/* 이메일 */}
              <div>
                <label style={labelStyle}>이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="your@email.com"
                  required
                  style={{
                    ...inputBaseStyle,
                    borderColor: touched.email && errors.email
                      ? 'rgba(248,113,113,0.5)'
                      : 'rgba(212,175,55,0.2)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(212,175,55,0.6)';
                    e.target.style.background = 'rgba(212,175,55,0.05)';
                  }}
                  onBlurCapture={(e) => {
                    e.target.style.borderColor =
                      touched.email && errors.email ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)';
                    e.target.style.background = 'rgba(255,255,255,0.04)';
                  }}
                />
                <FieldErrorMsg show={touched.email && !!errors.email} message={errors.email} />
              </div>

              {/* 비밀번호 */}
              <div>
                <label style={labelStyle}>비밀번호</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    required
                    style={{
                      ...inputBaseStyle,
                      padding: '11px 44px 11px 14px',
                      borderColor: touched.password && errors.password
                        ? 'rgba(248,113,113,0.5)'
                        : 'rgba(212,175,55,0.2)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(212,175,55,0.6)';
                      e.target.style.background = 'rgba(212,175,55,0.05)';
                    }}
                    onBlurCapture={(e) => {
                      e.target.style.borderColor =
                        touched.password && errors.password ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.2)';
                      e.target.style.background = 'rgba(255,255,255,0.04)';
                    }}
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
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* 비밀번호 강도 바 */}
                <AnimatePresence>
                  {passwordStrength && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginTop: 8, overflow: 'hidden' }}
                    >
                      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: 3,
                              borderRadius: 2,
                              background:
                                i <= passwordStrength.level
                                  ? passwordStrength.color
                                  : 'rgba(255,255,255,0.08)',
                              transition: 'background 0.3s',
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          fontFamily: "'EB Garamond', serif",
                          fontSize: '0.75rem',
                          color: passwordStrength.color,
                          fontStyle: 'italic',
                        }}
                      >
                        보안 강도: {passwordStrength.label}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <FieldErrorMsg show={touched.password && !!errors.password} message={errors.password} />
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label style={labelStyle}>비밀번호 확인</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onBlur={() => handleBlur('confirm')}
                    placeholder="••••••••"
                    required
                    style={{
                      ...inputBaseStyle,
                      padding: '11px 44px 11px 14px',
                      borderColor:
                        touched.confirm && errors.confirm
                          ? 'rgba(248,113,113,0.5)'
                          : confirm && !errors.confirm
                          ? 'rgba(52,211,153,0.5)'
                          : 'rgba(212,175,55,0.2)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(212,175,55,0.6)';
                      e.target.style.background = 'rgba(212,175,55,0.05)';
                    }}
                    onBlurCapture={(e) => {
                      if (touched.confirm && errors.confirm) {
                        e.target.style.borderColor = 'rgba(248,113,113,0.5)';
                      } else if (confirm && !errors.confirm) {
                        e.target.style.borderColor = 'rgba(52,211,153,0.5)';
                      } else {
                        e.target.style.borderColor = 'rgba(212,175,55,0.2)';
                      }
                      e.target.style.background = 'rgba(255,255,255,0.04)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
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
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>

                  {/* 일치 뱃지 */}
                  <AnimatePresence>
                    {confirm && !errors.confirm && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                          position: 'absolute',
                          right: 40,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.8rem',
                          color: '#34d399',
                        }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <FieldErrorMsg show={touched.confirm && !!errors.confirm} message={errors.confirm} />
              </div>

              {/* 서밋 에러 */}
              {submitError && (
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
                  {submitError}
                </motion.div>
              )}

              {/* 회원가입 버튼 */}
              <motion.button
                type="submit"
                disabled={isLoading}
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
                {isLoading ? '등록 중...' : '서재 회원 등록 →'}
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

            {/* 로그인 링크 */}
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.9rem',
                  color: 'rgba(200,176,138,0.5)',
                  fontStyle: 'italic',
                }}
              >
                이미 계정이 있으신가요?{' '}
              </span>
              <Link
                to="/login"
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
                로그인
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ height: 40 }} />
    </div>
  );
}

function FieldErrorMsg({ show, message }: { show: boolean; message: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2 }}
          style={{ overflow: 'hidden' }}
        >
          <div
            style={{
              marginTop: 6,
              fontFamily: "'EB Garamond', serif",
              fontSize: '0.8rem',
              color: '#f87171',
              fontStyle: 'italic',
            }}
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
