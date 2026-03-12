# DevShelf 개발 로그 — 정리본

> 원본 `dev-log.md` (71개 항목)에서 중복·연속 항목을 병합한 요약본입니다.
> 항목 수: **71 → 41개** (중복 30개 제거/병합)

---

## 1. 책 등 텍스트 방향 수정 + 로그인 페이지

### 지시
> 책 등의 이름이 반대로 되어있어서 수정해주고, 메인 페이지 디자인에 맞게 로그인 페이지 만들어줘.

### 구현
- `BookCard.tsx`: `writingMode: 'vertical-rl'` → `'vertical-lr'`
- `LoginPage.tsx` 신규: 이메일/비밀번호, 비밀번호 토글, mock 인증
- `MainPage.tsx` 신규: App.tsx 내용 분리
- `App.tsx`: BrowserRouter + Routes 도입, `/login` 라우트 추가

---

## 2. 회원가입 페이지

### 지시
> 메인 페이지 디자인에 맞게 회원가입 페이지 만들어줘.

### 구현
- `RegisterPage.tsx` 신규: 이름/이메일/비밀번호/확인 필드, `touched` 패턴, 비밀번호 강도 바 4단계

---

## 3. 포트폴리오 서재 등록 페이지

### 지시
> 메인 페이지 디자인에 맞게 포트폴리오 서재 등록 페이지 만들어줘.

### 구현
- `CreatePortfolioPage.tsx` 신규: 5개 섹션 (BASIC INFO / TECH STACK / LINKS / ABOUT ME / BOOK THEME)
- `MiniBook` 서브 컴포넌트: 52×130px 책 등 실시간 미리보기
- 책 테마 6가지 프리셋 + 완료 화면 flip 애니메이션

---

## 4. iframe 미리보기 — 등록 폼 + BookCard 통합

> **원본 #4, #5 병합**: 같은 iframe 기능을 연속으로 두 번에 나눠 요청

### 지시
> 포트폴리오 url 미리보기 iframe으로 해줘 / bookcard에서도 iframe 해줘

### 구현
- `CreatePortfolioPage.tsx`: 유효 URL 입력 시 `PREVIEW ▼` 버튼, AnimatePresence 슬라이드, 가짜 브라우저 크롬 바, 로딩 스피너
- `BookCard.tsx`: 상세 모달 내 `PREVIEW` 섹션, accentColor 테마 통일, 모달 maxWidth 720 확장

---

## 5. Firebase OAuth + 배포 검은 화면 수정

### 지시
> 로그인 기능 추가하니까 배포 화면이 까만 화면이야 해결 부탁해

### 원인
Netlify에 `VITE_FIREBASE_*` 환경변수 미설정 → Firebase SDK 에러 → 앱 전체 크래시

### 수정
- `firebase.ts`: 필수 3개 환경변수 없으면 `auth`, `db` → `null`로 export, `isConfigured` boolean 추가
- `LoginPage.tsx`: OAuth 버튼 `isConfigured === false` 시 disabled 처리

---

## 6. TypeScript 오류 수정 (CreatePortfolioPage)

### 구현
- `React.CSSProperties` → `CSSProperties` import 추가
- `usePortfolioForm()` destructuring에서 미사용 `isValid` 제거

---

## 7. 헤더 로그인/로그아웃 조건 변경

### 지시
> 로그아웃 상태에는 로그인 버튼만, 로그인하면 내서재 등록 버튼이 나오게 바꿔줘

### 수정 — `Header.tsx`

| 상태 | 표시 요소 |
|---|---|
| 로그인 | 사용자 이름 + 내 서재 등록 + 로그아웃 |
| 비로그인 | 로그인 버튼만 |

---

## 8. Firestore 보안 규칙 설정 안내 + 포트폴리오 수정·삭제

> **원본 #9, #10 병합**: Firebase 저장 방법 문의 → 수정/삭제 기능 구현 연속 작업

### 지시
> 서재 등록 firebase 저장 하는 방법 / 로그인 사용자가 수정·삭제 기능 만들어줘

