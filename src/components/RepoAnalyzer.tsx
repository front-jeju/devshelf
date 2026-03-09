import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGithubRepoData } from "@/services/githubService";
import { analyzeWithGemini, type GeminiAnalysisResult } from "@/services/geminiService";

type Status = "idle" | "fetching" | "analyzing" | "done" | "error";

export function RepoAnalyzer() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<GeminiAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const isLoading = status === "fetching" || status === "analyzing";

  const statusLabel: Record<Status, string> = {
    idle: "",
    fetching: "GitHub 정보를 가져오는 중...",
    analyzing: "Gemini가 분석하는 중...",
    done: "",
    error: "",
  };

  async function handleAnalyze() {
    if (!url.trim()) return;

    setStatus("fetching");
    setResult(null);
    setErrorMsg("");

    try {
      const repoData = await getGithubRepoData(url.trim());

      setStatus("analyzing");
      const analysis = await analyzeWithGemini(repoData);

      setResult(analysis);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
      setStatus("error");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isLoading) handleAnalyze();
  }

  return (
    <div className="card-dark w-full max-w-[600px]">
      <div className="card-top-bar" />

      <div className="p-9 px-8 flex flex-col gap-6">
        {/* 헤더 */}
        <div className="text-center">
          <div
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.75rem",
              color: "rgba(200,176,138,0.5)",
              letterSpacing: "0.25em",
              fontStyle: "italic",
              marginBottom: 8,
            }}
          >
            — AI 프로젝트 분석기 —
          </div>
          <h2
            className="gold-gradient-text"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            REPO ANALYZER
          </h2>
        </div>

        <div className="gold-divider" />

        {/* 입력 영역 */}
        <div className="flex flex-col gap-3">
          <label
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "rgba(200,176,138,0.6)",
            }}
          >
            GITHUB REPOSITORY URL
          </label>

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://github.com/owner/repo"
            disabled={isLoading}
            className="w-full bg-transparent outline-none"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.95rem",
              color: "rgba(200,176,138,0.9)",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: 2,
              padding: "10px 14px",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(212,175,55,0.6)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)")
            }
          />

          <motion.button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading || !url.trim()}
            whileHover={!isLoading && url.trim() ? { scale: 1.02 } : {}}
            whileTap={!isLoading && url.trim() ? { scale: 0.98 } : {}}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              fontWeight: 600,
              padding: "12px 0",
              borderRadius: 2,
              border: "1px solid rgba(212,175,55,0.4)",
              background:
                isLoading || !url.trim()
                  ? "rgba(212,175,55,0.05)"
                  : "rgba(212,175,55,0.12)",
              color:
                isLoading || !url.trim()
                  ? "rgba(200,176,138,0.3)"
                  : "rgba(212,175,55,0.9)",
              cursor: isLoading || !url.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {isLoading ? "ANALYZING..." : "ANALYZE →"}
          </motion.button>
        </div>

        {/* 로딩 상태 */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid rgba(212,175,55,0.15)",
                  borderTopColor: "#d4af37",
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.85rem",
                  color: "rgba(200,176,138,0.5)",
                  fontStyle: "italic",
                }}
              >
                {statusLabel[status]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 에러 */}
        <AnimatePresence>
          {status === "error" && (
            <motion.div
              className="error-box"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 분석 결과 */}
        <AnimatePresence>
          {status === "done" && result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              <div className="gold-divider" />

              {/* 프로젝트 제목 */}
              <div>
                <FieldLabel>PROJECT TITLE</FieldLabel>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "1.1rem",
                    color: "rgba(212,175,55,0.9)",
                  }}
                >
                  {result.projectTitle}
                </p>
              </div>

              {/* 한 줄 설명 */}
              <div>
                <FieldLabel>ONE LINE</FieldLabel>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.95rem",
                    color: "rgba(200,176,138,0.8)",
                    fontStyle: "italic",
                  }}
                >
                  {result.oneLineDescription}
                </p>
              </div>

              {/* 상세 설명 */}
              <div>
                <FieldLabel>DESCRIPTION</FieldLabel>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.9rem",
                    color: "rgba(200,176,138,0.7)",
                    lineHeight: 1.7,
                  }}
                >
                  {result.detailedDescription}
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <FieldLabel>MAIN FEATURES</FieldLabel>
                <ul className="flex flex-col gap-1.5">
                  {result.mainFeatures.map((feature, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.9rem",
                        color: "rgba(200,176,138,0.7)",
                      }}
                    >
                      <span style={{ color: "rgba(212,175,55,0.5)", marginRight: 8 }}>
                        ·
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 기술 스택 */}
              <div>
                <FieldLabel>TECH STACK</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {result.techStack.map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                        color: "rgba(212,175,55,0.7)",
                        border: "1px solid rgba(212,175,55,0.25)",
                        borderRadius: 2,
                        padding: "3px 10px",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "0.6rem",
        letterSpacing: "0.2em",
        color: "rgba(200,176,138,0.4)",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}
