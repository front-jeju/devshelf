import { motion } from "framer-motion";
import type { GeminiAnalysisResult } from "@/services/geminiService";

interface AnalysisResultProps {
  result: GeminiAnalysisResult;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card-dark w-full max-w-[600px]"
    >
      <div className="card-top-bar" />

      <div className="p-9 px-8 flex flex-col gap-7">
        {/* 프로젝트 제목 */}
        <div className="text-center">
          <h3
            className="gold-gradient-text"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            {result.projectTitle}
          </h3>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.9rem",
              color: "rgba(200,176,138,0.55)",
              marginTop: 6,
            }}
          >
            {result.oneLineDescription}
          </p>
        </div>

        <div className="gold-divider" />

        {/* 프로젝트 요약 */}
        <Section icon="📘" label="프로젝트 요약">
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.95rem",
              color: "rgba(200,176,138,0.75)",
              lineHeight: 1.75,
            }}
          >
            {result.detailedDescription}
          </p>
        </Section>

        <div className="gold-divider" />

        {/* 기술 스택 */}
        <Section icon="⚙" label="기술 스택">
          <div className="flex flex-wrap gap-2">
            {result.techStack.map((tech, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: "rgba(212,175,55,0.85)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: 2,
                  padding: "4px 12px",
                  background: "rgba(212,175,55,0.06)",
                }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </Section>

        <div className="gold-divider" />

        {/* 핵심 기능 */}
        <Section icon="🧩" label="핵심 기능">
          <ul className="flex flex-col gap-2.5">
            {result.mainFeatures.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <span
                  style={{
                    color: "rgba(212,175,55,0.45)",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.7rem",
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                >
                  ·
                </span>
                <span
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.95rem",
                    color: "rgba(200,176,138,0.75)",
                    lineHeight: 1.6,
                  }}
                >
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </Section>
      </div>
    </motion.div>
  );
}

interface SectionProps {
  icon: string;
  label: string;
  children: React.ReactNode;
}

function Section({ icon, label, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span style={{ fontSize: "0.95rem" }}>{icon}</span>
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "rgba(200,176,138,0.5)",
          }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
