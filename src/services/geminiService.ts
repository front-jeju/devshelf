import type { GithubRepoData } from "@/services/githubService";
import { httpStatusMessage } from "@/utils/errors";

export interface GeminiAnalysisResult {
  projectTitle: string;
  oneLineDescription: string;
  detailedDescription: string;
  mainFeatures: string[];
  techStack: string[];
}

// Gemini API 응답 원본 타입
interface GeminiPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiPart[];
}

interface GeminiCandidate {
  content: GeminiContent;
}

interface GeminiApiResponse {
  candidates?: GeminiCandidate[];
  error?: { message: string; code: number };
}

type GeminiInput = Pick<GithubRepoData, "name" | "description" | "language" | "readme">;

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

function buildPrompt(data: GeminiInput): string {
  return `너는 시니어 소프트웨어 엔지니어다.
다음 GitHub 프로젝트를 분석해라.

프로젝트 이름: ${data.name}
설명: ${data.description}
주요 언어: ${data.language}
README:
${data.readme}

반드시 아래 JSON 형식으로만 응답해라. 다른 텍스트는 포함하지 마라.
{
  "projectTitle": "프로젝트 제목",
  "oneLineDescription": "한 줄 설명",
  "detailedDescription": "상세 설명",
  "mainFeatures": ["기능1", "기능2"],
  "techStack": ["기술1", "기술2"]
}`;
}

function isValidAnalysisResult(value: unknown): value is GeminiAnalysisResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.projectTitle === "string" &&
    typeof v.oneLineDescription === "string" &&
    typeof v.detailedDescription === "string" &&
    Array.isArray(v.mainFeatures) &&
    Array.isArray(v.techStack)
  );
}

export async function analyzeWithGemini(
  data: GeminiInput
): Promise<GeminiAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
  }

  let response: Response;
  try {
    response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(data) }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });
  } catch {
    throw new Error("Gemini API: 네트워크 연결을 확인하세요.");
  }

  if (!response.ok) {
    throw new Error(httpStatusMessage(response.status, "Gemini API"));
  }

  const json = (await response.json()) as GeminiApiResponse;

  // API 레벨 에러 (200 OK지만 error 필드가 있는 경우)
  if (json.error) {
    throw new Error(`Gemini API 오류: ${json.error.message}`);
  }

  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!rawText) {
    throw new Error("Gemini API 응답에서 텍스트를 찾을 수 없습니다.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(`Gemini 응답 JSON 파싱 실패:\n${rawText.slice(0, 200)}`);
  }

  if (!isValidAnalysisResult(parsed)) {
    throw new Error("Gemini 응답이 예상된 형식이 아닙니다.");
  }

  return parsed;
}
