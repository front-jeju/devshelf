import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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
  uid?: string,
): Promise<void> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');
  await addDoc(collection(db, 'guestbook'), {
    name,
    message,
    uid: uid ?? null,
    createdAt: serverTimestamp(),
  });
}

export async function updateGuestbookMessage(
  id: string,
  message: string,
): Promise<void> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');
  await updateDoc(doc(db, 'guestbook', id), { message });
}

export async function deleteGuestbookMessage(id: string): Promise<void> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');
  await deleteDoc(doc(db, 'guestbook', id));
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
    const messages: GuestbookMessage[] = snapshot.docs.map((d) => ({
      id: d.id,
      uid: d.data().uid as string | undefined,
      name: d.data().name as string,
      message: d.data().message as string,
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }));
    callback(messages);
  });
}
