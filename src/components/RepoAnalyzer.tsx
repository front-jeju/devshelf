import { useState } from "react";
import { motion } from "framer-motion";

interface RepoAnalyzerProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function RepoAnalyzer({ onAnalyze, isLoading }: RepoAnalyzerProps) {
  const [url, setUrl] = useState("");

  function handleAnalyze() {
    if (!url.trim() || isLoading) return;
    onAnalyze(url.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAnalyze();
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

      </div>
    </div>
  );
}
