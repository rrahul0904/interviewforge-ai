import type { Difficulty, QuestionQuery, QuestionSort, Track } from "@interviewforge/core";

type SearchValue = string | string[] | undefined;
export type PageSearchParams = Record<string, SearchValue>;

const first = (value: SearchValue) => Array.isArray(value) ? value[0] : value;
const enumValue = <T extends string>(value: string | null | undefined, allowed: readonly T[]): T | undefined =>
  value && allowed.includes(value as T) ? value as T : undefined;
const numberValue = (value: string | null | undefined): number | undefined => {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const tracks: readonly Track[] = ["CODING", "SQL", "SYSTEM_DESIGN", "ML_SYSTEM_DESIGN", "OOD", "BEHAVIORAL"];
const difficulties: readonly Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const sorts: readonly QuestionSort[] = ["RECENT", "FREQUENCY", "CONFIDENCE"];

export function parseQuestionQuery(input: URLSearchParams | PageSearchParams): QuestionQuery {
  const get = (key: string) => input instanceof URLSearchParams ? input.get(key) ?? undefined : first(input[key]);
  const minConfidenceRaw = numberValue(get("minConfidence"));
  const minConfidence = minConfidenceRaw === undefined ? undefined : minConfidenceRaw > 1 ? minConfidenceRaw / 100 : minConfidenceRaw;
  return {
    search: get("search")?.trim() || undefined,
    company: get("company")?.trim() || undefined,
    track: enumValue(get("track"), tracks),
    difficulty: enumValue(get("difficulty"), difficulties),
    minConfidence,
    reportedSince: get("reportedSince")?.trim() || undefined,
    sort: enumValue(get("sort"), sorts),
    offset: numberValue(get("offset")),
    limit: numberValue(get("limit")),
  };
}

export function queryToSearchParams(query: QuestionQuery, overrides: Partial<QuestionQuery> = {}): URLSearchParams {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (merged.search) params.set("search", merged.search);
  if (merged.company) params.set("company", merged.company);
  if (merged.track) params.set("track", merged.track);
  if (merged.difficulty) params.set("difficulty", merged.difficulty);
  if (merged.minConfidence !== undefined) params.set("minConfidence", String(merged.minConfidence));
  if (merged.reportedSince) params.set("reportedSince", merged.reportedSince);
  if (merged.sort) params.set("sort", merged.sort);
  if (merged.offset) params.set("offset", String(merged.offset));
  if (merged.limit && merged.limit !== 25) params.set("limit", String(merged.limit));
  return params;
}
