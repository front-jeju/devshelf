/**
 * portfolioService.ts
 * Firebase Firestore와 통신하는 함수들을 모아둔 파일입니다.
 * 포트폴리오의 생성(C), 읽기(R), 수정(U), 삭제(D) 기능을 담당합니다.
 */

import {
  collection,   // 컬렉션(폴더 같은 개념) 참조를 만드는 함수
  addDoc,       // 새 문서를 추가하는 함수
  getDocs,      // 여러 문서를 가져오는 함수
  getDoc,       // 문서 하나를 가져오는 함수
  updateDoc,    // 문서를 수정하는 함수
  deleteDoc,    // 문서를 삭제하는 함수
  doc,          // 특정 문서의 참조를 만드는 함수
  serverTimestamp, // 서버 시간을 자동으로 저장하는 함수
  query,        // 쿼리(조건부 검색)를 만드는 함수
  orderBy,      // 정렬 조건을 추가하는 함수
} from 'firebase/firestore';
import { db } from './firebase';
import type { Portfolio } from '../types/index';

/**
 * 포트폴리오 등록에 필요한 데이터 타입
 * Portfolio에서 'id'를 제외하고 (id는 Firestore가 자동 생성),
 * 등록자의 uid와 선택적 label을 추가합니다.
 */
export type PortfolioInput = Omit<Portfolio, 'id'> & { uid: string; label?: string };

/**
 * 새 포트폴리오를 Firestore에 저장합니다.
 * @param data - 저장할 포트폴리오 데이터
 * @returns 생성된 문서의 ID
 */
export async function addPortfolio(data: PortfolioInput): Promise<string> {
  // db가 없으면 Firebase 설정이 안 된 것이므로 에러를 던집니다
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');

  // Firestore의 'portfolios' 컬렉션에 새 문서를 추가합니다
  const ref = await addDoc(collection(db, 'portfolios'), {
    ...data,
    createdAt: serverTimestamp(), // 저장 시각을 서버 시간으로 자동 기록
  });

  return ref.id; // 새로 생성된 문서의 고유 ID를 반환
}

/**
 * Firestore에서 모든 포트폴리오를 가져옵니다.
 * 최신 등록 순으로 정렬하여 반환합니다.
 * @returns 포트폴리오 배열
 */
export async function fetchPortfolios(): Promise<Portfolio[]> {
  // db가 없으면 빈 배열을 반환합니다 (에러 없이 gracefully 처리)
  if (!db) return [];

  // 'portfolios' 컬렉션에서 createdAt 기준 내림차순(최신순) 쿼리를 만듭니다
  const q = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  // 각 문서를 Portfolio 타입으로 변환하여 배열로 반환합니다
  return snapshot.docs.map((doc) => ({
    id: doc.id,                              // 문서 ID를 id로 저장
    ...(doc.data() as Omit<Portfolio, 'id'>), // 나머지 필드들
  }));
}

/**
 * 특정 ID의 포트폴리오 하나를 Firestore에서 가져옵니다.
 * 수정 페이지에서 기존 데이터를 불러올 때 사용합니다.
 * @param id - 가져올 문서의 ID
 * @returns 포트폴리오 데이터 (없으면 null)
 */
export async function getPortfolioById(id: string): Promise<Portfolio | null> {
  if (!db) return null;

  // doc(db, '컬렉션명', '문서ID') 로 특정 문서를 가리킵니다
  const docRef = doc(db, 'portfolios', id);
  const snapshot = await getDoc(docRef);

  // 문서가 존재하지 않으면 null 반환
  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Portfolio, 'id'>),
  };
}

/**
 * 기존 포트폴리오를 수정합니다.
 * Firestore의 updateDoc은 전달한 필드만 업데이트하고 나머지는 유지합니다.
 * @param id - 수정할 문서의 ID
 * @param data - 수정할 필드들
 */
export async function updatePortfolio(
  id: string,
  data: Partial<PortfolioInput>,
): Promise<void> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');

  const docRef = doc(db, 'portfolios', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(), // 수정 시각도 기록합니다
  });
}

/**
 * 포트폴리오를 Firestore에서 영구 삭제합니다.
 * 삭제 후에는 복구할 수 없으므로 UI에서 확인 단계를 거쳐야 합니다.
 * @param id - 삭제할 문서의 ID
 */
export async function deletePortfolio(id: string): Promise<void> {
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.');

  const docRef = doc(db, 'portfolios', id);
  await deleteDoc(docRef);
}
