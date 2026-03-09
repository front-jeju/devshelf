/** unknown 타입의 에러를 문자열로 변환합니다. */
export function toErrorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return fallback;
}

/** HTTP 상태 코드를 사람이 읽기 쉬운 메시지로 변환합니다. */
export function httpStatusMessage(status: number, context: string): string {
  switch (status) {
    case 401: return `${context}: 인증이 필요합니다. (401)`;
    case 403: return `${context}: API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요. (403)`;
    case 429: return `${context}: 요청이 너무 많습니다. 잠시 후 다시 시도하세요. (429)`;
    case 404: return `${context}: 찾을 수 없습니다. URL을 확인하세요. (404)`;
    case 422: return `${context}: 잘못된 요청입니다. (422)`;
    case 500:
    case 502:
    case 503: return `${context}: 서버 오류가 발생했습니다. 잠시 후 다시 시도하세요. (${status})`;
    default:  return `${context}: 요청이 실패했습니다. (${status})`;
  }
}
