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
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// responseSchema를 사용하면 Gemini가 항상 이 구조의 JSON을 반환하도록 강제되어
// 수동 파싱/검증 로직이 불필요해진다.
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    projectTitle:        { type: "STRING" },
    oneLineDescription:  { type: "STRING" },
    detailedDescription: { type: "STRING" },
    mainFeatures:        { type: "ARRAY", items: { type: "STRING" } },
    techStack:           { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "projectTitle",
    "oneLineDescription",
    "detailedDescription",
    "mainFeatures",
    "techStack",
  ],
} as const;

function buildPrompt(data: GeminiInput): string {
  return `너는 시니어 소프트웨어 엔지니어다.
다음 GitHub 프로젝트를 분석해라.

프로젝트 이름: ${data.name}
설명: ${data.description}
주요 언어: ${data.language}
README:
${data.readme}`;
}

export async function analyzeWithGemini(
  data: GeminiInput
): Promise<GeminiAnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "VITE_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
    );
  }

  let response: Response;
  try {
    response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(data) }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    });
  } catch {
    throw new Error("Gemini API: 네트워크 연결을 확인하세요.");
  }

  if (!response.ok) {
    throw new Error(httpStatusMessage(response.status, "Gemini API"));
  }

  const json = (await response.json()) as GeminiApiResponse;

  if (json.error) {
    throw new Error(`Gemini API 오류: ${json.error.message}`);
  }

  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!rawText) {
    throw new Error("Gemini API 응답에서 텍스트를 찾을 수 없습니다.");
  }

  // responseSchema가 구조를 보장하므로 별도 검증 없이 파싱
  return JSON.parse(rawText) as GeminiAnalysisResult;
}
