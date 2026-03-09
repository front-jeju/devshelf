/**
 * types/index.ts
 * 프로젝트 전역 타입 정의 파일입니다.
 * 모든 컴포넌트·훅·서비스에서 이 파일의 타입을 import해 사용합니다.
 */

/**
 * 지원하는 기술 스택 목록.
 * FilterBar의 필터 버튼과 포트폴리오 techStack 필드에 모두 사용됩니다.
 * 새 스택을 추가하려면 여기와 src/data/stacks.ts의 ALL_STACKS·STACK_ICONS도 함께 수정하세요.
 */
export type TechStack =
  | 'React'
  | 'TypeScript'
  | 'Next.js'
  | 'Vue'
  | 'Node.js'
  | 'Python'
  | 'UI/UX'
  | 'Spring'
  | 'GraphQL'
  | 'Three.js';

/** 개발자의 현재 상태 */
export type DevStatus = '취준' | '재직' | '학생' | '이직준비';

/** 프로젝트 유형 */
export type ProjectType = '토이' | '팀' | '사이드' | '오픈소스';

/**
 * Firestore 'guestbook' 컬렉션의 단일 문서 구조.
 * createdAt은 Firestore Timestamp → ISO 문자열로 변환해 저장합니다.
 */
export interface GuestbookMessage {
  id: string;       // Firestore 자동 생성 문서 ID
  uid?: string;     // 로그인 사용자의 Firebase uid (비로그인 작성 시 undefined)
  name: string;     // 작성자 이름
  message: string;  // 방명록 메시지 본문
  createdAt: string; // ISO 8601 형식 날짜 문자열 (예: "2026-03-07T00:00:00.000Z")
}

/**
 * Firestore 'portfolios' 컬렉션의 단일 문서 구조.
 * 책장(BookShelf)에서 한 권의 '책'으로 표현됩니다.
 *
 * 색상 필드 용도:
 *   - spineColor  : 책 등(세로 면) 색상
 *   - coverColor  : 책 앞표지 색상
 *   - accentColor : 제목·장식선 등 강조 색상
 */
export interface Portfolio {
  id: string;           // Firestore 자동 생성 문서 ID
  uid?: string;         // 등록한 사용자의 Firebase uid (수정/삭제 권한 확인에 사용)
  name: string;         // 개발자 이름 (책 제목으로 표시)
  role: string;         // 직군 (예: "Frontend Developer")
  tagline: string;      // 한 줄 소개 (책 표지 인용구로 표시)
  techStack: TechStack[]; // 사용 기술 스택 목록 (FilterBar 필터링에 활용)
  description: string;  // 상세 소개 (OpenBook 오른쪽 페이지에 표시)
  github: string;       // GitHub 프로필 URL
  liveDemo: string;     // 포트폴리오 사이트 URL (OpenBook 왼쪽 iframe 미리보기)
  spineColor: string;   // 책 등 색상 (hex)
  coverColor: string;   // 표지 색상 (hex)
  accentColor: string;  // 강조 색상 (hex)
  label?: string;       // 선택적 뱃지 레이블
  projectCount: number; // 프로젝트 수 (현재 0으로 고정, 추후 활용 예정)
  featured?: boolean;   // true면 책 등에 황금 점 배지 표시
  status?: DevStatus;         // 개발자 현재 상태 (취준/재직/학생/이직준비)
  projectTypes?: ProjectType[]; // 진행한 프로젝트 유형 목록
}
