# Architecture

## Goals

InterviewForge must support three distinct workloads without coupling them together:

1. SEO-heavy read traffic for companies/questions/forum content.
2. Stateful candidate workflows: progress, submissions, AI coaching and billing.
3. Asynchronous intelligence ingestion: source processing, normalization, deduplication and review.

## Logical architecture

```text
Browser
  │
  ▼
Next.js Web / BFF
  ├── Auth & entitlements
  ├── Question/company APIs
  ├── Forum APIs
  ├── Practice APIs
  └── Stripe webhooks
          │
          ├──────────────► AI Gateway ──► model providers
          ├──────────────► Execution Gateway ──► isolated sandbox provider
          │
          ▼
      PostgreSQL
          ▲
          │
Redis / Queue ◄── Ingestion Worker ◄── approved public/community sources
          │
          └── provenance + moderation + canonicalization
```

## Deployment

- **Web:** Vercel or any Node 22 container platform.
- **Worker:** long-running container on Render/Fly/Kubernetes/ECS/etc.
- **Postgres:** Neon, Supabase, RDS, Cloud SQL, AlloyDB or self-hosted PostgreSQL.
- **Redis:** Upstash/Redis Cloud/ElastiCache or self-hosted Redis.
- **Code execution:** remote hardened sandbox. Never execute candidate code inside the web process.

The app is intentionally vendor-neutral. Provider integrations sit behind interfaces in `packages/ai` and `packages/execution`.

## Data architecture

Canonical questions are separate from evidence reports. Multiple reports can map to one canonical question and update its frequency/recency without duplicating content.

High-value relationship graph:

```text
SourceDocument → InterviewReport → QuestionReport → Question
                                            ├── Company
                                            ├── Role
                                            ├── Round
                                            ├── Skill
                                            └── Pattern
```

## Scaling

- Use cursor pagination for question/forum feeds.
- Put search into PostgreSQL FTS initially; graduate to OpenSearch/Typesense only when justified.
- Cache read-heavy company pages at the CDN.
- Queue all ingestion and long AI work.
- Store raw external documents separately with strict retention and provenance policy.
- Partition high-volume telemetry (`attempts`, `ai_usage`, `code_runs`) by time when needed.
- Keep code execution in a separate trust boundary.
