# CLAUDE.md — DevShelf 프로젝트 가이드

> **DevShelf**: 개발자 포트폴리오를 "서재의 책"으로 탐색하는 웹 플랫폼
> Production: https://thedevshelf.netlify.app/

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| Package Manager | **npm** (bun/yarn 사용 금지) |
| Styling | TailwindCSS v4 |
| Animation | Framer Motion 12 |
| Routing | React Router v7 |
| Backend | Firebase 12 — Auth + Cloud Firestore |
| Deploy | Netlify |

---

## 로컬 환경 설정

### 필수 환경변수 (`.env.local`)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OPENAI_API_KEY=
```

> ⚠️ `.env.local`은 Git에서 제외됩니다. Firebase 콘솔 > 프로젝트 설정에서 값을 확인하세요.

### 실행 명령어

```bash
npm install
npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드 (tsc -b && vite build)
npm run lint     # ESLint 검사
npm run preview  # 빌드 결과 미리보기
```

---

## 프로젝트 구조

```
src/
├── components/
│   ├── book/               # 책 인터랙션 UI (BookCard, BookCover, OpenBook 등)
│   ├── FilterBar.tsx        # 기술 스택 필터 바
│   ├── GitHubAutofill.tsx   # GitHub AI 자동완성 패널 UI
│   ├── Header.tsx           # 반응형 헤더 + 모바일 햄버거 메뉴
│   ├── HeroSection.tsx      # 메인 히어로 섹션
│   └── PortfolioFormShared.tsx  # 폼 공용 컴포넌트 (FieldError, ToggleChip, BackButton 등)
├── contexts/
│   ├── authContextDef.ts    # AuthContextValue 인터페이스 + createContext
│   └── AuthContext.tsx      # AuthProvider (Firebase Auth onAuthStateChanged)
├── data/
│   ├── bookThemes.ts        # 책 테마 색상 상수 (단일 출처)
│   ├── roles.ts             # 직군 목록
│   └── stacks.ts            # 기술 스택 목록 + 아이콘 매핑
├── hooks/
│   ├── useAuth.ts           # AuthContext 구독 훅
│   ├── usePortfolioFormBase.ts  # 폼 공통 상태·유효성 베이스 훅
│   ├── usePortfolioForm.ts  # 등록 폼 훅 (베이스 확장)
│   ├── useEditPortfolioForm.ts  # 수정 폼 훅 (베이스 확장)
│   ├── useGithubAutofill.ts # GitHub 레포 분석 → 자동완성 훅
│   ├── usePortfolios.ts     # 포트폴리오 목록 조회 + 필터링 훅
│   ├── useLoginForm.ts      # 로그인 폼 훅
│   └── useRegisterForm.ts   # 회원가입 폼 훅
├── lib/
│   ├── firebase.ts          # Firebase 초기화 (auth, db export)
│   ├── portfolioService.ts  # 포트폴리오 Firestore CRUD
│   └── guestbookService.ts  # 방명록 Firestore CRUD
├── pages/                   # 라우트별 페이지 컴포넌트 (lazy import)
├── services/
│   ├── aiService.ts         # OpenAI API 호출 → 레포 분석
│   ├── firestoreService.ts  # AI 분석 결과 Firestore 캐시
│   └── githubService.ts     # GitHub REST API (README, 언어, 설명)
├── types/
│   └── index.ts             # 전역 타입 (Portfolio, GuestbookMessage, TechStack 등)
└── utils/
    ├── errors.ts            # unknown 에러 → 문자열 변환
    └── parseGithubUrl.ts    # GitHub URL에서 owner/repo 파싱
```

---

## 아키텍처 패턴

### 1. 라우터 구조 (App.tsx)

- 모든 페이지는 `lazy` + `Suspense`로 코드 스플리팅
- **PrivateRoute**: 비로그인 시 `/login` 리다이렉트
- **GuestRoute**: 로그인 상태이면 `/` 리다이렉트

```
/            → MainPage (공개)
/shelf       → ShelfPage (공개)
/login       → LoginPage (GuestRoute)
/register    → RegisterPage (GuestRoute)
/portfolio/new      → CreatePortfolioPage (PrivateRoute)
/portfolio/edit/:id → EditPortfolioPage (PrivateRoute)
```

새 라우트 추가 시 `App.tsx`에서 PrivateRoute/GuestRoute 여부를 명시적으로 지정할 것.

### 2. 인증 (AuthContext)

`authContextDef.ts`에 인터페이스 + createContext를 분리해 순환 참조를 방지합니다.

```ts
// 인증 상태 접근
const { user, loading } = useAuth();
```

- `user`: Firebase `User | null`
- `loading`: 인증 초기화 중 여부 (true이면 UI 렌더링 보류)

### 3. 폼 훅 계층 구조

```
usePortfolioFormBase  ← 공통 상태·유효성·touchAll
  ├── usePortfolioForm      (등록: addPortfolio 호출)
  └── useEditPortfolioForm  (수정: 기존 데이터 로딩 + updatePortfolio 호출)
