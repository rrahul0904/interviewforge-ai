import type { InterviewQuestion, Track } from "./index";

export type IntegrityMode = "PRACTICE" | "AI_ALLOWED" | "LIVE_NOTES";
export type ResponseFormat = "CONCISE" | "BULLETS" | "STAR" | "FOLLOW_UP";

export interface CandidateContext {
  role: string;
  company?: string;
  targetRound?: string;
  resumeText: string;
  jobDescription: string;
  integrityMode: IntegrityMode;
}

export interface CandidateEvidence {
  id: string;
  text: string;
  source: "RESUME";
}

export interface MockInterviewPrompt {
  id: string;
  prompt: string;
  competency: string;
  track: Track;
  source: "CANDIDATE_CONTEXT" | "INTELLIGENCE_GRAPH";
  confidence: number;
  expectedSignals: string[];
  evidenceRefs: string[];
}

export interface MockInterviewPlan {
  id: string;
  contextFingerprint: string;
  integrityMode: IntegrityMode;
  policyNotice: string;
  candidateEvidence: CandidateEvidence[];
  questions: MockInterviewPrompt[];
}

export interface AnswerScore {
  relevance: number;
  evidence: number;
  structure: number;
  concision: number;
  total: number;
  strengths: string[];
  improvements: string[];
  modelOutline: string[];
}

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function simpleHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function candidateContextFingerprint(context: CandidateContext): string {
  const canonical = [
    normalize(context.role).toLowerCase(),
    normalize(context.company ?? "").toLowerCase(),
    normalize(context.targetRound ?? "").toLowerCase(),
    normalize(context.resumeText),
    normalize(context.jobDescription),
    context.integrityMode,
  ].join("|");
  return simpleHash(canonical);
}

export function extractCandidateEvidence(resumeText: string, limit = 8): CandidateEvidence[] {
  const lines = resumeText
    .split(/\r?\n/)
    .map((line) => normalize(line.replace(/^[•*\-–—]+\s*/, "")))
    .filter((line) => line.length >= 18);

  const seen = new Set<string>();
  const evidence: CandidateEvidence[] = [];
  for (const line of lines) {
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    evidence.push({ id: `resume-${evidence.length + 1}`, text: line, source: "RESUME" });
    if (evidence.length >= limit) break;
  }
  return evidence;
}

