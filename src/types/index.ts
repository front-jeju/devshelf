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

export interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  role: string;
  tagline: string;
  techStack: TechStack[];
  description: string;
  github: string;
  liveDemo: string;
  spineColor: string;
  coverColor: string;
  accentColor: string;
  projectCount: number;
  featured?: boolean;
}
