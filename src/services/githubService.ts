import { parseGithubUrl } from "@/utils/parseGithubUrl";
import { httpStatusMessage } from "@/utils/errors";

export interface GithubRepoData {
  name: string;
  description: string;
  language: string;
  readme: string;
}

interface GithubRepoResponse {
  name: string;
  description: string | null;
  language: string | null;
  message?: string; // GitHub API 오류 응답 시 포함되는 필드
}

interface GithubReadmeResponse {
  content: string;
  encoding: string;
}

const README_MAX_LENGTH = 6000;

// VITE_GITHUB_TOKEN을 설정하면 인증 요청으로 레이트 리밋이 60→5000 req/h로 증가한다.
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

const GITHUB_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

async function fetchGithubJson<T>(url: string, context: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, { headers: GITHUB_HEADERS });
  } catch {
    throw new Error(`${context}: 네트워크 연결을 확인하세요.`);
  }

  if (!response.ok) {
    throw new Error(httpStatusMessage(response.status, context));
  }

  return response.json() as Promise<T>;
}

// AI 분석에 불필요한 노이즈를 제거하고 토큰 예산을 실제 내용에 집중시킨다.
function trimReadme(raw: string): string {
  return raw
    .replace(/^\[!\[.*?\]\(.*?\)\](?:\(.*?\))?\s*$/gm, "") // 배지 라인 제거 ([![...](...)][...])
    .replace(/\n{3,}/g, "\n\n")                             // 3줄 이상 연속 공백 → 2줄로 축소
    .trim()
    .slice(0, README_MAX_LENGTH);
}

function decodeBase64Readme(content: string): string {
  try {
    const bytes = Uint8Array.from(
      atob(content.replace(/\n/g, "")),
      (c) => c.charCodeAt(0)
    );
    return trimReadme(new TextDecoder("utf-8").decode(bytes));
  } catch {
    return "";
  }
}

export function parseRepoKey(repoUrl: string): string {
  const { owner, repo } = parseGithubUrl(repoUrl);
  return `${owner}__${repo}`.toLowerCase();
}

export async function getGithubRepoData(repoUrl: string): Promise<GithubRepoData> {
  const { owner, repo } = parseGithubUrl(repoUrl);
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;

  const [repoResult, readmeResult] = await Promise.allSettled([
    fetchGithubJson<GithubRepoResponse>(baseUrl, "GitHub 레포지토리"),
    fetchGithubJson<GithubReadmeResponse>(`${baseUrl}/readme`, "GitHub README"),
  ]);

  // 레포지토리 정보는 필수 — 실패 시 에러
  if (repoResult.status === "rejected") {
    throw repoResult.reason instanceof Error
      ? repoResult.reason
      : new Error("레포지토리 정보를 가져오지 못했습니다.");
  }

  const { name, description, language } = repoResult.value;

  // README는 선택 — 실패해도 빈 문자열로 fallback
  let readme = "";
  if (readmeResult.status === "fulfilled") {
    const { content, encoding } = readmeResult.value;
    readme = encoding === "base64" ? decodeBase64Readme(content) : trimReadme(content);
  }

  return {
    name,
    description: description ?? "",
    language: language ?? "",
    readme,
  };
}
