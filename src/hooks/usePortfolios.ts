import { useState, useEffect } from 'react';
import { fetchPortfolios } from '../lib/portfolioService';
import type { Portfolio } from '../types/index';
import portfoliosData from '../data/portfolios.json';

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios()
      .then((firestoreData) => {
        // Firestore 데이터를 앞에, 정적 데모 데이터를 뒤에 배치
        setPortfolios([...firestoreData, ...(portfoliosData as Portfolio[])]);
      })
      .catch(() => {
        setPortfolios(portfoliosData as Portfolio[]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { portfolios, loading };
}
