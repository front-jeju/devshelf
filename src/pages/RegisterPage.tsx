import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { FloatingParticles } from '../components/FloatingParticles';
import { FieldError } from '../components/PortfolioFormShared';
import { useRegisterForm } from '../hooks/useRegisterForm';

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
    <div className="page-bg-flex py-16">
      <FloatingParticles />
      <div className="page-overlay" />
      <div className="gold-top-line" />

      {/* 뒤로 가기 */}
      <motion.div
        className="relative z-[2] w-full max-w-[460px] px-6 mb-4 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'Cinzel', serif",
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            color: 'rgba(200,176,138,0.55)',
          }}
        >
          ← 로그인으로
        </Link>
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

      {/* 회원가입 카드 */}
      <motion.div
        className="relative z-[2] w-full max-w-[440px] px-6"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="card-dark">
          <div className="card-top-bar" />

          <div className="p-9 px-8">
            {/* 타이틀 */}
            <div className="text-center mb-7">
              <div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: '0.75rem',
                  color: 'rgba(200,176,138,0.5)',
                  letterSpacing: '0.25em',
                  marginBottom: 8,
                }}
              >
                — 서재의 일원이 되려면 —
              </div>
              <h1
                className="gold-gradient-text"
                style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.08em' }}
              >
                회원가입
              </h1>
            </div>

            <div className="gold-divider mb-7" />

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">

              {/* 이름 */}
              <div>
                <label className="label-field">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="홍길동"
                  required
                  className={`input-field ${touched.name && errors.name ? 'error' : ''}`}
                />
                <FieldError show={touched.name && !!errors.name} message={errors.name} />
              </div>

              {/* 이메일 */}
              <div>
                <label className="label-field">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="your@email.com"
                  required
                  className={`input-field ${touched.email && errors.email ? 'error' : ''}`}
                />
                <FieldError show={touched.email && !!errors.email} message={errors.email} />
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="label-field">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    required
                    className={`input-field ${touched.password && errors.password ? 'error' : ''}`}
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(200,176,138,0.5)', fontSize: '0.85rem', padding: 4 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* 비밀번호 강도 바 */}
                <AnimatePresence>
                  {passwordStrength && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-2"
                    >
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="flex-1 h-[3px] rounded-sm"
                            style={{
                              background: i <= passwordStrength.level ? passwordStrength.color : 'rgba(255,255,255,0.08)',
                              transition: 'background 0.3s',
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: passwordStrength.color }}>
                        보안 강도: {passwordStrength.label}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <FieldError show={touched.password && !!errors.password} message={errors.password} />
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label className="label-field">비밀번호 확인</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onBlur={() => handleBlur('confirm')}
                    placeholder="••••••••"
                    required
                    className={`input-field ${
                      touched.confirm && errors.confirm ? 'error' : confirm && !errors.confirm ? 'success' : ''
                    }`}
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(200,176,138,0.5)', fontSize: '0.85rem', padding: 4 }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>

                  {/* 일치 뱃지 */}
                  <AnimatePresence>
                    {confirm && !errors.confirm && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute right-10 top-1/2 -translate-y-1/2"
                        style={{ fontSize: '0.8rem', color: '#34d399' }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <FieldError show={touched.confirm && !!errors.confirm} message={errors.confirm} />
              </div>

              {/* 서밋 에러 */}
              {submitError && (
                <motion.div
                  className="error-box"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
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
                className="btn-gold mt-1"
              >
                {isLoading ? '등록 중...' : '서재 회원 등록 →'}
              </motion.button>
            </form>

            <div className="gold-divider-faint my-7" />

            <div className="text-center">
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'rgba(200,176,138,0.5)' }}>
                이미 계정이 있으신가요?{' '}
              </span>
              <Link
                to="/login"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  color: '#d4af37',
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

      <div className="h-10" />
    </div>
  );
}
