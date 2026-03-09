import { useState, useCallback, useRef } from "react";
import { getGithubRepoData, parseRepoKey } from "@/services/githubService";
import { analyzeWithGemini, type GeminiAnalysisResult } from "@/services/geminiService";
import { addProject, getCachedAnalysis, setCachedAnalysis, type ProjectData } from "@/services/firestoreService";
import { toErrorMessage } from "@/utils/errors";

export type Step =
  | "idle"       // 초기 상태
  | "fetching"   // GitHub API 호출 중
  | "analyzing"  // Gemini 분석 중
  | "review"     // 결과 확인 + 폼 수정
  | "saving"     // Firestore 저장 중
  | "done"       // 저장 완료
  | "error";     // 오류 발생

export interface UseRepoAnalyzerReturn {
  step: Step;
  retrying: boolean;
  analysis: GeminiAnalysisResult | null;
  savedId: string | null;
  errorMsg: string;
  analyze: (url: string) => Promise<void>;
  save: (data: ProjectData) => Promise<void>;
  reset: () => void;
}

export function useRepoAnalyzer(): UseRepoAnalyzerReturn {
  const [step, setStep] = useState<Step>("idle");
  const [retrying, setRetrying] = useState(false);
  const [analysis, setAnalysis] = useState<GeminiAnalysisResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // step의 최신 값을 ref로 추적 — useCallback [] 클로저의 stale closure 방지
  const stepRef = useRef(step);
  stepRef.current = step;

  const handleError = useCallback((e: unknown, fallback: string) => {
    setErrorMsg(toErrorMessage(e, fallback));
    setStep("error");
  }, []);

  /** 1단계·2단계: GitHub → Gemini (캐시 우선) */
  const analyze = useCallback(async (url: string) => {
    if (stepRef.current === "fetching" || stepRef.current === "analyzing") return;

    setErrorMsg("");
    setAnalysis(null);
    setSavedId(null);

    try {
      setStep("fetching");

      // 캐시 확인 — 동일 레포는 Gemini를 재호출하지 않음
      const cacheKey = parseRepoKey(url);
      const cached = await getCachedAnalysis(cacheKey);
      if (cached) {
        setAnalysis(cached);
        setStep("review");
        return;
      }

      const repoData = await getGithubRepoData(url);

      setStep("analyzing");
      const result = await analyzeWithGemini(repoData, () => setRetrying(true));

      // 결과 캐싱 (실패해도 분석 결과는 정상 반환)
      setCachedAnalysis(cacheKey, result).catch(() => {});

      setRetrying(false);
      setAnalysis(result);
      setStep("review");
    } catch (e) {
      setRetrying(false);
      handleError(e, "분석 중 오류가 발생했습니다.");
    }
  }, [handleError]);

  /** 3단계: Firestore 저장 */
  const save = useCallback(async (data: ProjectData) => {
    try {
      setStep("saving");
      const id = await addProject(data);
      setSavedId(id);
      setStep("done");
    } catch (e) {
      handleError(e, "저장 중 오류가 발생했습니다.");
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setStep("idle");
    setRetrying(false);
    setAnalysis(null);
    setSavedId(null);
    setErrorMsg("");
  }, []);

  return { step, retrying, analysis, savedId, errorMsg, analyze, save, reset };
}
