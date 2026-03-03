# README.md

# 프로젝트 README

## 기술 스택

* **Environment:** Vite, React, TypeScript
* **Deployment:** Netlify
* **Package Manager:** npm

---

## 브랜치 전략

안전한 협업을 위해 `develop` 브랜치를 중심으로 작업합니다.

* **main:** 최종 배포용 브랜치 (직접 커밋 절대 금지 ❌)
* **develop:** 개발 통합용 메인 브랜치 (PR 대상)
* **feature/기능이름:** 각자 개인 작업 시 생성하는 브랜치 (예: `feature/login`, `feature/feed`)

---

## 팀 그라운드 룰 및 컨벤션

### 1. 코드 포맷팅

* 작업 전 반드시 Prettier와 ESLint 확장 프로그램 설치
* VS Code 설정에서 **Format on Save** 활성화 → 저장 시 자동 정렬

### 2. 절대 경로 사용

* 상대 경로 지옥(`../../../`) 방지 위해 절대 경로 사용
* 예시:

```ts
import Button from '@/components/Button'
```

---

## 커밋 메시지 컨벤션

작업 내용을 쉽게 파악할 수 있도록 말머리 통일

| 타입    | 용도           | 예시                        |
| ----- | ------------ | ------------------------- |
| feat  | 새로운 기능 추가    | `feat: 로그인 이메일 유효성 검사 추가` |
| issue | 문제 발생 보고     | `issue: 로그인 오류 발생`        |
| fix   | 버그/에러 수정     | `fix: 로그인 오류 수정`          |
| style | UI/UX 디자인 변경 | `style: 버튼 색상 변경`         |
| etc   | 기타 변경사항      | `etc: 패키지 업데이트`           |

---

## 로컬 실행 방법

1. 패키지 설치

```bash
npm install
```

2. 로컬 서버 실행

```bash
npm run dev
```

---

## GitHub PR & Netlify Preview + 브랜치 정리 과정

### 1. 작업용 브랜치 생성

* 목적: `develop` 브랜치를 바로 수정하지 않고 안전하게 작업
* 명령어:

```bash
git checkout -b feature/my-feature
```

* 설명:

  * `git checkout -b` → 새 브랜치 생성 후 바로 이동
  * `feature/my-feature` → 브랜치 이름 (작업 내용 알기 쉽게)

### 2. 코드 수정 후 커밋

* 목적: 변경 내용 Git 기록
* 명령어:

```bash
git add .
git commit -m "로그인 버튼 추가"
```

* 설명:

  * `git add .` → 변경 파일 모두 커밋 대상으로 지정
  * `git commit -m "메시지"` → 변경 사항 기록

### 3. 원격 저장소(GitHub)로 푸시

* 목적: PR 생성 가능
* 명령어:

```bash
git push origin feature/my-feature
```

### 4. GitHub에서 PR 생성

* 목적: develop 브랜치에 합치기 전 코드 검토 및 Netlify Preview 확인
* 방법:

  1. GitHub 리포지토리 → 최근 푸시 브랜치 확인
  2. **Compare & pull request** 클릭
  3. 제목/설명 작성 (예: “로그인 버튼 기능 추가”)
  4. Base branch: `develop`
  5. Compare branch: `feature/my-feature`

### 5. PR 제출 후 Netlify Preview 확인

* 목적: 배포 전 사이트 미리보기
* 방법:

  * PR 제출 → Netlify Deploy Preview URL 생성
  * 브라우저에서 링크 클릭 → 배포 전 확인
  * Tip: 프리뷰 링크 팀원과 공유 가능, 커밋 시 자동 갱신

### 6. Pull Request 병합

* 목적: 작업 완료 후 `develop` 브랜치 반영
* 방법:

  1. GitHub PR 페이지 → **Create pull request** 클릭
  2. **Merge pull request** 클릭
  3. Confirm merge 클릭 → 변경 사항 main 브랜치에 적용
  4. **Delete branch** 클릭 → 원격 브랜치 삭제

### 7. 로컬 브랜치 정리

* 목적: 불필요한 브랜치 제거, 작업 환경 정리
* 명령어:

```bash
git checkout develop  # ⚠️ main이 아닌 develop 브랜치로 이동
git pull              # 최신 상태 반영
git branch -d feature/my-feature  # 사용 완료 브랜치 삭제
```

* 설명:

  * `git branch -d` → 로컬 브랜치 삭제
  * `git checkout develop` → 개발용 브랜치로 이동 후 관리
