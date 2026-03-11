import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { GuestbookMessage } from '../types';
import { useAuth } from '../hooks/useAuth';
import { addGuestbookMessage, updateGuestbookMessage, deleteGuestbookMessage, subscribeGuestbookMessages } from '../lib/guestbookService';

export function Footer() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: false, text: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [lastUid, setLastUid] = useState<string | null | undefined>(undefined);

  const currentUid = user?.uid ?? null;
  if (lastUid !== currentUid) {
    setLastUid(currentUid);
    setName(user ? (user.displayName ?? user.email ?? '') : '');
  }

  useEffect(() => {
    const unsubscribe = subscribeGuestbookMessages(setMessages);
    return unsubscribe;
  }, []);

  async function handleSubmit() {
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    const nameErr = !trimmedName;
    const textErr = !trimmedText;
    if (nameErr || textErr) {
      setErrors({ name: nameErr, text: textErr });
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    try {
      await addGuestbookMessage(trimmedName, trimmedText, user?.uid);
      setText('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (err) {
      console.error('방명록 저장 실패:', err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEditSave(id: string) {
    const trimmed = editText.trim();
    if (!trimmed) return;
    try {
      await updateGuestbookMessage(id, trimmed);
    } catch (err) {
      console.error('수정 실패:', err);
    }
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    try {
      await deleteGuestbookMessage(id);
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  return (
    <footer id="guestbook" className="relative pt-20 pb-10">
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
          <div className="h-px w-[50px] bg-gradient-to-r from-transparent to-gold/40" />
          <span className="font-magic text-[0.8rem] tracking-[0.3em] text-parchment-dim">
            THE GUESTBOOK
          </span>
          <div className="h-px w-[50px] bg-gradient-to-r from-gold/40 to-transparent" />
        </div>

        <p className="font-display text-[1.1rem] text-parchment-dim/60 mb-6 leading-[1.8]">
          이 서재를 방문한 흔적을 남겨주세요.
          <br />당신의 한 마디로 누군가의 이야기를 시작할 수 있습니다.
        </p>

        {/* 방명록 입력 */}
        {user ? (
          <div className="text-left rounded bg-gradient-to-br from-gold/5 to-gold/[0.02] border border-gold/20 px-6 py-5">
            <div className="font-body text-[0.8rem] text-parchment-dim/50 tracking-[0.1em] mb-2">
              방문 메시지 남기기
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: false })); }}
              placeholder="이름"
              maxLength={30}
              className={`input-field mb-1 ${errors.name ? 'error' : ''}`}
            />
            {errors.name && (
              <p className="font-body text-[0.78rem] text-red-400/80 mb-2 pl-1">이름을 입력해주세요.</p>
            )}

            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setErrors((p) => ({ ...p, text: false })); }}
              placeholder="여기에 메시지를 남겨보세요..."
              maxLength={200}
              rows={3}
              className={`input-field resize-none ${errors.text ? 'error' : ''}`}
            />
            {errors.text && (
              <p className="font-body text-[0.78rem] text-red-400/80 mt-1 pl-1">메시지를 입력해주세요.</p>
            )}

            <div className="flex justify-between items-center mt-2.5">
              <span className="font-body text-[0.75rem] text-parchment-dim/30">
                {text.length} / 200
              </span>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !text.trim() || submitting}
                className={[
                  'font-magic text-[0.75rem] tracking-[0.1em] px-5 py-2',
                  'border border-gold/30 rounded-sm bg-gold/[0.06] transition-colors duration-300',
                  name.trim() && text.trim() && !submitting ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50',
                  submitted ? 'text-green-400' : 'text-gold',
                ].join(' ')}
              >
                {submitting ? '기록 중...' : submitted ? '기록됨 ✓' : '기록하기 ✦'}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded bg-gradient-to-br from-gold/5 to-gold/[0.02] border border-gold/20 px-6 py-6 text-center">
            <p className="font-display text-[0.95rem] text-parchment-dim/50 mb-4">
              방명록은 로그인한 사용자만 작성할 수 있습니다.
            </p>
            <Link to="/login">
              <button
                className="font-magic text-[0.75rem] tracking-[0.1em] px-6 py-2 border border-gold/30 rounded-sm bg-gold/[0.06] text-gold cursor-pointer"
              >
                로그인하기 ✦
              </button>
            </Link>
          </div>
        )}

        {/* 기존 메시지 목록 */}
        {messages.length > 0 && (
          <div className="mt-8 text-left">
            <div className="font-magic text-[0.7rem] tracking-[0.2em] text-parchment-dim/40 mb-4 text-center">
              — 방문자들의 흔적 —
            </div>
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isOwner = !!user && msg.uid === user.uid;
                const isEditing = editingId === msg.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-sm mb-2.5 bg-gold/[0.03] border border-gold/10 px-4 py-3"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-magic text-[0.75rem] text-gold tracking-[0.05em]">
                        {msg.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-[0.75rem] text-parchment-dim/30">
                          {formatDate(msg.createdAt)}
                        </span>
                        {isOwner && !isEditing && (
                          <>
                            <button
                              onClick={() => { setEditingId(msg.id); setEditText(msg.message); }}
                              className="font-body text-[0.7rem] text-parchment-dim/30 hover:text-gold/70 transition-colors duration-200"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(msg.id)}
                              className="font-body text-[0.7rem] text-parchment-dim/30 hover:text-red-400/70 transition-colors duration-200"
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isEditing ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          maxLength={200}
                          rows={3}
                          className="input-field resize-none mb-2"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="font-magic text-[0.7rem] tracking-[0.05em] px-3 py-1.5 border border-gold/20 rounded-sm text-parchment-dim/40 hover:text-parchment-dim/70 transition-colors duration-200"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleEditSave(msg.id)}
                            disabled={!editText.trim()}
                            className="font-magic text-[0.7rem] tracking-[0.05em] px-3 py-1.5 border border-gold/30 rounded-sm bg-gold/[0.06] text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-body text-[0.9rem] text-parchment-dim/70 leading-[1.6] m-0">
                        {msg.message}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* 하단 정보 */}
      <div className="text-center pt-8 border-t border-gold/10">
        <div className="gold-gradient-text mb-2 font-magic text-[0.85rem] font-bold tracking-[0.15em]">
          DEVSHELF
        </div>
        <p className="font-body text-[0.8rem] text-parchment-dim/40 mb-4">
          개발자의 서재 — 모든 코드는 하나의 이야기다
        </p>
        <div className="flex justify-center gap-6 mb-5">
          <Link to="/shelf" className="font-magic text-[0.72rem] tracking-[0.1em] text-parchment-dim/40 transition-colors duration-200">
            The Shelf
          </Link>
          <Link to="/#about" className="font-magic text-[0.72rem] tracking-[0.1em] text-parchment-dim/40 transition-colors duration-200">
            Our Story
          </Link>
          <Link to="/#guestbook" className="font-magic text-[0.72rem] tracking-[0.1em] text-parchment-dim/40 transition-colors duration-200">
            Guestbook
          </Link>
        </div>
      </div>
    </footer>
  );
}
