import type { Company, ForumPost, InterviewQuestion } from "@interviewforge/core";

export const companies: Company[] = [
  { id: "openai", name: "OpenAI", slug: "openai", questionCount: 48, reportCount: 214, freshness: 95 },
  { id: "anthropic", name: "Anthropic", slug: "anthropic", questionCount: 33, reportCount: 119, freshness: 92 },
  { id: "snowflake", name: "Snowflake", slug: "snowflake", questionCount: 57, reportCount: 301, freshness: 88 },
  { id: "meta", name: "Meta", slug: "meta", questionCount: 84, reportCount: 820, freshness: 85 },
  { id: "google", name: "Google", slug: "google", questionCount: 96, reportCount: 1042, freshness: 83 },
  { id: "stripe", name: "Stripe", slug: "stripe", questionCount: 41, reportCount: 187, freshness: 80 },
];

export const questions: InterviewQuestion[] = [
  {
    id: "q1", slug: "rate-limiter-design", title: "Design a distributed rate limiter", track: "SYSTEM_DESIGN", difficulty: "HARD",
    companies: ["OpenAI", "Stripe"], skills: ["distributed-systems", "redis", "consistency"],
    lastReportedAt: "2026-08-29", reportCount: 12, confidence: 0.94, frequencyScore: 91,
    summary: "Design a low-latency global rate limiting service with tenant-specific policies and graceful degradation.",
    constraints: ["Multi-region", "100k+ checks/second", "per-tenant policies", "burst handling"],
    hints: ["Start by separating policy storage from the hot request path.", "Discuss token bucket vs sliding window trade-offs.", "Be explicit about consistency during regional partitions."],
  },
  {
    id: "q2", slug: "streaming-top-k", title: "Top-K events in a streaming window", track: "CODING", difficulty: "MEDIUM",
    companies: ["Snowflake", "Databricks"], skills: ["heap", "streaming", "hash-map"],
    lastReportedAt: "2026-08-31", reportCount: 19, confidence: 0.97, frequencyScore: 89,
    summary: "Maintain the K most frequent event types over a moving time window.",
    constraints: ["Events arrive continuously", "Memory is bounded", "K is much smaller than unique event count"],
    hints: ["Clarify whether the window is time- or count-based.", "Think about lazy heap invalidation.", "Explain amortized complexity."],
  },
  {
    id: "q3", slug: "subscription-retention-sql", title: "Monthly subscription retention by cohort", track: "SQL", difficulty: "MEDIUM",
    companies: ["Stripe", "Airbnb"], skills: ["sql", "window-functions", "cohorts"],
    lastReportedAt: "2026-08-27", reportCount: 8, confidence: 0.89, frequencyScore: 76,
    summary: "Calculate M0–M6 retention for user signup cohorts from subscription activity.",
    constraints: ["PostgreSQL syntax", "monthly cohorts", "multiple subscription periods per user"],
    hints: ["Build a user-level cohort table first.", "Normalize activity into distinct user-months.", "Use conditional aggregation for the final pivot."],
  },
  {
    id: "q4", slug: "feature-store-ml", title: "Design an online/offline feature store", track: "ML_SYSTEM_DESIGN", difficulty: "HARD",
    companies: ["Uber", "OpenAI"], skills: ["ml-platform", "data-consistency", "streaming"],
    lastReportedAt: "2026-08-22", reportCount: 7, confidence: 0.86, frequencyScore: 72,
    summary: "Design feature computation and serving with point-in-time correctness for training and low-latency online inference.",
    constraints: ["Point-in-time joins", "<10ms online reads", "backfills", "schema evolution"],
    hints: ["Separate compute semantics from storage implementation.", "Address training-serving skew explicitly.", "Include observability for feature freshness."],
  },
  {
    id: "q5", slug: "parking-garage-ood", title: "Design an extensible parking garage", track: "OOD", difficulty: "MEDIUM",
    companies: ["Amazon", "Microsoft"], skills: ["oop", "solid", "state-machines"],
    lastReportedAt: "2026-08-18", reportCount: 9, confidence: 0.84, frequencyScore: 68,
    summary: "Model vehicle entry, spot allocation, tickets, pricing and payment while keeping the design extensible.",
    constraints: ["multiple vehicle types", "dynamic pricing", "multiple floors", "payments"],
    hints: ["Identify stable domain boundaries before choosing patterns.", "Avoid a giant Garage class.", "Show how a new pricing policy would be added."],
  },
  {
    id: "q6", slug: "dependency-graph", title: "Detect cycles in service dependencies", track: "CODING", difficulty: "MEDIUM",
    companies: ["Google", "Meta"], skills: ["graphs", "dfs", "topological-sort"],
    lastReportedAt: "2026-08-30", reportCount: 15, confidence: 0.95, frequencyScore: 87,
    summary: "Given directed service dependencies, detect whether deployment ordering is possible and return one valid order.",
    constraints: ["up to 100k services", "duplicate edges possible", "return cycle evidence when invalid"],
    hints: ["Both DFS coloring and Kahn's algorithm work.", "Decide how you will surface a cycle.", "Discuss memory complexity for sparse graphs."],
  },
];

export const forumPosts: ForumPost[] = [
  { id: "f1", title: "OpenAI platform engineering onsite — August 2026", category: "INTERVIEW_EXPERIENCE", company: "OpenAI", author: "signalstack", createdAt: "2026-09-01", replies: 14, reactions: 39, views: 812, excerpt: "Four rounds: coding, systems, debugging, and cross-functional. The systems round stayed very operational and evidence-driven." },
  { id: "f2", title: "Snowflake senior DE loop: what surprised me", category: "INTERVIEW_EXPERIENCE", company: "Snowflake", author: "warehouse_wizard", createdAt: "2026-08-31", replies: 8, reactions: 24, views: 463, excerpt: "Much more emphasis on data correctness and failure recovery than memorizing Snowflake syntax." },
  { id: "f3", title: "Negotiating competing offers without overplaying it", category: "COMPENSATION", company: "Meta", author: "levelheaded", createdAt: "2026-08-30", replies: 22, reactions: 61, views: 1207, excerpt: "Sharing what worked for me across two written offers, including how I framed the deadline conversation." },
];

export const getQuestion = (slug: string) => questions.find((q) => q.slug === slug);
export const getCompany = (slug: string) => companies.find((c) => c.slug === slug);
export const getForumPost = (id: string) => forumPosts.find((p) => p.id === id);
