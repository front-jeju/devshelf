import { parseGithubUrl } from "@/utils/parseGithubUrl";
import { httpStatusMessage } from "@/utils/errors";

export interface GithubRepoData {
  name: string;
  description: string;
  language: string;
  stars: number;
  readme: string;
}

interface GithubRepoResponse {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  message?: string; // GitHub API 오류 응답 시 포함되는 필드
}

interface GithubReadmeResponse {
  content: string;
  encoding: string;
}

const README_MAX_LENGTH = 5000;
const GITHUB_HEADERS = { Accept: "application/vnd.github+json" };

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

function decodeBase64Readme(content: string): string {
  try {
    const bytes = Uint8Array.from(
      atob(content.replace(/\n/g, "")),
      (c) => c.charCodeAt(0)
    );
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded.slice(0, README_MAX_LENGTH);
  } catch {
    return "";
  }
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

  const { name, description, language, stargazers_count } = repoResult.value;

  // README는 선택 — 실패해도 빈 문자열로 fallback
  let readme = "";
  if (readmeResult.status === "fulfilled") {
    const { content, encoding } = readmeResult.value;
    readme = encoding === "base64" ? decodeBase64Readme(content) : content.slice(0, README_MAX_LENGTH);
  }

  return {
    name,
    description: description ?? "",
    language: language ?? "",
    stars: stargazers_count,
    readme,
  };
}
