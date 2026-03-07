/**
 * guestbookService.ts
 * Firestore 'guestbook' 컬렉션에 대한 CRUD 및 실시간 구독 함수 모음입니다.
 *
 * portfolioService.ts와의 차이점:
 *   - 방명록은 실시간 업데이트가 필요하므로 getDocs 대신 onSnapshot을 사용합니다.
 *   - onSnapshot은 Firestore 문서 변경 시 콜백을 자동으로 재호출합니다.
 */
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,      // 실시간 리스너 — DB 변경 시 콜백 자동 실행
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { GuestbookMessage } from '../types';

/**
 * 새 방명록 메시지를 Firestore에 추가합니다.
 * @param name    - 작성자 이름
 * @param message - 메시지 본문
 * @param uid     - 로그인 사용자 uid (비로그인 시 생략)
 */
export async function addGuestbookMessage(
  name: string,
  message: string,
  uid?: string,
): Promise<void> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');
  await addDoc(collection(db, 'guestbook'), {
    name,
    message,
    uid: uid ?? null,       // 비로그인 작성자는 null로 저장
    createdAt: serverTimestamp(),
  });
}

/**
 * 기존 방명록 메시지의 본문을 수정합니다.
 * @param id      - 수정할 문서의 Firestore ID
 * @param message - 새 메시지 본문
 */
export async function updateGuestbookMessage(
  id: string,
  message: string,
): Promise<void> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');
  await updateDoc(doc(db, 'guestbook', id), { message });
}

/**
 * 방명록 메시지를 영구 삭제합니다.
 * @param id - 삭제할 문서의 Firestore ID
 */
export async function deleteGuestbookMessage(id: string): Promise<void> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');
  await deleteDoc(doc(db, 'guestbook', id));
}

/**
 * 방명록 메시지 목록을 실시간으로 구독합니다.
 * Firestore 문서가 추가·수정·삭제될 때마다 callback이 자동 호출됩니다.
 *
 * 로직 흐름:
 *   구독 시작 → onSnapshot 리스너 등록
 *   DB 변경 발생 → snapshot 수신 → GuestbookMessage[] 변환 → callback 호출
 *   컴포넌트 언마운트 → 반환된 Unsubscribe 함수 호출 → 리스너 해제 (메모리 누수 방지)
 *
 * @param callback - 메시지 배열을 받는 콜백 함수
 * @returns 구독 해제 함수 (useEffect의 cleanup에서 호출하세요)
 */
export function subscribeGuestbookMessages(
  callback: (messages: GuestbookMessage[]) => void,
): Unsubscribe {
  if (!db) {
    // Firebase 미설정 시 빈 배열을 즉시 전달하고 noop 함수 반환
    callback([]);
    return () => {};
  }
  // createdAt 내림차순(최신 순)으로 정렬
  const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages: GuestbookMessage[] = snapshot.docs.map((d) => ({
      id: d.id,
      uid: d.data().uid as string | undefined,
      name: d.data().name as string,
      message: d.data().message as string,
      // Firestore Timestamp → JS Date → ISO 문자열 변환
      // createdAt이 아직 null인 경우(서버 타임스탬프 지연) 현재 시각으로 대체
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }));
    callback(messages);
  });
}
