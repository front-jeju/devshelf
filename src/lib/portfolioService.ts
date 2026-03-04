import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Portfolio } from '../types/index';

export type PortfolioInput = Omit<Portfolio, 'id'> & { uid: string; label?: string };

export async function addPortfolio(data: PortfolioInput): Promise<string> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');
  const ref = await addDoc(collection(db, 'portfolios'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fetchPortfolios(): Promise<Portfolio[]> {
  if (!db) return [];
  const q = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Portfolio, 'id'>),
  }));
}
