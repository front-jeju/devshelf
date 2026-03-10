import { useState } from "react";
import { getGithubRepoData, parseRepoKey } from "@/services/githubService";
import { analyzeRepo } from "@/services/aiService";
import { getCachedAnalysis, setCachedAnalysis } from "@/services/firestoreService";
import { toErrorMessage } from "@/utils/errors";
import { ALL_STACKS } from "@/data/stacks";
import type { TechStack } from "@/types";

export interface AutofillResult {
  tagline: string;
  description: string;
  techStack: TechStack[];
}

function matchTechStacks(aiStacks: string[]): TechStack[] {
  return ALL_STACKS.filter((stack) =>
    aiStacks.some((s) => s.toLowerCase().includes(stack.toLowerCase()))
  );
}

export function useGithubAutofill(onAutofill: (result: AutofillResult) => void) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleUrlChange(_value: string) {
    setSuccess(false);
    setError("");
  }

  async function runAnalysis(targetUrl: string) {
    setError("");
    setSuccess(false);
    setIsAnalyzing(true);
    try {
      const cacheKey = parseRepoKey(targetUrl);
      const cached = await getCachedAnalysis(cacheKey);
      let result;
      if (cached) {
        result = cached;
      } else {
        const repoData = await getGithubRepoData(targetUrl);
        result = await analyzeRepo(repoData);
        setCachedAnalysis(cacheKey, result).catch(() => {});
      }
      onAutofill({
        tagline: result.oneLineDescription.slice(0, 60),
        description: result.detailedDescription,
        techStack: matchTechStacks(result.techStack),
      });
      setSuccess(true);
    } catch (e) {
      setError(toErrorMessage(e, "GitHub 분석에 실패했습니다."));
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleAutofillWithUrl(targetUrl: string) {
    if (!targetUrl.trim() || isAnalyzing) return;
    await runAnalysis(targetUrl.trim());
  }

  return { isAnalyzing, error, success, handleUrlChange, handleAutofillWithUrl };
}
