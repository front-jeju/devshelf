import { useState } from "react";
import { getGithubRepoData } from "@/services/githubService";
import { analyzeWithGemini, type GeminiAnalysisResult } from "@/services/geminiService";
import { addProject, type ProjectData } from "@/services/firestoreService";

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
  analysis: GeminiAnalysisResult | null;
  savedId: string | null;
  errorMsg: string;
  analyze: (url: string) => Promise<void>;
  save: (data: ProjectData) => Promise<void>;
  reset: () => void;
}

export function useRepoAnalyzer(): UseRepoAnalyzerReturn {
  const [step, setStep] = useState<Step>("idle");
  const [analysis, setAnalysis] = useState<GeminiAnalysisResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  /** 1단계·2단계: GitHub → Gemini */
  async function analyze(url: string) {
    setErrorMsg("");
    setAnalysis(null);
    setSavedId(null);

    try {
      setStep("fetching");
      const repoData = await getGithubRepoData(url);

      setStep("analyzing");
      const result = await analyzeWithGemini(repoData);

      setAnalysis(result);
      setStep("review");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "분석 중 오류가 발생했습니다.");
      setStep("error");
    }
  }

  /** 3단계: Firestore 저장 */
  async function save(data: ProjectData) {
    try {
      setStep("saving");
      const id = await addProject(data);
      setSavedId(id);
      setStep("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.");
      setStep("error");
    }
  }

  function reset() {
    setStep("idle");
    setAnalysis(null);
    setSavedId(null);
    setErrorMsg("");
  }

  return { step, analysis, savedId, errorMsg, analyze, save, reset };
}
