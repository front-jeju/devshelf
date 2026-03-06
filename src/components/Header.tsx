import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { label: 'The Shelf', sub: '책장',  to: '/shelf' },
  { label: 'Our Story', sub: '팀 소개', to: '/' },
  { label: 'Guestbook', sub: '방명록', to: '/#guestbook' },
] as const;

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  /** Guestbook처럼 같은 페이지 앵커 또는 다른 페이지 앵커를 모두 처리 */
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, to: string) {
    if (!to.includes('#')) return; // 일반 라우트는 Link가 처리

    e.preventDefault();
    const [path, hash] = to.split('#');
    const targetPath = path || '/';

    if (location.pathname === targetPath || path === '') {
      // 이미 같은 페이지 → 바로 스크롤
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // 다른 페이지 → 이동 후 스크롤
      navigate(targetPath);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 상단 황금 장식선 */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f0c040, #d4af37, transparent)' }}
      />

      <div
        style={{
          background: 'linear-gradient(180deg, rgba(10,5,0,0.98) 0%, rgba(18,8,0,0.92) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* 로고 */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <div>
                <div className="logo-title">DEVSHELF</div>
                <div className="logo-subtitle">개발자의 서재</div>
              </div>
            </motion.div>
          </Link>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <motion.a
                key={item.label}
                href={item.to}
                onClick={(e) => handleNavClick(e, item.to)}
                className="group flex flex-col items-center"
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <span
                  className="group-hover:text-yellow-300 transition-colors duration-200"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: '0.78rem', letterSpacing: '0.1em', color: '#c8b08a' }}
                >
                  {item.label}
                </span>
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.65rem', color: 'rgba(200,176,138,0.5)', fontStyle: 'italic' }}>
                  {item.sub}
                </span>
              </motion.a>
            ))}
          </nav>

          {/* CTA 영역 */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span
                  className="hidden sm:block"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    color: '#c8b08a',
                    maxWidth: 140,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.displayName ?? user.email}
                </span>
                <Link to="/portfolio/new">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      padding: '8px 20px',
                      border: '1px solid rgba(212,175,55,0.5)',
                      borderRadius: '2px',
                      color: '#d4af37',
                      background: 'rgba(212,175,55,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    내 서재 등록
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    padding: '8px 20px',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '2px',
                    color: 'rgba(200,176,138,0.8)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  로그아웃
                </motion.button>
              </>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    padding: '8px 20px',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '2px',
                    color: 'rgba(200,176,138,0.8)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  로그인
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 하단 황금 장식선 */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }}
      />
    </motion.header>
  );
}
