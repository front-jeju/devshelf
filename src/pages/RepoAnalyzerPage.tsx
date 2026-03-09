import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingParticles } from "@/components/FloatingParticles";
import { RepoAnalyzer } from "@/components/RepoAnalyzer";
import { AnalysisResult } from "@/components/AnalysisResult";
import { ProjectForm } from "@/components/ProjectForm";
import { useRepoAnalyzer } from "@/hooks/useRepoAnalyzer";

const STEP_LABEL: Record<string, string> = {
  fetching:  "GitHub 정보를 가져오는 중...",
  analyzing: "Gemini가 분석하는 중...",
  saving:    "Firestore에 저장하는 중...",
};

export function RepoAnalyzerPage() {
  const { step, retrying, analysis, savedId, errorMsg, analyze, save, reset } =
    useRepoAnalyzer();

  const isLoading = step === "fetching" || step === "analyzing" || step === "saving";
  const stepLabel = retrying ? "요청 한도 초과 — 잠시 후 재시도 중..." : STEP_LABEL[step];

  return (
    <div className="page-bg-flex py-16">
      <FloatingParticles />
      <div className="page-overlay" />
      <div className="gold-top-line" />

      {/* 로고 */}
      <motion.div
        className="relative z-[2] mb-9 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/">
          <div className="flex items-center gap-3 justify-center">
            <div>
              <div className="logo-title">DEVSHELF</div>
              <div className="logo-subtitle">개발자의 서재</div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 콘텐츠 */}
      <div className="relative z-[2] w-full max-w-[600px] px-6 flex flex-col gap-6">

        {/* ── 1단계: URL 입력 ── */}
        <RepoAnalyzer onAnalyze={analyze} isLoading={isLoading} />

        {/* ── 로딩 상태 표시 ── */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
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
                }}
              >
                {stepLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 에러 표시 ── */}
        <AnimatePresence>
          {step === "error" && (
            <motion.div
              key="error"
              className="error-box"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p>{errorMsg}</p>
              <button
                onClick={reset}
                style={{
                  marginTop: 8,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  color: "rgba(212,175,55,0.7)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← 다시 시도
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 2단계: 분석 결과 표시 ── */}
        <AnimatePresence>
          {(step === "review" || step === "saving" || step === "done") &&
            analysis && (
              <AnalysisResult key="analysis-result" result={analysis} />
            )}
        </AnimatePresence>

        {/* ── 3단계: 폼 자동완성 + 저장 ── */}
        <AnimatePresence>
          {(step === "review" || step === "saving") && analysis && (
            <ProjectForm
              key="project-form"
              analysis={analysis}
              onSubmit={save}
              isSubmitting={step === "saving"}
            />
          )}
        </AnimatePresence>

        {/* ── 4단계: 저장 완료 ── */}
        <AnimatePresence>
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="card-dark w-full"
            >
              <div className="card-top-bar" />
              <div className="p-9 px-8 text-center flex flex-col gap-5">
                <div
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.75rem",
                    color: "rgba(200,176,138,0.5)",
                    letterSpacing: "0.25em",
                  }}
                >
                  — 저장 완료 —
                </div>
                <h3
                  className="gold-gradient-text"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  PROJECT SAVED
                </h3>
                {savedId && (
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.8rem",
                      color: "rgba(200,176,138,0.35)",
                    }}
                  >
                    ID: {savedId}
                  </p>
                )}
                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={reset}
                    className="btn-ghost"
                    style={{ padding: "11px 22px", fontSize: "0.7rem" }}
                  >
                    ← 새 프로젝트 분석
                  </motion.button>
                  <Link to="/shelf">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-gold"
                      style={{ padding: "11px 22px", fontSize: "0.7rem" }}
                    >
                      서재 보기 →
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
