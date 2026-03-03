기술 스택
Environment: Vite, React, TypeScript
Deployment: Netlify
Package Manager: npm
브랜치 전략
안전한 협업을 위해 develop 브랜치를 중심으로 작업합니다.

main: 최종 배포용 브랜치 (직접 커밋 절대 금지 ❌)
develop: 개발 통합용 메인 브랜치 (이곳으로 PR)
feature/기능이름: 각자 개인 작업 시 생성하는 브랜치 (예: feature/login, feature/feed)

팀 그라운드 룰 및 컨벤션
1. 코드 포맷팅
작업 전 반드시 Prettier와 ESLint 확장 프로그램을 설치해 주세요.
VS Code 설정에서 Format on Save를 켜두어 저장 시 자동으로 코드가 정렬되게 합니다.
2. 절대 경로 사용
상대 경로 지옥(../../../)을 피하기 위해 절대 경로를 사용합니다.
예시: import Button from '@/components/Button'


커밋 메시지 컨벤션
어떤 작업을 했는지 알아보기 쉽게 말머리를 통일합니다.

feat: 새로운 기능 추가 (예: feat: 로그인 이메일 유효성 검사 추가)
issue: 문제 발생 보고 (예: issue: 로그인 오류 발생)
fix: 버그 및 에러 수정 (예: fixed: 로그인 오류 수정)
style: UI/UX 디자인 변경 (CSS 등)
etc: 기타 변경사항

로컬 실행 방법
# 1. 패키지 설치
npm install

# 2. 로컬 서버 실행
npm run dev


GitHub PR & Netlify Preview + 브랜치 정리 과정
1. 작업용 브랜치 생성

목적: develop 브랜치를 바로 수정하지 않고 안전하게 작업하기 위해 새 브랜치를 만든다.

명령어:

git checkout -b feature/my-feature

설명:

git checkout -b → 새 브랜치를 만들고 바로 이동

feature/my-feature → 브랜치 이름, 작업 내용을 알기 쉽게

2. 코드 수정 후 커밋

목적: 변경한 내용을 Git에 기록

명령어:

git add .
git commit -m "로그인 버튼 추가"

설명:

git add . → 변경한 모든 파일을 커밋 대상으로 지정

git commit -m "메시지" → 변경 사항 기록

3. 원격 저장소(GitHub)로 푸시

목적: 로컬 브랜치를 GitHub에 올려 PR을 만들 수 있게 함

명령어:

git push origin feature/my-feature

결과: GitHub에서 PR 생성 가능

4. GitHub에서 PR 생성

목적: develop 브랜치에 합치기 전에 코드 검토 및 Netlify Preview 확인

방법:

GitHub 리포지토리 → 최근 푸시 브랜치 확인

Compare & pull request 클릭

제목/설명 작성 (예: “로그인 버튼 기능 추가”)

Base branch: develop

Compare branch: feature/my-feature

5. PR 제출 후 Netlify Preview 확인

목적: 배포 전 사이트 미리보기

방법:

PR 제출 → Netlify가 자동으로 Deploy Preview URL 생성

브라우저에서 링크 클릭 → 배포 전 확인

Tip: 프리뷰 링크는 팀원과 공유 가능, 수정 후 커밋하면 자동 갱신

6. Pull Request 병합

목적: 작업 완료 후 develop 브랜치에 반영

방법:

GitHub PR 페이지 → Create pull request 클릭

Merge pull request 클릭

Confirm merge 클릭 → 변경 사항 main 브랜치에 적용

Delete branch 클릭 → 원격 브랜치 삭제

7. 로컬 브랜치 정리

목적: 불필요한 브랜치 제거, 작업 환경 정리

명령어:

git checkout develop  # ⚠️ main이 아닌 develop 브랜치로 이동
git pull              # 최신 상태 반영
git branch -d feature/my-feature  # 사용 완료 브랜치 삭제

설명:

git branch -d → 로컬 브랜치 삭제

git checkout develop → 개발용 브랜치로 이동 후 관리