import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AnalysisResult } from "@/services/aiService";

/**
 * 캐시된 AI 분석 결과를 조회합니다.
 * @param cacheKey - "owner__repo" 형태의 식별자
 */
export async function getCachedAnalysis(
  cacheKey: string
): Promise<AnalysisResult | null> {
  if (!db) return null;

  const snapshot = await getDoc(doc(db, "analysisCache", cacheKey));
  if (!snapshot.exists()) return null;

  return snapshot.data().result as AnalysisResult;
}

/**
 * AI 분석 결과를 Firestore에 캐싱합니다.
 * @param cacheKey - "owner__repo" 형태의 식별자
 */
export async function setCachedAnalysis(
  cacheKey: string,
  result: AnalysisResult
): Promise<void> {
  if (!db) return;

  await setDoc(doc(db, "analysisCache", cacheKey), {
    result,
    cachedAt: serverTimestamp(),
  });
}
