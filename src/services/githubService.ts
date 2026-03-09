import { parseGithubUrl } from "@/utils/parseGithubUrl";

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
}

interface GithubReadmeResponse {
  content: string;
  encoding: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    throw new Error(`GitHub API 오류 (${response.status}): ${url}`);
  }

  return response.json() as Promise<T>;
}

export async function getGithubRepoData(repoUrl: string): Promise<GithubRepoData> {
  const { owner, repo } = parseGithubUrl(repoUrl);

  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;

  const [repoData, readmeData] = await Promise.allSettled([
    fetchJson<GithubRepoResponse>(baseUrl),
    fetchJson<GithubReadmeResponse>(`${baseUrl}/readme`),
  ]);

  if (repoData.status === "rejected") {
    throw new Error(`레포지토리 정보를 가져오지 못했습니다: ${repoData.reason}`);
  }

  const { name, description, language, stargazers_count } = repoData.value;

  let readme = "";
  if (readmeData.status === "fulfilled") {
    const { content, encoding } = readmeData.value;
    if (encoding === "base64") {
      readme = decodeURIComponent(
        escape(atob(content.replace(/\n/g, "")))
      );
    } else {
      readme = content;
    }
  }

  return {
    name,
    description: description ?? "",
    language: language ?? "",
    stars: stargazers_count,
    readme,
  };
}
