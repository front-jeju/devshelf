import type { GithubRepoData } from "@/services/githubService";

export interface AnalysisResult {
  projectTitle: string;
  oneLineDescription: string;
  detailedDescription: string;
  mainFeatures: string[];
  techStack: string[];
}

type AnalysisInput = Pick<GithubRepoData, "name" | "description" | "language" | "readme">;

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIResponse {
  choices?: { message: { content: string } }[];
}

const API_URL = "https://dev.wenivops.co.kr/services/openai-api";

const SYSTEM_PROMPT = `너는 시니어 소프트웨어 엔지니어다.
GitHub 프로젝트를 분석하고 반드시 아래 JSON 형식으로만 응답해라. 다른 텍스트는 포함하지 마라.

{
  "projectTitle": "프로젝트 제목",
  "oneLineDescription": "한 줄 설명 (60자 이내)",
  "detailedDescription": "프로젝트 상세 설명",
  "mainFeatures": ["주요 기능1", "주요 기능2"],
  "techStack": ["기술스택1", "기술스택2"]
}`;

function buildMessages(data: AnalysisInput): OpenAIMessage[] {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `프로젝트 이름: ${data.name}
설명: ${data.description}
주요 언어: ${data.language}
README:
${data.readme}`,
    },
  ];
}

function parseContent(content: string): AnalysisResult {
  // 모델이 JSON을 마크다운 코드블록으로 감쌀 경우 제거
  const cleaned = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(cleaned) as AnalysisResult;
}

export async function analyzeRepo(
  data: AnalysisInput,
): Promise<AnalysisResult> {
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildMessages(data)),
    });
  } catch {
    throw new Error("AI 분석 서버에 연결할 수 없습니다. 네트워크를 확인하세요.");
  }

  if (!response.ok) {
    throw new Error(`AI 분석 서버 오류 (${response.status})`);
  }

  const json = (await response.json()) as OpenAIResponse;
  const content = json.choices?.[0]?.message?.content ?? "";

  if (!content) {
    throw new Error("AI 응답에서 텍스트를 찾을 수 없습니다.");
  }

  try {
    return parseContent(content);
  } catch {
    throw new Error("AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.");
  }
}
