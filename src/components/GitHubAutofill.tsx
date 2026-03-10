import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGithubRepoData, parseRepoKey } from "@/services/githubService";
import { analyzeWithGemini } from "@/services/geminiService";
import { getCachedAnalysis, setCachedAnalysis } from "@/services/firestoreService";
import { toErrorMessage } from "@/utils/errors";
import { ALL_STACKS } from "@/data/stacks";
import type { TechStack } from "@/types";

export interface AutofillResult {
  tagline: string;
  description: string;
  techStack: TechStack[];
}

interface GitHubAutofillProps {
  onAutofill: (result: AutofillResult) => void;
}

function matchTechStacks(geminiStacks: string[]): TechStack[] {
  return ALL_STACKS.filter((stack) =>
    geminiStacks.some((s) => s.toLowerCase().includes(stack.toLowerCase()))
  );
}

function useGithubAutofill(onAutofill: (result: AutofillResult) => void) {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleUrlChange(value: string) {
    setUrl(value);
    setSuccess(false);
    setError("");
  }

  async function handleAutofill() {
    if (!url.trim() || isAnalyzing) return;
    setError("");
    setSuccess(false);
    setIsAnalyzing(true);
    setRetryAttempt(0);
    try {
      const cacheKey = parseRepoKey(url.trim());
      const cached = await getCachedAnalysis(cacheKey);
      let result;
      if (cached) {
        result = cached;
      } else {
        const repoData = await getGithubRepoData(url.trim());
        result = await analyzeWithGemini(repoData, setRetryAttempt);
        setCachedAnalysis(cacheKey, result).catch(() => {});
      }
      onAutofill({
        tagline: result.oneLineDescription.slice(0, 60),
        description: result.detailedDescription,
        techStack: matchTechStacks(result.techStack),
      });
      setSuccess(true);
      setUrl("");
    } catch (e) {
      setError(toErrorMessage(e, "GitHub 분석에 실패했습니다."));
    } finally {
      setIsAnalyzing(false);
      setRetryAttempt(0);
    }
  }

  const buttonLabel = isAnalyzing
    ? retryAttempt > 0
      ? `재시도 중 (${retryAttempt}/2)`
      : "분석 중"
    : "자동완성 →";

  return { url, isAnalyzing, error, success, buttonLabel, handleUrlChange, handleAutofill };
}

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        border: "1.5px solid rgba(212,175,55,0.2)",
        borderTopColor: "#d4af37",
        borderRadius: "50%",
      }}
    />
  );
}

export function GitHubAutofill({ onAutofill }: GitHubAutofillProps) {
  const { url, isAnalyzing, error, success, buttonLabel, handleUrlChange, handleAutofill } =
    useGithubAutofill(onAutofill);
  const isDisabled = isAnalyzing || !url.trim();

  return (
    <div
      style={{
        border: "1px solid rgba(212,175,55,0.15)",
        borderRadius: 3,
        background: "rgba(212,175,55,0.03)",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.62rem",
          letterSpacing: "0.18em",
          color: "rgba(212,175,55,0.55)",
        }}
      >
        AI 자동완성 — GITHUB REPO URL 입력
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAutofill()}
          placeholder="https://github.com/owner/repo"
          disabled={isAnalyzing}
          className="input-field"
          style={{ flex: 1, margin: 0, fontSize: "0.85rem" }}
        />
        <motion.button
          type="button"
          onClick={handleAutofill}
          disabled={isDisabled}
          whileHover={!isDisabled ? { scale: 1.03 } : {}}
          whileTap={!isDisabled ? { scale: 0.97 } : {}}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            fontWeight: 600,
            padding: "0 16px",
            borderRadius: 2,
            border: "1px solid rgba(212,175,55,0.4)",
            background: isDisabled ? "rgba(212,175,55,0.04)" : "rgba(212,175,55,0.12)",
            color: isDisabled ? "rgba(200,176,138,0.3)" : "rgba(212,175,55,0.9)",
            cursor: isDisabled ? "not-allowed" : "pointer",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {isAnalyzing ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Spinner />
              {buttonLabel}
            </span>
          ) : (
            buttonLabel
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.8rem",
              color: "rgba(248,113,113,0.8)",
              margin: 0,
            }}
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            key="success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.8rem",
              color: "rgba(52,211,153,0.8)",
              margin: 0,
            }}
          >
            ✓ 자동완성 완료 — 내용을 확인하고 필요 시 수정해주세요.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