### 구현
- **Firestore 규칙**: `portfolios` 컬렉션 — read: true, write: auth != null
- `portfolioService.ts`: `getPortfolioById`, `updatePortfolio`, `deletePortfolio` 추가
- `usePortfolios.ts`: `removePortfolio` optimistic update 추가
- `useEditPortfolioForm.ts` 신규: 기존 데이터 로딩 + 소유자 체크 + 수정 제출
- `EditPortfolioPage.tsx` 신규: `/portfolio/edit/:id`
- `BookCard.tsx` (구 PortfolioModal): `isOwner` 체크, 2단계 삭제 확인 UI

---

## 9. 스타일 Tailwind 통일

### 지시
> 이 프로젝트 스타일 적용을 tailwind로 통일해줘

### 구현
- `index.css`: `:root` CSS 변수 → `@theme` 블록, `@layer components`에 `.page-bg`, `.card-dark`, `.input-field`, `.btn-gold` 등 공통 클래스 추출
- 페이지·컴포넌트 전체: 인라인 스타일 → Tailwind 유틸리티 클래스 변환 (동적 색상 인라인 유지)

---

## 10. CSS 오류 수정 + VSCode IDE 경고 해결

> **원본 #12, #13 병합**: 연속된 CSS 문제 수정

### 구현
- `index.css`: `.input-field` 선택자 순서 재배치 (`.error` → `.success` → `:focus`)
- `.vscode/settings.json` 신규: `@theme` IDE 오탐 억제 (`css.lint.unknownAtRules: "ignore"`)

---

## 11. 방명록 기능 전체 구현

> **원본 #14, #19, #20, #21 병합**: 방명록 UI → Firebase 연결 → 버그 수정 → 빈 필드 경고 연속 작업

### 지시
> 방문 메시지 기록 기능 작동하게 만들어줘

### 구현
- `GuestbookMessage` 인터페이스 (`types/index.ts`)
- `guestbookService.ts` 신규: `addGuestbookMessage`, `updateGuestbookMessage`, `deleteGuestbookMessage`, `subscribeGuestbookMessages` (onSnapshot 실시간)
- `Footer.tsx`: localStorage → Firestore 기반으로 전환, `submitting` 상태로 중복 클릭 방지, try/catch/finally 오류 처리, 빈 필드 인라인 경고

---

## 12. 방명록 수정·삭제 + isOwner 로직 정리

> **원본 #22, #23 병합**

### 구현
- `Footer.tsx`: 본인 메시지(`msg.uid === user.uid`)에만 수정/삭제 버튼 노출
- isOwner 단순화: uid 없는 구메시지 fallback 비교 제거

---

## 13. FilterBar + BookShelf 서재 페이지 분리

### 지시
> mainpage에서 filterbar와 bookshelf를 다른 페이지로 분리하고, 서재 둘러보기 버튼으로 연결해줘

### 구현
- `ShelfPage.tsx` 신규: `/shelf`, 3개 필터 상태 관리
- `MainPage.tsx`: FilterBar, BookShelf 제거 → HeroSection + Footer만 렌더링
- `HeroSection.tsx`: 버튼 `onClick` → `navigate('/shelf')`

---

## 14. Canvas 기반 포털 배경 컴포넌트

### 지시
> Canvas 2D API + requestAnimationFrame으로 황금색 에너지 링 포털 배경 컴포넌트 만들어줘.
> 입자 150~250개, `globalCompositeOperation = "lighter"`, 마우스 근접 가속, 모바일 60fps 최적화

### 구현
- `PortalCanvas.tsx` 신규: 3개 링(내부/중간/외부), sin 파형 흔들림, 마우스 영향력 계산, 연결선 배치 드로우
- `HeroSection.tsx`: 촛불 그룹 앞 zIndex:1 위치에 삽입

---

## 15. Footer Tailwind 변환 + setName 오류 수정

> **원본 #17, #18 병합**

### 구현
- `Footer.tsx`: 인라인 스타일 전부 Tailwind로 교체, `@theme` 토큰 활용
- `setName` useEffect 제거 → React 권장 "setState during render" 패턴으로 변경

---

## 16. 폼 공통 컴포넌트 분리

### 지시
> CreatePortfolioPage, EditPortfolioPage 두 파일이 같은 페이지 중복인 것 같은데 확인 및 수정해줘

### 구현
- `PortfolioFormShared.tsx` 신규: `ROLES`, `SectionTitle`, `FieldError`, `MiniBook` named export
- Create/EditPortfolioPage: ~90줄 중복 코드 제거 → import 교체

