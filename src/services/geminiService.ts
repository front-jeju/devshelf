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
  error?: { message: string; code: number; status?: string };
}

type GeminiInput = Pick<GithubRepoData, "name" | "description" | "language" | "readme">;

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";

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

// 429 시 최대 2회 재시도 — 4s / 8s 간격
// RPM(분당 초과)이면 재시도 성공, RPD(일일 소진)이면 모두 실패 후 에러
const RETRY_DELAYS_MS = [15000, 30000];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchGemini(
  key: string,
  body: string,
  onRetry?: (attempt: number) => void,
): Promise<Response> {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (response.status !== 429) return response;

    if (attempt === RETRY_DELAYS_MS.length) {
      throw new Error(
        "Gemini API: 요청 한도를 초과했습니다. 잠시 후 다시 시도하거나, 오늘 한도가 소진된 경우 내일 다시 시도하세요. (429)"
      );
    }

    onRetry?.(attempt + 1);
    await delay(RETRY_DELAYS_MS[attempt]);
  }

  throw new Error("Gemini API: 알 수 없는 오류가 발생했습니다.");
}

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
  data: GeminiInput,
  onRetry?: (attempt: number) => void,
): Promise<GeminiAnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "VITE_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
    );
  }

  const body = JSON.stringify({
    contents: [{ parts: [{ text: buildPrompt(data) }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  let response: Response;
  try {
    response = await fetchGemini(GEMINI_API_KEY, body, onRetry);
  } catch (e) {
    // fetchGemini가 던진 에러(429 분류 포함)는 그대로 전파
    if (e instanceof Error) throw e;
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
