import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { GuestbookMessage } from '../types';

export async function addGuestbookMessage(
  name: string,
  message: string,
): Promise<void> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');
  await addDoc(collection(db, 'guestbook'), {
    name,
    message,
    createdAt: serverTimestamp(),
  });
}

export function subscribeGuestbookMessages(
  callback: (messages: GuestbookMessage[]) => void,
): Unsubscribe {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages: GuestbookMessage[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name as string,
      message: doc.data().message as string,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }));
    callback(messages);
  });
}