---

## 17. 헤더 로고 전 페이지 통일 + 메인 페이지 링크

> **원본 #25, #26 병합**

### 구현
- 로그인/회원가입/등록/수정 페이지: `📚 The Developer's Library` → `DEVSHELF` 통일
- `Header.tsx` 로고: `<motion.div>` → `<Link to="/">` 래핑

---

## 18. 프로젝트 성능 최적화

### 지시
> 프로젝트 성능 최적화

### 구현
- `App.tsx`: 모든 페이지 `React.lazy` + `Suspense` 코드 스플리팅
- `FloatingParticles.tsx`: Page Visibility API — 백그라운드 탭 rAF 중단
- `Header.tsx`: `handleNavClick` → `useCallback` 메모이제이션
- `OpenBook.tsx`: resize 핸들러 150ms 디바운스
- `vite.config.ts`: `manualChunks`로 react/firebase/framer-motion 청크 분리

---

## 19. 프로젝트 전 파일 유지보수 주석 추가

### 지시
> 유지보수하기 쉽게 주석 달아줘 (컴포넌트 목적 / 데이터 구조 / 로직 흐름)

### 구현
총 21개 파일에 모듈 수준 JSDoc + 인라인 주석 추가.
주요 파일: `types/index.ts`, `firebase.ts`, `AuthContext.tsx`, `App.tsx`, `BookShelf.tsx`, `BookCard.tsx`, `usePortfolioFormBase.ts` 등

---

## 20. React hooks 규칙 위반 수정 (set-state-in-effect)

### 지시
> `ProjectForm.tsx` ESLint 오류 수정해줘

### 수정
`useEffect` 내 `setForm` 동기 호출 → "setState during render" 패턴으로 변경 (`prevAnalysis` ref 추적)

---

## 21. GitHub → OpenAI 프록시 전환 + 서비스 리팩토링

> **원본 #31, #32, #36, #41 핵심 내용 병합**: Gemini API 429 문제 → OpenAI 프록시 전환까지의 흐름

### 배경
Gemini 2.0-flash RPM(분당 한도) 초과로 429 오류 반복 발생.

### 최종 해결
- `geminiService.ts` → `aiService.ts` 로 변경
- API 엔드포인트: `https://dev.wenivops.co.kr/services/openai-api` (OpenAI 호환 프록시)
- API 키 불필요, 재시도 로직 제거
- 타입 이름: `GeminiAnalysisResult` → `AnalysisResult`
- `firestoreService.ts`: `getCachedAnalysis` / `setCachedAnalysis` 캐시 레이어 추가

### 시도 이력
| 시도 | 조치 | 결과 |
|---|---|---|
| 1~2 | gemini-1.5-flash 변경 | 404 (deprecated) |
| 3 | gemini-2.0-flash | 429 RPM 초과 |
| 4 | gemini-2.0-flash-lite | 개선, 여전히 실패 가능 |
| 5 | Firestore 캐싱 도입 | 동일 레포 재분석 방지 |
| 6 | **OpenAI 프록시 전환** | 429 문제 근본 해결 |

---

## 22. RepoAnalyzerPage 제거 + GitHubAutofill 관심사 분리

### 지시
> 분석 페이지를 사용 안한다면 제거해줘 / 리팩토링 부탁해

### 구현
- `RepoAnalyzerPage.tsx`, `useRepoAnalyzer.ts`, `RepoAnalyzer.tsx`, `AnalysisResult.tsx`, `ProjectForm.tsx` 삭제
- `GitHubAutofill.tsx`: 로직 → `useGithubAutofill.ts` 훅으로 분리
- `App.tsx`: `/analyzer` 라우트 제거

---

## 23. Firestore analysisCache 보안 규칙

### 지시
> firebase 규칙 설정을 안했어

### 조치
```
match /analysisCache/{key} {
  allow read, write: if request.auth != null;
}
```

---

## 24. 이탤릭 스타일 전체 제거

> **원본 #34, #35 병합**: 프로젝트 전체 + Footer 이탤릭 제거 동시 처리 가능

### 지시
> 이탤릭 스타일을 다 기본 스타일로 변경해줘 / 이 파일도 이탤릭 없애고

