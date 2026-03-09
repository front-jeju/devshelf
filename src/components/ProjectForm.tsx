import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/PortfolioFormShared";
import { ALL_STACKS, STACK_ICONS } from "@/data/stacks";
import type { TechStack } from "@/types";
import type { GeminiAnalysisResult } from "@/services/geminiService";

interface ProjectFormData {
  title: string;
  description: string;
  techStack: TechStack[];
  features: string;
}

interface ProjectFormProps {
  analysis: GeminiAnalysisResult | null;
  onSubmit?: (data: ProjectFormData) => void;
}

function matchTechStacks(geminiStacks: string[]): TechStack[] {
  return ALL_STACKS.filter((stack) =>
    geminiStacks.some((s) => s.toLowerCase().includes(stack.toLowerCase()))
  );
}

export function ProjectForm({ analysis, onSubmit }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>({
    title: "",
    description: "",
    techStack: [],
    features: "",
  });

  // AI 결과가 들어오면 폼 자동완성
  useEffect(() => {
    if (!analysis) return;
    setForm({
      title: analysis.projectTitle,
      description: analysis.detailedDescription,
      techStack: matchTechStacks(analysis.techStack),
      features: analysis.mainFeatures.join("\n"),
    });
  }, [analysis]);

  function toggleStack(stack: TechStack) {
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(stack)
        ? prev.techStack.filter((s) => s !== stack)
        : [...prev.techStack, stack],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card-dark w-full max-w-[600px]"
    >
      <div className="card-top-bar" />

      <div className="p-9 px-8">
        {/* 헤더 */}
        <div className="text-center mb-7">
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
            — AI가 채운 정보를 확인하고 수정하세요 —
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
            PROJECT FORM
          </h2>
        </div>

        <div className="gold-divider mb-7" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 프로젝트 제목 */}
          <div>
            <SectionTitle>PROJECT TITLE</SectionTitle>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="프로젝트 이름을 입력하세요"
              className="input-field"
            />
          </div>

          {/* 프로젝트 설명 */}
          <div>
            <SectionTitle>DESCRIPTION</SectionTitle>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="프로젝트 설명을 입력하세요"
              rows={4}
              className="input-field"
              style={{ resize: "vertical", minHeight: 100, lineHeight: 1.7 }}
            />
          </div>

          {/* 기술 스택 */}
          <div>
            <SectionTitle>TECH STACK</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {ALL_STACKS.map((stack) => {
                const selected = form.techStack.includes(stack);
                return (
                  <motion.button
                    key={stack}
                    type="button"
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleStack(stack)}
                    className="flex items-center gap-1.5"
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.88rem",
                      letterSpacing: "0.04em",
                      padding: "6px 14px",
                      borderRadius: 2,
                      cursor: "pointer",
                      border: selected
                        ? "1px solid #d4af37"
                        : "1px solid rgba(212,175,55,0.2)",
                      background: selected
                        ? "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))"
                        : "rgba(212,175,55,0.03)",
                      color: selected ? "#f0c040" : "rgba(200,176,138,0.6)",
                      boxShadow: selected
                        ? "0 0 10px rgba(212,175,55,0.15)"
                        : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    <span>{STACK_ICONS[stack]}</span>
                    {stack}
                    {selected && (
                      <span style={{ marginLeft: 2, fontSize: "0.7rem" }}>✓</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            {form.techStack.length === 0 && (
              <p
                style={{
                  marginTop: 10,
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.8rem",
                  color: "rgba(200,176,138,0.3)",
                  fontStyle: "italic",
                }}
              >
                사용하는 기술 스택을 선택하세요 (복수 선택 가능)
              </p>
            )}
          </div>

          {/* 핵심 기능 */}
          <div>
            <SectionTitle>MAIN FEATURES</SectionTitle>
            <textarea
              value={form.features}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, features: e.target.value }))
              }
              placeholder={"기능을 한 줄에 하나씩 입력하세요\n예: 사용자 인증\n예: 실시간 알림"}
              rows={5}
              className="input-field"
              style={{ resize: "vertical", minHeight: 120, lineHeight: 1.8 }}
            />
            <p
              style={{
                marginTop: 6,
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.78rem",
                color: "rgba(200,176,138,0.3)",
                fontStyle: "italic",
              }}
            >
              * 줄바꿈으로 기능을 구분합니다
            </p>
          </div>

          {/* 제출 버튼 */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-gold mt-1"
          >
            저장하기 →
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
