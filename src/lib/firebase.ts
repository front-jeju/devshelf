/**
 * firebase.ts
 * Firebase SDK를 초기화하고 Auth·Firestore 인스턴스를 내보내는 파일입니다.
 *
 * ⚠️ 환경변수(VITE_FIREBASE_*)가 하나라도 없으면 Firebase를 초기화하지 않습니다.
 *    이 경우 auth·db는 null이 되며, 각 서비스 함수는 null 체크 후 에러를 던집니다.
 *    (환경변수 미설정 상태에서 앱이 크래시되는 것을 방지하기 위한 안전장치입니다)
 *
 * 환경변수 설정 방법:
 *   프로젝트 루트의 .env.local 파일에 VITE_FIREBASE_* 값을 채워넣으세요.
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Vite 환경변수에서 Firebase 설정값을 가져옵니다
const {
  VITE_FIREBASE_API_KEY: apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: authDomain,
  VITE_FIREBASE_PROJECT_ID: projectId,
  VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID: appId,
} = import.meta.env;

// 필수 3개 값(apiKey, authDomain, projectId)이 모두 있어야 초기화 가능으로 판단
const isConfigured = !!(apiKey && authDomain && projectId);

let auth: Auth | null = null;
let db: Firestore | null = null;
let githubProvider: GithubAuthProvider | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isConfigured) {
  const app = initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId });
  auth = getAuth(app);           // Firebase 인증 인스턴스
  db = getFirestore(app);        // Firestore DB 인스턴스
  githubProvider = new GithubAuthProvider();
  googleProvider = new GoogleAuthProvider();
}

export { auth, db, githubProvider, googleProvider, isConfigured };
