import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer style={{ position: 'relative', paddingTop: 80, paddingBottom: 40 }}>
      {/* 상단 장식선 */}
      <div
        style={{
          height: 1,
          maxWidth: 800,
          margin: '0 auto 60px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
        }}
      />

      {/* 방명록 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', paddingBottom: 60 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div style={{ height: 1, width: 50, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              color: '#c8b08a',
            }}
          >
            THE GUESTBOOK
          </span>
          <div style={{ height: 1, width: 50, background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
        </div>

        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.1rem',
            fontStyle: 'italic',
            color: 'rgba(200,176,138,0.6)',
            marginBottom: 24,
            lineHeight: 1.8,
          }}
        >
          이 서재를 방문한 흔적을 남겨주세요.
          <br />당신의 한 마디로 누군가의 이야기를 시작할 수 있습니다.
        </p>

        {/* 방명록 입력 (장식용) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.02) 100%)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 4,
            padding: '20px 24px',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: '0.8rem',
              color: 'rgba(200,176,138,0.5)',
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            방문 메시지 남기기
          </div>
          <div
            style={{
              width: '100%',
              height: 60,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 12,
            }}
          >
            <span
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: '0.9rem',
                color: 'rgba(200,176,138,0.3)',
                fontStyle: 'italic',
              }}
            >
              여기에 메시지를 남겨보세요...
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                padding: '8px 20px',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: 2,
                color: '#d4af37',
                background: 'rgba(212,175,55,0.06)',
                cursor: 'pointer',
              }}
            >
              기록하기 ✦
            </button>
          </div>
        </div>
      </motion.div>

      {/* 하단 정보 */}
      <div
        style={{
          borderTop: '1px solid rgba(212,175,55,0.1)',
          paddingTop: 32,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, #f0c040, #d4af37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 8,
          }}
        >
          DEVSHELF
        </div>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: '0.8rem',
            color: 'rgba(200,176,138,0.4)',
            fontStyle: 'italic',
            marginBottom: 16,
          }}
        >
          개발자의 서재 — 모든 코드는 하나의 이야기다
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            marginBottom: 20,
          }}
        >
          {['The Shelf', 'Our Story', 'Guestbook'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                color: 'rgba(200,176,138,0.4)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              {link}
            </a>
          ))}
        </div>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: '0.75rem',
            color: 'rgba(200,176,138,0.25)',
          }}
        >
          MMXXVI · Built with React & Framer Motion
        </p>
      </div>
    </footer>
  );
}