### 수정
- `index.css`: `.logo-subtitle`, `::placeholder`, `.field-error` 에서 `font-style: italic` 제거
- TSX 파일 18개 + `Footer.tsx`: `fontStyle: 'italic'` 및 `italic` Tailwind 클래스 총 30여 곳 제거

---

## 25. HeroSection 팀 소개 섹션 추가

### 구현
- `HeroSection.tsx`: `id="about"` 팀 소개 섹션 (개발 목적 / 문제 정의 / 해결 방법 카드 3개) 추가

---

## 26. 로그인·회원가입 뒤로 가기 버튼

### 구현
- `LoginPage.tsx`, `RegisterPage.tsx`: 로고 위 우측에 `홈으로 →` / `로그인으로 →` 버튼 배치

---

## 27. Lucide-React 아이콘 전체 교체

> **원본 #42, #45, #46, #70 병합**: 비밀번호 토글 → 필터바 → 스택 → 폼 아이콘을 4번에 나눠 요청

### 지시
> 아이콘 lucide-react로 변경 (비밀번호 토글 / 필터 바 / 스택 아이콘 / 폼 이모지)

### 구현
- `LoginPage.tsx`, `RegisterPage.tsx`: `Eye`, `EyeOff` (비밀번호 토글)
- `FilterBar.tsx`: `STATUS_ICONS`, `PROJECT_ICONS` 문자열 → `ReactNode`
- `stacks.ts`: `STACK_ICONS` → `React.createElement` 기반 Lucide 아이콘 (`.ts` 파일 내 JSX 불가)
- `PortfolioFormShared.tsx`: `ToggleChip` icon prop `string` → `ReactNode`

---

## 28. GitHub 자동완성 — LINKS 섹션 통합 + 항상 표시

> **원본 #43, #61 병합**

### 지시
> 깃헙 주소 칸에도 자동완성 기능 해줘 / 입력 전에도 자동완성 버튼이 보였으면 좋겠어

### 구현
- `useGithubAutofill.ts`: `handleAutofillWithUrl(targetUrl)` 추가
- `PortfolioFormShared.tsx`: `LinksFields`에 `githubChildren?: ReactNode` prop 추가
- `CreatePortfolioPage.tsx`: 상단 독립 섹션 제거 → GitHub URL 필드 하단에 배너 항상 표시 (유효 URL 없으면 흐리게)
- 데이터 흐름: URL → GitHub API → Firestore 캐시 → (미스 시) AI 분석 → 캐시 저장 → `onAutofill` 콜백

---

## 29. 서재 등록/수정 폼 뒤로 가기 버튼 + EditPortfolioPage 동기화

> **원본 #44 병합**

### 구현
- `CreatePortfolioPage.tsx`: `← 뒤로` 버튼 추가
- `EditPortfolioPage.tsx`: LINKS 섹션 1번으로 이동, 자동완성 배너 동일하게 적용, Create와 동일한 섹션 순서 통일

---

## 30. FilterBar 레이아웃 개편 — 레이블 위·버튼 아래 구조

### 구현
- `FilterBar.tsx`: `GroupLabel` 위, 버튼 아래 `flex flex-col` 구조로 변경

---

## 31. 로그인 페이지 상단 간격 통일

### 수정 — `LoginPage.tsx`
- 최상위 wrapper에 `py-16` 추가 (RegisterPage와 동일)

---

## 32. `/log` 슬래시 커맨드 생성

### 구현
- `.claude/commands/log.md` 신규: 세션 끝에 `/log` 입력 시 dev-log.md 자동 업데이트

---

## 33. AuthContext 두 가지 오류 수정

### 지시
> Error: Calling setState synchronously within an effect / Fast refresh only works when a file only exports components

### 수정
- `AuthContext.tsx`: `useState(!!auth)`로 초기 상태 결정 (effect 내 `setLoading` 제거)
- `useAuth` → `hooks/useAuth.ts`로 분리 (컴포넌트와 훅 혼재 export 해소)

---

## 34. ABOUT 섹션 텍스트 가독성 + 세로 배치 고정

### 수정 — `HeroSection.tsx`
- 카드 텍스트를 `\n`으로 의미 단위 분리
- `grid-cols-1 md:grid-cols-3` → `grid-cols-1` (모든 화면 세로 배치 유지)

---

## 35. 프로젝트 전체 유지 보수 분석 및 수정