function roleKeywords(context: CandidateContext): string[] {
  const stop = new Set(["and", "the", "with", "for", "from", "that", "this", "your", "you", "our", "are", "will", "have", "has", "job", "role"]);
  const tokens = `${context.role} ${context.jobDescription}`
    .toLowerCase()
    .replace(/[^a-z0-9+#.\- ]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !stop.has(token));
  const counts = new Map<string, number>();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(([token]) => token);
}

function questionMatchesContext(question: InterviewQuestion, context: CandidateContext, keywords: string[]): boolean {
  const haystack = [question.title, question.summary, ...question.companies, ...question.skills].join(" ").toLowerCase();
  const companyMatch = context.company ? question.companies.some((candidate) => candidate.toLowerCase() === context.company!.toLowerCase()) : false;
  return companyMatch || keywords.some((keyword) => haystack.includes(keyword));
}

function policyNotice(mode: IntegrityMode): string {
  if (mode === "PRACTICE") return "Practice mode: AI coaching is intended for rehearsal before an interview.";
  if (mode === "AI_ALLOWED") return "AI-allowed mode: use assistance only when the interviewer or employer has explicitly permitted it.";
  return "Live-notes mode: keep assistance limited to your own notes and verified experience; follow the employer's interview policy.";
}

export function buildMockInterviewPlan(context: CandidateContext, inventory: readonly InterviewQuestion[] = []): MockInterviewPlan {
  const evidence = extractCandidateEvidence(context.resumeText);
  const keywords = roleKeywords(context);
  const questions: MockInterviewPrompt[] = [];

  questions.push({
    id: "intro-evidence",
    prompt: `Walk me through the experience that best prepares you for this ${normalize(context.role) || "role"}.`,
    competency: "relevance",
    track: "BEHAVIORAL",
    source: "CANDIDATE_CONTEXT",
    confidence: 1,
    expectedSignals: ["specific example", "scope", "personal contribution", "measurable result"],
    evidenceRefs: evidence.slice(0, 3).map((item) => item.id),
  });

  questions.push({
    id: "tradeoff",
    prompt: `Describe a difficult trade-off you made that is relevant to ${keywords.slice(0, 3).join(", ") || "this role"}. What options did you consider and what changed because of your decision?`,
    competency: "judgment",
    track: "BEHAVIORAL",
    source: "CANDIDATE_CONTEXT",
    confidence: 1,
    expectedSignals: ["alternatives", "decision criteria", "ownership", "outcome", "reflection"],
    evidenceRefs: evidence.slice(0, 4).map((item) => item.id),
  });

  const graphQuestion = inventory
    .filter((question) => questionMatchesContext(question, context, keywords))
    .sort((a, b) => b.confidence - a.confidence || b.frequencyScore - a.frequencyScore)[0];

  if (graphQuestion) {
    questions.push({
      id: `graph-${graphQuestion.id}`,
      prompt: graphQuestion.title,
      competency: graphQuestion.skills[0] ?? graphQuestion.track.toLowerCase(),
      track: graphQuestion.track,
      source: "INTELLIGENCE_GRAPH",
      confidence: graphQuestion.confidence,
      expectedSignals: graphQuestion.constraints.slice(0, 4),
      evidenceRefs: [],
    });
  } else {
    questions.push({
      id: "role-depth",
      prompt: `Take one core responsibility from the job description for ${normalize(context.role) || "this role"}. Explain how you would approach it, what could fail, and how you would measure success.`,
      competency: "role depth",
      track: "SYSTEM_DESIGN",
      source: "CANDIDATE_CONTEXT",
      confidence: 0.75,
      expectedSignals: ["assumptions", "approach", "failure modes", "measurement"],
      evidenceRefs: [],
    });
  }

  questions.push({
    id: "follow-up-pressure",
    prompt: "Now challenge your own answer. What assumption is most likely to be wrong, and what would you do if it fails?",
    competency: "adaptability",
    track: "BEHAVIORAL",
    source: "CANDIDATE_CONTEXT",
    confidence: 1,
    expectedSignals: ["risk", "signal", "fallback", "learning"],
    evidenceRefs: [],
  });

  const fingerprint = candidateContextFingerprint(context);
  return {
    id: `mock-${fingerprint}`,
    contextFingerprint: fingerprint,
    integrityMode: context.integrityMode,
    policyNotice: policyNotice(context.integrityMode),
    candidateEvidence: evidence,
    questions,
  };
}

export function formatCoaching(format: ResponseFormat, score: AnswerScore): string[] {
  if (format === "CONCISE") return score.modelOutline.slice(0, 2);
  if (format === "FOLLOW_UP") return ["Ask: What would success look like in the first 90 days?", "Ask: Which trade-offs matter most to this team?"];
  if (format === "STAR") return ["Situation — establish only the context needed", "Task — state your responsibility", "Action — explain your decisions and contribution", "Result — quantify the outcome and learning"];
  return score.modelOutline;
}

export function scoreInterviewAnswer(answer: string, prompt: MockInterviewPrompt): AnswerScore {
  const clean = normalize(answer);
  const words = clean ? clean.split(/\s+/) : [];
  const lower = clean.toLowerCase();
  const promptTerms = prompt.prompt.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((term) => term.length >= 5);
  const matchedTerms = promptTerms.filter((term) => lower.includes(term)).length;
  const relevance = clampScore(45 + Math.min(45, matchedTerms * 9) + (words.length >= 35 ? 10 : 0));
  const evidenceMarkers = [/\b\d+%\b/, /\b\d+\b/, /because\b/, /result\b/, /impact\b/, /measured\b/, /reduced\b/, /increased\b/];
  const evidence = clampScore(30 + evidenceMarkers.filter((pattern) => pattern.test(lower)).length * 10);
  const structureMarkers = [/situation\b/, /task\b/, /action\b/, /result\b/, /first\b/, /then\b/, /finally\b/];
  const structure = clampScore(35 + structureMarkers.filter((pattern) => pattern.test(lower)).length * 9);
  const concision = words.length === 0 ? 0 : words.length <= 180 ? 100 : words.length <= 260 ? 78 : words.length <= 360 ? 55 : 35;
  const total = clampScore(relevance * 0.35 + evidence * 0.25 + structure * 0.25 + concision * 0.15);

  const strengths: string[] = [];
  const improvements: string[] = [];
  if (relevance >= 75) strengths.push("Stays close to the question."); else improvements.push("Open with a direct answer before adding context.");
  if (evidence >= 70) strengths.push("Uses concrete evidence or outcomes."); else improvements.push("Add a specific outcome, metric, or observable result from your real experience.");
  if (structure >= 70) strengths.push("Has a clear narrative structure."); else improvements.push("Use a simple STAR or problem → decision → outcome structure.");
  if (concision >= 78) strengths.push("Length is easy for an interviewer to follow."); else improvements.push("Cut setup detail and move the result earlier.");

  return {
    relevance,
    evidence,
    structure,
    concision,
    total,
    strengths,
    improvements,
    modelOutline: [
      "Lead with a one-sentence answer to the question.",
      "Use one verified example from your resume or lived experience.",
      "Explain the decision or action you personally owned.",
      "Close with a measurable result and what you learned.",
    ],
  };
}
