export type Track = "CODING" | "SQL" | "SYSTEM_DESIGN" | "ML_SYSTEM_DESIGN" | "OOD" | "BEHAVIORAL";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface InterviewQuestion {
  id: string; slug: string; title: string; track: Track; difficulty: Difficulty;
  companies: string[]; skills: string[]; lastReportedAt: string; reportCount: number;
  confidence: number; frequencyScore: number; summary: string; constraints: string[]; hints: string[];
}
export interface Company { id: string; name: string; slug: string; questionCount: number; reportCount: number; freshness: number; }
export interface ForumPost { id: string; title: string; category: "INTERVIEW_EXPERIENCE"|"COMPENSATION"|"CAREER_DEVELOPMENT"|"COMPANY_CULTURE"|"OTHER"; company: string; author: string; createdAt: string; replies: number; reactions: number; views: number; excerpt: string; }
export interface EvidenceSignal { independentReports: number; sourceDiversity: number; ageDays: number; moderationApproved: boolean; }

export function evidenceConfidence(signal: EvidenceSignal): number {
  if (!signal.moderationApproved) return 0;
  const reports = Math.min(signal.independentReports / 5, 1) * 0.45;
  const diversity = Math.min(signal.sourceDiversity / 3, 1) * 0.25;
  const freshness = Math.max(0, 1 - signal.ageDays / 180) * 0.30;
  return Math.round(Math.min(1, reports + diversity + freshness) * 100) / 100;
}

export function freshnessScore(lastReportedAt: Date, now = new Date()): number {
  const age = Math.max(0, (now.getTime() - lastReportedAt.getTime()) / 86_400_000);
  return Math.max(0, Math.round(100 * Math.exp(-age / 60)));
}
