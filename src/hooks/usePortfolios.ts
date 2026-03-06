/**
 * usePortfolios.ts
 * 서재(ShelfPage)에서 포트폴리오 목록을 관리하는 커스텀 훅입니다.
 *
 * 커스텀 훅이란?
 * - 'use'로 시작하는 함수로, React의 상태(useState)와 부수효과(useEffect)를
 *   컴포넌트 밖으로 분리해서 재사용하기 좋게 만든 것입니다.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchPortfolios } from '../lib/portfolioService';
import type { Portfolio } from '../types/index';
import portfoliosData from '../data/portfolios.json';

// 모듈 스코프 캐시: 페이지 이동 후 돌아와도 재fetch하지 않음
let cachedPortfolios: Portfolio[] | null = null;

export function usePortfolios() {
  // portfolios: 화면에 표시할 포트폴리오 목록
  const [portfolios, setPortfolios] = useState<Portfolio[]>(cachedPortfolios ?? []);
  // loading: 데이터를 불러오는 중인지 여부 (true면 로딩 스피너 표시)
  const [loading, setLoading] = useState(cachedPortfolios === null);

  useEffect(() => {
    // 캐시가 있으면 fetch 생략
    if (cachedPortfolios !== null) return;

    // 컴포넌트가 처음 화면에 나타날 때 Firestore에서 데이터를 불러옵니다
    fetchPortfolios()
      .then((firestoreData) => {
        // 개발 환경에서만 정적 데모 데이터를 함께 표시
        const merged = import.meta.env.DEV
          ? [...firestoreData, ...(portfoliosData as Portfolio[])]
          : firestoreData;
        cachedPortfolios = merged;
        setPortfolios(merged);
      })
      .catch(() => {
        // Firestore 연결 실패 시 개발 환경에서만 정적 JSON 데이터 표시
        cachedPortfolios = import.meta.env.DEV ? (portfoliosData as Portfolio[]) : [];
        setPortfolios(cachedPortfolios);
      })
      .finally(() => setLoading(false)); // 성공/실패 모두 로딩 종료
  }, []); // [] 빈 배열: 컴포넌트 마운트 시 딱 한 번만 실행

  /**
   * 삭제된 포트폴리오를 목록에서 제거합니다.
   * Firestore에서 삭제한 후 이 함수를 호출하면, 페이지를 새로고침하지 않아도
   * 화면에서 즉시 사라집니다. (낙관적 업데이트)
   *
   * useCallback을 쓰는 이유:
   * - 이 함수를 자식 컴포넌트에 props로 넘길 때, 매 렌더링마다 새 함수가
   *   생성되는 것을 방지해 불필요한 리렌더링을 막습니다.
   */
  const removePortfolio = useCallback((id: string) => {
    setPortfolios((prev) => {
      const next = prev.filter((p) => p.id !== id);
      cachedPortfolios = next;
      return next;
    });
  }, []);

  return { portfolios, loading, removePortfolio };
}
