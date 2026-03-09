import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { TechStack } from "@/types";

export interface ProjectData {
  title: string;
  description: string;
  techStack: TechStack[];
  features: string;
}

export interface ProjectDocument extends ProjectData {
  id: string;
  createdAt: string;
}

/**
 * 프로젝트를 Firestore 'projects' 컬렉션에 저장합니다.
 * @returns 생성된 문서의 ID
 */
export async function addProject(data: ProjectData): Promise<string> {
  if (!db) throw new Error("Firestore가 설정되지 않았습니다.");

  const ref = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

/**
 * 'projects' 컬렉션의 모든 문서를 최신순으로 가져옵니다.
 * @returns 프로젝트 배열
 */
export async function fetchProjects(): Promise<ProjectDocument[]> {
  if (!db) return [];

  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title ?? "",
      description: data.description ?? "",
      techStack: (data.techStack ?? []) as TechStack[],
      features: data.features ?? "",
      createdAt: data.createdAt?.toDate().toISOString() ?? "",
    };
  });
}

/**
 * 특정 프로젝트를 Firestore에서 영구 삭제합니다.
 * @param id - 삭제할 문서의 ID
 */
export async function deleteProject(id: string): Promise<void> {
  if (!db) throw new Error("Firestore가 설정되지 않았습니다.");

  await deleteDoc(doc(db, "projects", id));
}