```

새 폼을 추가할 때는 `usePortfolioFormBase`를 재사용하거나 상속하세요.

### 4. 데이터 레이어 구분

| 폴더 | 역할 |
|---|---|
| `lib/` | Firestore CRUD — 포트폴리오, 방명록 |
| `services/` | 외부 API — GitHub REST, OpenAI, AI 캐시 |

새 외부 API 연동은 `services/`에, Firestore 직접 접근은 `lib/`에 작성합니다.

### 5. 타입 관리

모든 도메인 타입은 `src/types/index.ts` 단일 파일에서 관리합니다.

**기술 스택 추가 시 반드시 3곳 모두 수정:**
1. `src/types/index.ts` — `TechStack` union type
2. `src/data/stacks.ts` — `ALL_STACKS` 배열 + `STACK_ICONS` 매핑
3. (필요 시) `src/services/aiService.ts` — AI 프롬프트 스택 목록

### 6. 상수 관리

| 상수 | 파일 |
|---|---|
| 책 테마 색상 | `src/data/bookThemes.ts` |
| 기술 스택 목록 | `src/data/stacks.ts` |
| 직군 목록 | `src/data/roles.ts` |

중복 정의 금지. 새 상수는 반드시 `src/data/`에 추가하세요.

---

## Firestore 컬렉션 구조

### `portfolios`

| 필드 | 타입 | 필수 |
|---|---|:---:|
| uid | string | ✓ |
| name | string | ✓ |
| role | string | ✓ |
| tagline | string | ✓ |
| techStack | TechStack[] | ✓ |
| description | string | ✓ |
| github | string | ✓ |
| liveDemo | string | ✓ |
| spineColor | string | ✓ |
| coverColor | string | ✓ |
| accentColor | string | ✓ |
| label | string | |
| projectCount | number | |
| featured | boolean | |
| status | DevStatus | |
| projectTypes | ProjectType[] | |

### `guestbook`

| 필드 | 타입 |
|---|---|
| uid | string (optional) |
| name | string |
| message | string |
| createdAt | string (ISO 8601) |

### AI 캐시 컬렉션 (`firestoreService.ts` 참조)

GitHub 레포 분석 결과를 캐싱하여 동일 레포 재분석 방지. 키: `repoKey` (owner/repo 형식)

---

## 코딩 규칙

### 컴포넌트
- 각 파일에서 named export 사용 (`export function Foo` / `export { Foo }`)
- 페이지 컴포넌트는 `src/pages/`에, 재사용 UI는 `src/components/`에
- 책 관련 컴포넌트는 `src/components/book/`에 모을 것

### 스타일링
- TailwindCSS v4 유틸리티 클래스 우선 사용
- 전역 커스텀 클래스는 `src/index.css`에만 작성
- 인라인 style은 Framer Motion의 `animate` prop이나 동적 색상에만 허용

### 에러 처리
- 에러 메시지 변환은 `src/utils/errors.ts`의 `getErrorMessage` 사용
- Firebase/Firestore 함수 호출 전 `auth`, `db` null 체크 필수

### TypeScript
- `any` 타입 사용 금지. 불명확한 경우 `unknown` 후 타입 가드 처리
- 새 도메인 타입은 `src/types/index.ts`에 추가

---

## 확장 가이드

### 새 페이지 추가

1. `src/pages/NewPage.tsx` 생성 (named export)
2. `App.tsx`에 `lazy` import 추가
3. `<Route>` 등록 시 PrivateRoute/GuestRoute 필요 여부 결정

### 새 Firestore 컬렉션 추가

1. `src/types/index.ts`에 인터페이스 정의
2. `src/lib/newService.ts`에 CRUD 함수 작성
3. 필요한 훅은 `src/hooks/useNew.ts`에 작성

### 새 외부 API 연동

1. `src/services/newService.ts`에 API 호출 함수 작성
2. 응답 타입은 `src/types/index.ts`에 추가
3. API 키는 `.env.local`에 `VITE_` 접두사로 추가

### 기술 스택 추가

```ts
// 1. src/types/index.ts
export type TechStack = ... | 'NewStack';

// 2. src/data/stacks.ts
export const ALL_STACKS: TechStack[] = [..., 'NewStack'];
export const STACK_ICONS: Record<TechStack, string> = { ..., 'NewStack': '아이콘' };
```

---

## 주요 알려진 이슈 및 해결책

| 이슈 | 해결 |
|---|---|
| useEditPortfolioForm useEffect 무한루프 | `portfolioId`, `user?.uid`만 의존성으로 지정. `base.setForm`은 의존성 배제 |
| 샘플 데이터 프로덕션 노출 | `import.meta.env.DEV` 조건으로 개발 환경에서만 병합 |
| 공통 폼 UI 중복 | `PortfolioFormShared.tsx`의 `FieldError`, `ToggleChip`, `BackButton`, `SubmitError` 재사용 |

---

## Git 브랜치 전략

- `main`: 프로덕션 (Netlify 자동 배포)
- `develop`: 개발 통합 브랜치
- 기능 브랜치: `feat/기능명`, 버그 수정: `fix/버그명`
- PR은 `develop` → `main`으로 merge