### 지시
> 프로젝트 전체 유지 보수 관점에서 분석 후 수정

### 구현
- `PortfolioFormShared.tsx`: AI 자동완성 UI → `GithubAutofillPanel` 컴포넌트로 추출
- `firestoreService.ts`: `/analyzer` 삭제된 페이지 관련 데드 코드 제거
- `usePortfolioForm.ts`, `useEditPortfolioForm.ts`: dead re-export 제거
- `package.json`: `@types/react-router-dom` → `devDependencies`로 이동
- `useGithubAutofill.ts`: 미사용 public API 멤버 정리

---

## 36. 상수 파일 분리 — ROLES → `src/data/roles.ts`

### 구현
- `PortfolioFormShared.tsx` 인라인 `ROLES` → `src/data/roles.ts` 독립 파일로 추출

---

## 37. 3단계 북 인터랙션 UI 구현 (SHELF → COVER → OPEN)

### 지시
> 책 UI는 SHELF / COVER / OPEN 세 상태를 가질 것. iframe 미리보기, 개발자 프로필, ESC 닫기, 모바일 폴백 포함.

### 구현
- `BookCover.tsx` 신규: 280×420 3D 책 표지, `perspective: 1200px` + rotateY 애니메이션
- `BookPageLeft.tsx` 신규: iframe + 로딩 스켈레톤 + 에러 대체 UI
- `BookPageRight.tsx` 신규: 개발자 프로필, 소유자 Edit/Delete 인라인 플로우
- `OpenBook.tsx` 신규: 데스크탑(3열 그리드 양면 펼침) / 모바일(탭 스위처) 분기
- `BookShelf.tsx`: `BookPhase ('cover' | 'open')` 상태 머신으로 전환

---

## 38. 헤더 네비게이션 링크 연결

### 구현
- `Header.tsx`: `NAV_ITEMS` 상수 추가 (The Shelf / Our Story / Guestbook), `handleNavClick` 해시 라우팅 처리
- `Footer.tsx`: `<footer id="guestbook">` 앵커 추가, 하단 링크 `Link`/스크롤로 교체

---

## 39. README 전면 작성 및 수정

> **원본 #57, #58, #59, #65, #66, #67, #68, #69 병합**: README 초안 → WBS 날짜 수정 → 섹션 구조 복원 → 재작성 → 화면 목록 수정 → ERD 점검 → 아키텍처 수정 → 시퀀스 다이어그램 수정을 8번에 나눠 요청

### 구현 — `README.md`
- Mermaid mindmap (요구사항), gantt (WBS 실제 커밋 날짜 기준), erDiagram (Firestore 구조), sequenceDiagram (책 인터랙션/등록/AI 자동완성 3개)
- 개발 기간: 2026-02-27 ~ 2026-03-11
- 아키텍처: GitHub REST API + OpenAI(wenivops proxy) 외부 API 흐름 포함

---

## 40. 서재 필터 + 등록 폼 — 상태/프로젝트 유형 추가

> **원본 #63, #64 병합**: 필터 추가 → 폼에도 추가 연속 작업

### 지시
> 필터 추가하고 싶어 [상태] 취준/재직/학생/이직준비 [프로젝트] 토이/팀/사이드/오픈소스 / 추가해줘 (등록 폼에도)

### 구현
- `types/index.ts`: `DevStatus`, `ProjectType` union 타입 추가
- `FilterBar.tsx`: STACK / STATUS / PROJECT 3개 그룹
- `PortfolioFormShared.tsx`: `ToggleChip`, `StatusField`, `ProjectTypeField` 컴포넌트
- `usePortfolioFormBase.ts`: `status`, `projectTypes` 상태 추가
- `ShelfPage.tsx`, `BookShelf.tsx`: AND 조건 필터링 확장

---

## 41. OpenBook — 책갈피 및 페이지 입체감 개선

### 지시
> 책 하단에 책갈피 제작, 책 여러 장 표현, 입체감 개선

### 구현 — `OpenBook.tsx`
- 좌우 페이지 팬(fan) 효과: 6개 레이어 배경 점층 색상으로 여러 장 표현
- 하단 커버 두께 바: `height: 10` 어두운 그라디언트
- 책갈피: accentColor 사용, V-노치 클립패스, 하단 -62px 위치

