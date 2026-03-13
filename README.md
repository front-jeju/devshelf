# DevShelf - 개발자의 서재

> 개발자의 포트폴리오를 "서재" 컨셉으로 탐색하는 웹 플랫폼

---

## 목차

1. [목표와 기능](#1-목표와-기능)
2. [개발 환경 및 배포 URL](#2-개발-환경-및-배포-url)
3. [요구사항 명세와 기능 명세](#3-요구사항-명세와-기능-명세)
4. [프로젝트 구조와 개발 일정](#4-프로젝트-구조와-개발-일정)
5. [역할 분담](#5-역할-분담)
6. [와이어프레임 / UI / BM](#6-와이어프레임--ui--bm)
7. [데이터베이스 모델링(ERD)](#7-데이터베이스-모델링erd)
8. [Architecture](#8-architecture)
9. [성능 (Lighthouse)](#9-성능-lighthouse)
10. [메인 기능](#10-메인-기능)
11. [에러와 에러 해결](#11-에러와-에러-해결)
12. [향후 확장 가능성](#12-향후-확장-가능성)
13. [개발하며 느낀 점](#13-개발하며-느낀-점)

---

## 1. 목표와 기능

### 1.1 목표

- 개발자 포트폴리오를 **책등 → 책 표지 → 책 펼침** 인터랙션으로 탐색하는 독창적인 경험 제공
- Firebase 기반의 로그인과 실시간 데이터 동기화로 낮은 진입 장벽 실현
- 기술 스택 · 직군 상태 필터링을 통해 원하는 개발자를 빠르게 발견할 수 있는 서재 탐색 플랫폼 구축

### 1.2 기능

- **서재 탐색**: 기술 스택 필터로 개발자 포트폴리오를 책 형태로 탐색
- **포트폴리오 등록**: 이름, 직군, 한 줄 소개, 기술 스택, 재직 상태, 프로젝트 유형, GitHub, Live Demo URL, 자기소개 입력 및 책 테마 선택
- **GitHub AI 자동완성**: GitHub 레포 URL 입력 시 기술 스택 · 한 줄 소개 · 자기소개를 자동으로 채워주는 기능
- **포트폴리오 수정 / 삭제**: 본인 포트폴리오에 한해 수정 및 삭제 가능
- **Live Demo 미리보기**: 등록 전 포트폴리오 URL을 iframe으로 미리 확인
- **방명록**: 메인 페이지에서 방문자가 자유롭게 메시지 남기기
- **로그인 / 회원가입**: Firebase Auth 기반 이메일 인증
- **모바일 대응**: 햄버거 메뉴를 포함한 반응형 레이아웃

### 1.3 팀 구성

<table>
  <tr>
    <th>김남희</th>
    <th>김성민</th>
    <th>김유진</th>
    <th>김지민</th>
    <th>이영미</th>
    <th>조현진</th>
  </tr>
  <tr>
    <td><img src="./docs/member1.jpg" width="100%"></td>
    <td><img src="./docs/member2.jpg" width="100%"></td>
    <td><img src="./docs/member3.jpg" width="100%"></td>
    <td><img src="./docs/member4.jpg" width="100%"></td>
    <td><img src="./docs/member5.jpg" width="100%"></td>
    <td><img src="./docs/member6.jpg" width="100%"></td>
  </tr>
</table>

---

## 2. 개발 환경 및 배포 URL

### 2.1 개발 환경

| 구분 | 기술 |
|---|---|
| **Framework** | React 19 + TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Package Manager** | npm |
| **Styling** | TailwindCSS v4 |
| **Animation** | Framer Motion 12 |
| **Routing** | React Router v7 |
| **Backend / BaaS** | Firebase 12 — Auth + Cloud Firestore |
| **Deployment** | Netlify |

### 2.2 배포 URL

- **Production**: `https://thedevshelf.netlify.app/`
- 테스트 계정
  ```
  id: test@devshelf.dev
  pw: test1234!
  ```

### 2.3 URL 구조

| URL | 페이지 | 설명 | 인증 |
|---|---|---|:---:|
| `/` | 메인 | 히어로 섹션 + 방명록 | |
| `/shelf` | 서재 | 전체 포트폴리오 탐색 | |
| `/login` | 로그인 | 로그인 상태면 `/` 리다이렉트 (GuestRoute) | |
| `/register` | 회원가입 | 로그인 상태면 `/` 리다이렉트 (GuestRoute) | |
| `/portfolio/new` | 포트폴리오 등록 | 비로그인 시 `/login` 리다이렉트 (PrivateRoute) | ✓ |
| `/portfolio/edit/:id` | 포트폴리오 수정 | 본인 포트폴리오만 수정 가능 (PrivateRoute) | ✓ |

### 2.4 Firestore 컬렉션 구조

**portfolios**

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string | 문서 ID |
| `uid` | string | 작성자 Firebase UID |
| `name` | string | 개발자 이름 |
| `role` | string | 직군 |
| `tagline` | string | 한 줄 소개 |
| `techStack` | array | 기술 스택 목록 |
| `description` | string | 자기소개 |
| `github` | string | GitHub URL |
| `liveDemo` | string | 포트폴리오 URL |
| `spineColor` | string | 책등 색상 |
| `coverColor` | string | 표지 색상 |
| `accentColor` | string | 강조 색상 |
| `label` | string | 테마 라벨 |
| `projectCount` | number | 프로젝트 수 |
| `featured` | boolean | 추천 여부 |
| `status` | string | 재직 상태 (선택) |
| `projectTypes` | array | 프로젝트 유형 목록 (선택) |

**guestbook**

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string | 문서 ID |
| `uid` | string | 작성자 Firebase UID |
| `name` | string | 작성자 이름 |
| `message` | string | 방명록 내용 |
| `createdAt` | string | 작성 시각 |

---

## 3. 요구사항 명세와 기능 명세

```
mermaid
mindmap
  root((DevShelf))
    서재 탐색
      기술 스택 필터
      책 인터랙션
        책등 hover
        책 표지 클릭
        책 펼침 보기
    포트폴리오
      등록
        기본 정보 입력
        기술 스택 선택
        재직 상태 선택
        프로젝트 유형 선택
        책 테마 선택
        Live Demo 미리보기
        GitHub AI 자동완성
      수정
        기존 데이터 불러오기
        항목별 수정
      삭제
        본인 확인 후 삭제
    인증
      이메일 로그인
      회원가입
      로그아웃
      PrivateRoute 보호
      GuestRoute 보호
    방명록
      메시지 작성
      실시간 표시
```

---

## 4. 프로젝트 구조와 개발 일정

### 4.1 프로젝트 구조

```
the-developers-library/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── book/
│   │   │   ├── BookCard.tsx        # 서재의 개별 책 카드 (hover 애니메이션 포함)
│   │   │   ├── BookCover.tsx       # 책 표지 컴포넌트
│   │   │   ├── BookPageLeft.tsx    # 펼친 책 왼쪽 페이지 (자기소개)
│   │   │   ├── BookPageRight.tsx   # 펼친 책 오른쪽 페이지 (링크·수정·삭제)
│   │   │   ├── BookShelf.tsx       # 서재 전체 그리드 + 필터 연동
│   │   │   └── OpenBook.tsx        # 책 펼침 모달
│   │   ├── FilterBar.tsx           # 기술 스택 필터 바
│   │   ├── FloatingParticles.tsx   # 배경 파티클 애니메이션
│   │   ├── Footer.tsx              # 공통 푸터
│   │   ├── GitHubAutofill.tsx      # GitHub AI 자동완성 패널 UI
│   │   ├── Header.tsx              # 반응형 헤더 + 모바일 햄버거 메뉴
│   │   ├── HeroSection.tsx         # 메인 히어로 섹션
│   │   └── PortfolioFormShared.tsx # 폼 공유 컴포넌트
│   │                               #   FieldError · ToggleChip · BackButton
│   │                               #   SubmitError · FormActionButtons · DoneScreen 등
│   ├── contexts/
│   │   ├── AuthContext.tsx         # AuthContext Provider (Firebase Auth 연동)
│   │   └── authContextDef.ts       # AuthContextValue 인터페이스 + Context 생성
│   ├── data/
│   │   ├── bookThemes.ts           # 책 테마 색상 상수 (단일 출처)
│   │   ├── roles.ts                # 직군 목록
│   │   └── stacks.ts               # 기술 스택 목록 + 아이콘 매핑
│   ├── hooks/
│   │   ├── useAuth.ts              # AuthContext 구독 훅
│   │   ├── useEditPortfolioForm.ts # 수정 폼 훅 (기존 데이터 로딩 + Firestore 업데이트)
│   │   ├── useGithubAutofill.ts    # GitHub 레포 분석 → 스택·소개 자동완성 훅
│   │   ├── useLoginForm.ts         # 로그인 폼 상태 · 유효성 · 제출 훅
│   │   ├── usePortfolioForm.ts     # 등록 폼 훅 (Firestore 저장)
│   │   ├── usePortfolioFormBase.ts # 폼 공통 상태·유효성 로직 베이스 훅
│   │   ├── usePortfolios.ts        # 포트폴리오 목록 조회 + 필터링 훅
│   │   └── useRegisterForm.ts      # 회원가입 폼 상태 · 유효성 · 제출 훅
│   ├── lib/
│   │   ├── firebase.ts             # Firebase 앱 초기화
│   │   ├── guestbookService.ts     # 방명록 Firestore CRUD
│   │   └── portfolioService.ts     # 포트폴리오 Firestore CRUD
│   ├── services/
│   │   ├── aiService.ts            # OpenAI API 호출 → 레포 분석 결과 반환
│   │   ├── firestoreService.ts     # AI 분석 결과 Firestore 캐시 읽기/쓰기
│   │   └── githubService.ts        # GitHub REST API — README·언어·설명 조회
│   ├── pages/
│   │   ├── CreatePortfolioPage.tsx # 포트폴리오 등록 페이지
│   │   ├── EditPortfolioPage.tsx   # 포트폴리오 수정 페이지
│   │   ├── LoginPage.tsx           # 로그인 페이지
│   │   ├── MainPage.tsx            # 메인 페이지 (히어로 + 방명록)
│   │   ├── RegisterPage.tsx        # 회원가입 페이지
│   │   └── ShelfPage.tsx           # 서재 탐색 페이지
│   ├── types/
│   │   └── index.ts                # Portfolio · GuestbookMessage · TechStack
│   │                               # DevStatus · ProjectType 타입 정의
│   ├── utils/
│   │   ├── errors.ts               # unknown 에러 → 문자열 변환 유틸
│   │   └── parseGithubUrl.ts       # GitHub URL에서 owner/repo 파싱 유틸
│   ├── App.tsx                     # 라우터 설정 + PrivateRoute / GuestRoute
│   ├── index.css                   # 전역 스타일 (Tailwind + 커스텀 클래스)
│   └── main.tsx                    # 앱 진입점
├── .env.local                      # Firebase 환경 변수 (비공개, Git 제외)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

### 4.2 개발 일정(WBS)

```mermaid
gantt
    title DevShelf 개발 일정
    dateFormat YYYY-MM-DD
    section 기획 / 설계
        프로젝트 초기 설정                :2026-02-27, 1d
    section 인증
        로그인 / 회원가입 페이지          :2026-03-01, 1d
        Firebase Auth 연동                :2026-03-02, 1d
        인증 상태 Context 중앙화          :2026-03-04, 1d
        PrivateRoute / GuestRoute         :2026-03-04, 1d
    section 포트폴리오
        포트폴리오 등록 페이지            :2026-03-01, 1d
        Firestore CRUD 구현               :2026-03-04, 1d
        공통 폼 훅 분리                   :2026-03-04, 1d
        서재 수정 / 삭제 기능             :2026-03-05, 1d
        공통 UI 컴포넌트 분리             :2026-03-05, 1d
    section 책 인터랙션
        BookCard / iframe 연동            :2026-03-01, 1d
        인터렉티브 책 구현                :2026-03-06, 1d
    section 방명록
        방명록 기능 구현                  :2026-03-03, 1d
        방명록 Firebase 연결 / 수정·삭제  :2026-03-05, 1d
    section GitHub AI 자동완성
        GitHub URL 파싱 / API 서비스      :2026-03-09, 1d
        Gemini 분석 서비스                :2026-03-09, 1d
        자동완성 폼 / Firestore 연동      :2026-03-09, 1d
        AI 기능 리팩토링                  :2026-03-09, 1d
        기술 스택 필터 추가               :2026-03-09, 1d
    section UI / UX
        HeroSection / 헤더                :2026-03-03, 2d
        레이아웃 / 스타일 개선            :2026-03-10, 1d
        모바일 햄버거 메뉴                :2026-03-10, 1d
    section 최적화 / 배포
        성능 최적화 / 라우팅 오류 수정    :2026-03-07, 1d
        Netlify 배포                      :2026-03-07, 1d
        코드 중복 제거 / 리팩토링         :2026-03-11, 1d
        QA 및 버그 수정                   :2026-03-11, 1d
```

---

## 5. 역할 분담

| 역할 | 이름 | 담당 |
|---|---|---|
| 팀장 | 김남희 | 플랫폼 기획 및 제작 |
| 팀원 | 김성민 | 포트폴리오 제작 |
| 팀원 | 김유진 | 플랫폼 기획, 포트폴리오 제작 |
| 팀원 | 김지민 | 포트폴리오 제작 |
| 팀원 | 이영미 | 포트폴리오 제작 |
| 팀원 | 조현진 | 포트폴리오 제작 |

---

## 6. 와이어프레임 / UI / BM

### 6.1 와이어프레임

와이어프레임 이미지를 아래에 첨부하세요.

<img src="./docs/wireframe.png" width="80%">

### 6.2 화면 설계

<table>
  <tbody>
    <tr>
      <td>메인 페이지</td>
      <td>서재 (Shelf)</td>
    </tr>
    <tr>
      <td><img src="./docs/ui_main.png" width="100%"></td>
      <td><img src="./docs/ui_shelf.png" width="100%"></td>
    </tr>
    <tr>
      <td>책 펼침 (OpenBook)</td>
      <td>포트폴리오 등록</td>
    </tr>
    <tr>
      <td><img src="./docs/ui_openbook.png" width="100%"></td>
      <td><img src="./docs/ui_create.png" width="100%"></td>
    </tr>
    <tr>
      <td>포트폴리오 수정</td>
      <td>로그인</td>
    </tr>
    <tr>
      <td><img src="./docs/ui_edit.png" width="100%"></td>
      <td><img src="./docs/ui_login.png" width="100%"></td>
    </tr>
    <tr>
      <td>회원가입</td>
      <td>방명록</td>
    </tr>
    <tr>
      <td><img src="./docs/ui_register.png" width="100%"></td>
      <td><img src="./docs/ui_guestbook.png" width="100%"></td>
    </tr>
  </tbody>
</table>

---

## 7. 데이터베이스 모델링(ERD)

Firebase Firestore는 NoSQL 문서형 DB이므로 아래와 같이 컬렉션 구조로 표현합니다.
`FIREBASE_AUTH`는 Firestore 컬렉션이 아닌 Firebase Authentication이 관리하는 사용자 엔터티입니다.

```mermaid
erDiagram
    FIREBASE_AUTH {
        string uid PK
        string email
        string displayName
    }

    PORTFOLIO {
        string id PK
        string uid FK "Firebase Auth uid"
        string name
        string role
        string tagline
        array techStack
        string description
        string github
        string liveDemo
        string spineColor
        string coverColor
        string accentColor
        string label "선택"
        number projectCount
        boolean featured "선택"
        string status "선택 — 취준·재직·학생·이직준비"
        array projectTypes "선택 — 토이·팀·사이드·오픈소스"
        timestamp createdAt
        timestamp updatedAt "수정 시 갱신"
    }

    GUESTBOOK {
        string id PK
        string uid "선택 — 비로그인 시 null"
        string name
        string message
        timestamp createdAt
    }

    FIREBASE_AUTH ||--o{ PORTFOLIO : "등록"
    FIREBASE_AUTH ||--o{ GUESTBOOK : "작성"
```

---

## 8. Architecture

```mermaid
graph TD
    User["사용자 (Browser)"]

    subgraph Netlify["Netlify (CDN)"]
        React["React + TypeScript SPA"]
    end

    subgraph Firebase["Firebase"]
        Auth["Firebase Auth\n이메일 인증"]
        Firestore["Cloud Firestore\n포트폴리오 / 방명록 / AI 캐시"]
    end

    GithubAPI["GitHub REST API\n레포 데이터 조회"]
    OpenAI["OpenAI API (wenivops proxy)\n레포 분석 → 자동완성"]

    User -->|HTTPS| React
    React -->|로그인 / 회원가입| Auth
    Auth -->|UID 발급| React
    React -->|포트폴리오·방명록 CRUD| Firestore
    Firestore -->|실시간 데이터 onSnapshot| React
    React -->|GitHub URL 입력 시| GithubAPI
    GithubAPI -->|README·언어·설명| React
    React -->|레포 데이터 전달| OpenAI
    OpenAI -->|기술스택·한줄소개·자기소개| React
    React -->|분석 결과 캐싱| Firestore

    classDef frontend fill:#4F46E5,color:#fff,stroke:none
    classDef firebase fill:#F59E0B,color:#fff,stroke:none
    classDef deploy fill:#10B981,color:#fff,stroke:none
    classDef external fill:#6B7280,color:#fff,stroke:none

    class React frontend
    class Auth,Firestore firebase
    class Netlify deploy
    class GithubAPI,OpenAI external
```

---

## 9. 성능 (Lighthouse)

Lighthouse 성능 측정 결과를 아래에 첨부하세요.

<img src="./docs/lighthouse.png" width="80%">

---

## 10. 메인 기능

### 책 인터랙션 흐름

```mermaid
sequenceDiagram
    actor U as 사용자
    participant Shelf as BookShelf
    participant Card as BookCard
    participant Cover as BookCover
    participant Open as OpenBook

    U->>Shelf: 서재 페이지 진입
    Shelf->>Shelf: Firestore에서 포트폴리오 목록 불러오기
    Shelf-->>U: 책등 목록 렌더링
    U->>Card: 책 hover
    Card-->>U: 책등 → 표지 슬라이드 애니메이션
    U->>Card: 책 클릭
    Card->>Shelf: onSelect(portfolio) 호출
    Shelf->>Cover: selection = { portfolio, phase: 'cover' }
    Cover-->>U: 표지 오버레이 표시
    U->>Cover: "OPEN" 클릭
    Cover->>Shelf: handleOpen() — phase: 'open' 으로 전환
    Shelf->>Open: selection = { portfolio, phase: 'open' }
    Open-->>U: 책 펼침 모달 (좌: 자기소개 / 우: 링크 + 액션)
    U->>Open: "Live Demo" 클릭
    Open-->>U: 새 탭으로 포트폴리오 사이트 이동
    U->>Open: 닫기 (ESC 또는 닫기 버튼)
    Open->>Shelf: handleClose() — selection = null
```

### 포트폴리오 등록 흐름

```mermaid
sequenceDiagram
    actor U as 사용자
    participant PR as PrivateRoute
    participant Page as CreatePortfolioPage
    participant Hook as usePortfolioForm
    participant FS as Firestore

    U->>PR: /portfolio/new 접근
    alt 비로그인
        PR-->>U: /login 리다이렉트
    else 로그인
        PR->>Page: 렌더링 허용
    end
    U->>Page: 폼 입력 완료
    U->>Page: "서재에 등록하기" 클릭
    Page->>Hook: handleSubmit 호출
    Hook->>Hook: touchAll() — 미입력 필드 에러 즉시 표시
    Hook->>Hook: isValid 체크
    alt 유효하지 않음
        Hook-->>U: 필드별 에러 메시지 표시
    else 유효함
        Hook->>FS: addPortfolio(form + selectedTheme + uid)
        FS-->>Hook: 저장 완료
        Hook->>Hook: done = true
        Hook-->>U: 완료 화면 (DoneScreen)
        U->>Page: "서재 둘러보기" 클릭
        Page-->>U: /shelf 이동
    end
```

### GitHub AI 자동완성 흐름

```mermaid
sequenceDiagram
    actor U as 사용자
    participant Page as CreatePortfolioPage
    participant Hook as useGithubAutofill
    participant Cache as Firestore (AI 캐시)
    participant GH as GitHub REST API
    participant AI as OpenAI API

    U->>Page: GitHub URL 입력 후 "자동완성" 클릭
    Page->>Hook: handleAutofill(url)
    Hook->>Cache: getCachedAnalysis(repoKey) 조회
    alt 캐시 있음
        Cache-->>Hook: 저장된 분석 결과 반환
    else 캐시 없음
        Hook->>GH: getGithubRepoData(url) — README·언어·설명 조회
        GH-->>Hook: 레포 데이터
        Hook->>AI: analyzeRepo(repoData) — OpenAI 프롬프트
        AI-->>Hook: 기술스택·한줄소개·자기소개 (JSON)
        Hook->>Cache: setCachedAnalysis(repoKey, result) 저장
    end
    Hook->>Hook: matchTechStacks() — AI 결과를 TechStack 타입으로 매핑
    Hook-->>Page: onAutofill({ tagline, description, techStack })
    Page-->>U: 폼 필드 자동 채우기
```

---

## 11. 에러와 에러 해결

| 에러 | 원인 | 해결 |
|---|---|---|
| 배포 후 검은 화면 (프로덕션 장애) | Netlify에 `VITE_FIREBASE_*` 환경변수 미설정 → Firebase SDK 초기화 실패 → 앱 전체 크래시 | `firebase.ts`에서 필수 환경변수 없으면 `auth`, `db`를 `null`로 export + `isConfigured` boolean 추가, OAuth 버튼 비활성화 처리 |
| `AuthContext` Fast Refresh 오류 | 컴포넌트(`AuthProvider`)와 훅(`useAuth`)을 같은 파일에서 export → HMR이 훅을 컴포넌트로 인식 불가 | `useAuth` → `hooks/useAuth.ts`로 분리, 파일당 하나의 export 단위 원칙 준수 |
| `useEffect` 내 `setState` 동기 호출 | `useEffect` 안에서 `setLoading(false)`를 동기 호출하여 "Calling setState synchronously within an effect" 경고 발생 | `useState(!!auth)`로 초기 상태를 선언 시점에 결정, effect 내 setState 제거 |
| `useEditPortfolioForm` useEffect 무한루프 | `base.setForm`이 의존성 배열에 포함되어 렌더마다 새 참조 생성 → effect 무한 재실행 | `portfolioId`, `user?.uid`만 의존성으로 지정, `base.setForm`은 의존성 배제 (`eslint-disable` 주석 처리) |

---

## 12. 향후 확장 가능성

### 12.1 AI 기반 개발자 포트폴리오 분석 고도화
현재는 GitHub 레포지토리를 기반으로 프로젝트 설명과 기술 스택을 자동 생성하는 기능을 제공한다.  
향후에는 AI 분석 기능을 확장하여 단순 요약을 넘어 개발자의 기술 역량을 분석하는 기능으로 발전시킬 수 있다.

- 프로젝트 코드 기반 기술 난이도 분석
- GitHub 활동 기반 개발자 역량 요약
- 프로젝트 핵심 기능 자동 구조화
- 코드 품질 및 협업 기여도 분석

이를 통해 플랫폼은 **AI 기반 개발자 역량 분석 플랫폼**으로 확장될 수 있다.

---

### 12.2 개발자 탐색 플랫폼으로 확장
현재는 기술 스택 중심의 필터링 기능을 제공하지만, 데이터가 축적되면 보다 정교한 개발자 탐색 시스템을 구축할 수 있다.

- 직군 기반 필터 (Frontend / Backend / AI / Mobile 등)
- 인기 프로젝트 및 추천 포트폴리오 알고리즘

---

### 12.3 개발자 커뮤니티 기능 추가
플랫폼에 개발자 포트폴리오가 축적되면 사용자 간 상호작용 기능을 추가하여 커뮤니티 기능을 강화할 수 있다.

- 포트폴리오 좋아요 및 북마크 기능
- 프로젝트 피드백 및 댓글 기능
- 개발자 팔로우 기능
- 협업 제안 및 메시지 기능

이를 통해 플랫폼은 **포트폴리오 아카이브를 넘어 개발자 네트워크 플랫폼**으로 확장될 수 있다.

---

### 12.4 기업 채용 탐색 서비스로 확장
플랫폼에 다양한 개발자의 포트폴리오 데이터가 축적되면 기업이 개발자를 탐색할 수 있는 채용 서비스로 확장할 수 있다.

- 기업 계정 생성
- 채용 공고 등록 기능
- 기술 스택 기반 개발자 검색
- AI 기반 개발자–기업 매칭 시스템

이러한 구조는 플랫폼을 **개발자 포트폴리오 서비스에서 채용 플랫폼으로 확장할 수 있는 가능성**을 제공한다.

---

### 12.5 “개발자의 서재” UX 경험 확장
본 서비스의 핵심 컨셉인 ‘개발자의 서재’를 강화하기 위해 인터랙티브 UX 요소를 확장할 수 있다.

- 사용자 개인 서재 생성 기능
- 책장 테마 커스터마이징
- 기술 분야별 서가 분류
- 추천 포트폴리오 큐레이션 서가

---

### 12.6 개발자 성장 기록 플랫폼으로 확장
향후에는 개발자의 프로젝트 기록을 지속적으로 축적하여 개발자의 성장 과정을 보여주는 기능을 추가할 수 있다.

- 프로젝트 활동 히스토리 기록
- GitHub 활동 기반 성장 그래프
- 기술 스택 변화 추적
- 개발 학습 기록 기능

이를 통해 플랫폼은 단순 포트폴리오 저장소를 넘어 **개발자의 성장 아카이브 플랫폼**으로 확장될 수 있다.

---

## 13. 개발하며 느낀 점

팀원 개인 회고를 작성해 주세요.

- **김남희**: 이번 프로젝트를 통해 크게 바뀐 점은 개발에 대한 태도였다. 나는 평소 생각이 앞서고 행동이 느린 편이었다. 하지만 실제 개발을 진행하면서 완벽한 설계를 기다리기보다 작은 기능이라도 먼저 구현하고 반복적으로 개선하는 방식이 훨씬 빠른 학습으로 이어진다는 것을 체감했다. ‘개발자의 서재’를 만들면서 아이디어를 실제 서비스로 구현하는 과정 자체를 경험할 수 있었다. 앞으로도 새로운 아이디어가 떠오르면 고민만 하기보다 먼저 만들어 보고, 사용자 경험을 개선하며 발전시키는 개발자가 되고 싶다.
- **김성민**: 최초 이 교육을 받기로 했을때 만들고 싶었던 프로그램의 간단한 시연용 프로토타입을 만들어봤다. 공통목표가 아닌 각자 개인별 포트폴리오를 합쳐서 볼 수 있도록 만들자는 팀원의 아이디어 덕분에 시작해볼 수 있었다. 최근 바이브코딩으로 개발기술의 중심이 넘어가면서 배워온 기술 사용&구현 보다는 목표에 중점을 두기로 했다. 시간이 많지않아 일단 간단한 프로토타입을 제작했지만 이후 실제 동작하는 초기 서비스용 프로토타입 개발로 넘어갈 예정이다.
- **김유진**: 이번 포트폴리오 페이지를 만들면서 단순히 화면을 구현하는 것을 넘어, 지금까지 내가 해온 활동과 성과를 하나의 흐름으로 정리해볼 수 있어서 의미 있었다. 또 처음으로 나만의 웹 포트폴리오를 만들어보며, 디자인과 정보 전달 방식을 함께 고민해본 점도 좋은 경험이었다. 아직 부족한 부분은 있지만, 앞으로 더 많은 프로젝트와 경험을 쌓아가며 계속 업데이트해 나가려고 한다.
- **김지민**: 팀 프로젝트에 맞춰 개인 포트폴리오를 설계하고 구현한 경험은 무척 유용했습니다. 네이비 테마 색깔에 걸맞는 인터랙티브 디자인을 적용해보며 사용자 경험을 중요하게 생각하게 되었습니다.
- **이영미**: 이번 프로젝트를 통해 개발을 처음 접하는 입장에서 많은 도전과 배움이 있었다. 익숙하지 않은 기술과 환경 속에서 시행착오도 있었지만, 팀원들과 함께 문제를 해결해 나가면서 개발의 흐름과 협업의 중요성을 느낄 수 있었다. 특히 작은 기능이 완성되어 화면에 구현되는 경험이 큰 동기부여가 되었다. 앞으로도 꾸준히 학습하며 뷰티 분야와 기술을 연결하는 새로운 가능성을 만들어 보고 싶다.
- **조현진**: 개발자 포트폴리오를 한곳에서 볼 수 있는 플랫폼이 있으면 좋겠다는 팀원의 아이디어를 직접 실현해볼 수 있어서 의미 있었다. 동시에 나만의 포트폴리오를 처음으로 만들어보며 부트캠프 동안 쌓아온 것들을 되돌아볼 수 있는 시간이 됐다.
