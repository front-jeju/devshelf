import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GuestbookMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'devlibrary_guestbook';

function loadMessages(): GuestbookMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: GuestbookMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export function Footer() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<GuestbookMessage[]>(loadMessages);
  const [name, setName] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.displayName ?? user.email ?? '');
    }
  }, [user]);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText) return;

    const newMessage: GuestbookMessage = {
      id: Date.now().toString(),
      name: trimmedName,
      message: trimmedText,
      createdAt: new Date().toISOString(),
    };

    const updated = [newMessage, ...messages];
    setMessages(updated);
    saveMessages(updated);
    setText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  return (
    <footer className="relative pt-20 pb-10">
      {/* 상단 장식선 */}
      <div className="gold-divider max-w-[800px] mx-auto mb-16" />

      {/* 방명록 섹션 */}
      <motion.div
        className="max-w-[600px] mx-auto text-center pb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-[50px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', letterSpacing: '0.3em', color: '#c8b08a' }}>
            THE GUESTBOOK
          </span>
          <div className="h-px w-[50px]" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
        </div>

        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(200,176,138,0.6)', marginBottom: 24, lineHeight: 1.8 }}>
          이 서재를 방문한 흔적을 남겨주세요.
          <br />당신의 한 마디로 누군가의 이야기를 시작할 수 있습니다.
        </p>

        {/* 방명록 입력 */}
        <div
          className="text-left rounded"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.02) 100%)',
            border: '1px solid rgba(212,175,55,0.2)',
            padding: '20px 24px',
          }}
        >
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(200,176,138,0.5)', letterSpacing: '0.1em', marginBottom: 8 }}>
            방문 메시지 남기기
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            maxLength={30}
            className="input-field mb-2"
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 메시지를 남겨보세요..."
            maxLength={200}
            rows={3}
            className="input-field"
            style={{ resize: 'none' }}
          />

          <div className="flex justify-between items-center mt-2.5">
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: 'rgba(200,176,138,0.3)' }}>
              {text.length} / 200
            </span>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !text.trim()}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                padding: '8px 20px',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: 2,
                color: submitted ? '#7dbf7d' : '#d4af37',
                background: 'rgba(212,175,55,0.06)',
                cursor: name.trim() && text.trim() ? 'pointer' : 'not-allowed',
                opacity: name.trim() && text.trim() ? 1 : 0.5,
                transition: 'color 0.3s',
              }}
            >
              {submitted ? '기록됨 ✓' : '기록하기 ✦'}
            </button>
          </div>
        </div>

        {/* 기존 메시지 목록 */}
        {messages.length > 0 && (
          <div className="mt-8 text-left">
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(200,176,138,0.4)', marginBottom: 16, textAlign: 'center' }}>
              — 방문자들의 흔적 —
            </div>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-sm mb-2.5"
                  style={{
                    background: 'rgba(212,175,55,0.03)',
                    border: '1px solid rgba(212,175,55,0.1)',
                    padding: '12px 16px',
                  }}
                >
                  <div className="flex justify-between mb-1.5">
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', color: '#d4af37', letterSpacing: '0.05em' }}>
                      {msg.name}
                    </span>
                    <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: 'rgba(200,176,138,0.3)' }}>
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(200,176,138,0.7)', lineHeight: 1.6, margin: 0 }}>
                    {msg.message}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* 하단 정보 */}
      <div className="text-center pt-8" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
        <div
          className="gold-gradient-text mb-2"
          style={{ fontFamily: "'Cinzel', serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em' }}
        >
          DEVSHELF
        </div>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'rgba(200,176,138,0.4)', fontStyle: 'italic', marginBottom: 16 }}>
          개발자의 서재 — 모든 코드는 하나의 이야기다
        </p>
        <div className="flex justify-center gap-6 mb-5">
          {['The Shelf', 'Our Story', 'Guestbook'].map((link) => (
            <a
              key={link}
              href="#"
              style={{ fontFamily: "'Cinzel', serif", fontSize: '0.72rem', letterSpacing: '0.1em', color: 'rgba(200,176,138,0.4)', transition: 'color 0.2s' }}
            >
              {link}
            </a>
          ))}
        </div>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.75rem', color: 'rgba(200,176,138,0.25)' }}>
          MMXXVI · Built with React & Framer Motion
        </p>
      </div>
    </footer>
  );
}