---

---

# 반복 프롬프트 패턴 분석 및 개선 제안

## 패턴 분석

| 패턴 | 발생 횟수 | 해당 항목 |
|---|---|---|
| **아이콘 교체** (lucide-react) 쪼개서 요청 | 4회 | #42, #45, #46, #70 |
| **README 수정** 쪼개서 요청 | 8회 | #57~59, #65~69 |
| **이탤릭 제거** 나눠서 요청 | 2회 | #34, #35 |
| **방명록** 기능 단계별 추가 | 5회 | #14, #19~22 |
| **오류 수정** (메시지 없이 파일만 전달) | 5회 | #7, #12, #30, #52, #70 |
| **GitHub AI 자동완성** 단계별 | 3회 | #31, #41, #61 |
| **등록 폼 ↔ 수정 폼** 각각 별도 요청 | 반복 | #33, #44, #64 |

---

## 개선 제안

### 1. 스타일 변경은 범위 명시 후 한 번에
```
# 비효율 (2회)
"이탤릭 스타일을 다 기본 스타일로 변경해줘"
"이 파일도 이탤릭 없애고"

# 개선 (1회)
"src/ 전체에서 이탤릭 스타일을 모두 제거해줘. index.css 포함."
```

### 2. 아이콘 교체는 대상 파일 묶어서 한 번에
```
# 비효율 (4회)
"로그인 페이지 비밀번호 토글 아이콘 lucide-react로 변경"
"회원가입 페이지도 변경해줘"
"필터 바 아이콘도 변경"
"스택 아이콘도 변경"

# 개선 (1회)
"lucide-react로 아이콘 통일해줘.
- LoginPage, RegisterPage: Eye/EyeOff (비밀번호 토글)
- FilterBar: STATUS, PROJECT 아이콘
- stacks.ts: STACK_ICONS
- PortfolioFormShared: 이모지 → 아이콘"
```

### 3. README는 구조 초안 먼저 확정 후 내용 채우기
```
# 비효율 (8회 수정)
"README 작성해줘" → "WBS 날짜 수정" → "섹션 구조 원복" → "재작성" → "화면 목록 수정" ...

# 개선 (2회)
1단계: "ERD, 아키텍처, 시퀀스 다이어그램 확인하고 구조 초안 보여줘. 확인 후 전체 작성할게."
2단계: "확인. 이 구조로 전체 README 작성해줘."
```

### 4. 오류 수정 요청 시 에러 메시지 포함
```
# 비효율
"@CreatePortfolioPage.tsx 오류 수정해줘"

# 개선
"@CreatePortfolioPage.tsx 오류 수정해줘.
에러: React.CSSProperties is not defined"
```

### 5. 양쪽 페이지에 동일 변경은 파일을 명시
```
# 비효율 (2회)
"서재 등록 페이지에 뒤로 가기 버튼 만들어줘"
"이제 등록 페이지 참고하여 수정 페이지도 수정해줘"

# 개선 (1회)
"@CreatePortfolioPage.tsx @EditPortfolioPage.tsx 둘 다 동일하게 뒤로 가기 버튼 추가해줘"
```

### 6. 기능 구현은 전체 범위를 먼저 정의
```
# 비효율 (3회)
"방문 메시지 기록 기능 작동하게 만들어줘"
"방명록 메시지 firebase 연결"
"방문 메시지 수정 및 삭제 기능"

# 개선 (1회)
"방명록 전체 구현해줘:
- Firestore 연동 (읽기/쓰기/수정/삭제)
- 로그인 사용자: 본인 메시지 수정/삭제 가능
- 비로그인: 로그인 유도 UI
- 빈 필드 제출 시 인라인 에러"
```

### 7. `/log` 활용으로 세션 기록 자동화
```
# 세션 끝에 입력
/log
```
→ dev-log.md에 자동으로 이번 세션 내용 추가됨

---

## 요약: 효율적인 프롬프트 3원칙

1. **범위 명시**: "전체", "두 파일 모두", "@파일명" 등으로 대상을 처음부터 지정
2. **컨텍스트 포함**: 오류 메시지, 에러 스택, 변경 이유를 함께 제공
3. **배치 요청**: 관련된 변경 사항은 한 번에 묶어서 요청 (분리된 4회 요청 → 1회)
