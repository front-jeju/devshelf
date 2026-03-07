import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, to: string) {
    e.preventDefault();
    setMenuOpen(false);

    if (!to.includes('#')) {
      navigate(to);
      return;
    }

    const [path, hash] = to.split('#');
    const targetPath = path || '/';

    if (location.pathname === targetPath || path === '') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
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
          <Link to="/" onClick={() => setMenuOpen(false)}>
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

          {/* 데스크탑 네비게이션 */}
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

          {/* 데스크탑 CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span
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

          {/* 모바일 햄버거 버튼 */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'block', width: 22, height: 1.5, background: '#d4af37', borderRadius: 2 }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'block', width: 22, height: 1.5, background: '#d4af37', borderRadius: 2 }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'block', width: 22, height: 1.5, background: '#d4af37', borderRadius: 2 }}
            />
          </button>
        </div>
      </div>

      {/* 하단 황금 장식선 */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }}
      />

      {/* 모바일 드롭다운 메뉴 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'rgba(10,5,0,0.98)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(212,175,55,0.15)',
            }}
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {/* 네비게이션 링크 */}
              {NAV_ITEMS.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.to}
                  onClick={(e) => handleNavClick(e, item.to)}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 py-3"
                  style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}
                >
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.82rem', letterSpacing: '0.12em', color: '#c8b08a' }}>
                    {item.label}
                  </span>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.72rem', color: 'rgba(200,176,138,0.4)', fontStyle: 'italic' }}>
                    {item.sub}
                  </span>
                </motion.a>
              ))}

              {/* 인증 영역 */}
              <div className="pt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.85rem', color: 'rgba(200,176,138,0.6)', fontStyle: 'italic' }}>
                      {user.displayName ?? user.email}
                    </p>
                    <Link to="/portfolio/new" onClick={() => setMenuOpen(false)}>
                      <button
                        className="w-full py-2.5"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: '0.75rem',
                          letterSpacing: '0.1em',
                          border: '1px solid rgba(212,175,55,0.5)',
                          borderRadius: '2px',
                          color: '#d4af37',
                          background: 'rgba(212,175,55,0.08)',
                          cursor: 'pointer',
                        }}
                      >
                        내 서재 등록
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2.5"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        border: '1px solid rgba(212,175,55,0.2)',
                        borderRadius: '2px',
                        color: 'rgba(200,176,138,0.7)',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <button
                      className="w-full py-2.5"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        border: '1px solid rgba(212,175,55,0.3)',
                        borderRadius: '2px',
                        color: 'rgba(200,176,138,0.8)',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      로그인
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
