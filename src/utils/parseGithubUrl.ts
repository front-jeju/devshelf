interface GithubUrlResult {
  owner: string;
  repo: string;
}

export function parseGithubUrl(url: string): GithubUrlResult {
  if (!url || typeof url !== "string") {
    throw new Error("URL이 제공되지 않았습니다.");
  }

  const trimmed = url.trim().replace(/\/$/, "");

  const match = trimmed.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/
  );

  if (!match) {
    throw new Error(`올바른 GitHub URL 형식이 아닙니다: "${url}"`);
  }

  const [, owner, repo] = match;

  return { owner, repo };
}
