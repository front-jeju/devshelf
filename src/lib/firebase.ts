import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const {
  VITE_FIREBASE_API_KEY: apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: authDomain,
  VITE_FIREBASE_PROJECT_ID: projectId,
  VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID: appId,
} = import.meta.env;

// 필수 환경변수가 없으면 Firebase를 초기화하지 않음
// (배포 시 환경변수 미설정으로 인한 앱 크래시 방지)
const isConfigured = !!(apiKey && authDomain && projectId);

let auth: Auth | null = null;
let db: Firestore | null = null;
let githubProvider: GithubAuthProvider | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isConfigured) {
  const app = initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId });
  auth = getAuth(app);
  db = getFirestore(app);
  githubProvider = new GithubAuthProvider();
  googleProvider = new GoogleAuthProvider();
}

export { auth, db, githubProvider, googleProvider, isConfigured };
