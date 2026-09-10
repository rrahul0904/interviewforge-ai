export type Track = "CODING" | "SQL" | "SYSTEM_DESIGN" | "ML_SYSTEM_DESIGN" | "OOD" | "BEHAVIORAL";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionSort = "RECENT" | "FREQUENCY" | "CONFIDENCE";

export interface InterviewQuestion {
  id: string; slug: string; title: string; track: Track; difficulty: Difficulty;
  companies: string[]; skills: string[]; lastReportedAt: string; reportCount: number;
  confidence: number; frequencyScore: number; summary: string; constraints: string[]; hints: string[];
}
export interface Company { id: string; name: string; slug: string; questionCount: number; reportCount: number; freshness: number; }
export interface ForumPost { id: string; title: string; category: "INTERVIEW_EXPERIENCE"|"COMPENSATION"|"CAREER_DEVELOPMENT"|"COMPANY_CULTURE"|"OTHER"; company: string; author: string; createdAt: string; replies: number; reactions: number; views: number; excerpt: string; }
export interface EvidenceSignal { independentReports: number; sourceDiversity: number; ageDays: number; moderationApproved: boolean; }

export interface QuestionQuery {
  search?: string;
  company?: string;
  track?: Track;
  difficulty?: Difficulty;
  minConfidence?: number;
  reportedSince?: string;
  sort?: QuestionSort;
  offset?: number;
  limit?: number;
}

export interface QuestionQueryResult {
  data: InterviewQuestion[];
  total: number;
  offset: number;
  limit: number;
  nextOffset: number | null;
}

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

const normalized = (value: string) => value.trim().toLocaleLowerCase();
const finiteNumber = (value: number | undefined, fallback: number) => Number.isFinite(value) ? Number(value) : fallback;

export function queryQuestions(items: readonly InterviewQuestion[], query: QuestionQuery = {}): QuestionQueryResult {
  const search = query.search ? normalized(query.search) : "";
  const company = query.company ? normalized(query.company) : "";
  const minConfidence = Math.min(1, Math.max(0, finiteNumber(query.minConfidence, 0)));
  const reportedSince = query.reportedSince ? Date.parse(query.reportedSince) : Number.NaN;

  const filtered = items.filter((question) => {
    if (query.track && question.track !== query.track) return false;
    if (query.difficulty && question.difficulty !== query.difficulty) return false;
    if (question.confidence < minConfidence) return false;
    if (company && !question.companies.some((candidate) => normalized(candidate) === company)) return false;
    if (Number.isFinite(reportedSince) && Date.parse(question.lastReportedAt) < reportedSince) return false;
    if (search) {
      const haystack = [question.title, question.summary, ...question.companies, ...question.skills].join(" ").toLocaleLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  const sort = query.sort ?? "FREQUENCY";
  filtered.sort((a, b) => {
    if (sort === "RECENT") return Date.parse(b.lastReportedAt) - Date.parse(a.lastReportedAt) || b.frequencyScore - a.frequencyScore;
    if (sort === "CONFIDENCE") return b.confidence - a.confidence || b.reportCount - a.reportCount;
    return b.frequencyScore - a.frequencyScore || b.reportCount - a.reportCount;
  });

  const offset = Math.max(0, Math.floor(finiteNumber(query.offset, 0)));
  const limit = Math.min(100, Math.max(1, Math.floor(finiteNumber(query.limit, 25))));
  const data = filtered.slice(offset, offset + limit);
  const nextOffset = offset + data.length < filtered.length ? offset + data.length : null;
  return { data, total: filtered.length, offset, limit, nextOffset };
}
