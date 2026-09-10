# InterviewForge AI — Project Plan

## Objective
Build a clean-room interview-intelligence and preparation platform that turns permitted candidate reports and original content into trustworthy company-specific preparation, then differentiates with candidate-specific planning and adaptive mock interviews.

## Delivery principles
1. Evidence before generation: provenance and confidence must be available for every externally-derived signal.
2. Provider neutrality: AI, code execution, storage, auth and hosting remain replaceable.
3. Secure defaults: no untrusted code in the web/worker process; no raw external text promoted directly to published content.
4. Demonstrable increments: each phase ends in a locally/CI-verifiable product surface, not only architecture.
5. Clean-room only: product mechanics may be recreated; competitor-owned question banks, solutions and private content are not copied.

## Workstreams and status
| Workstream | Baseline | Exit criteria |
|---|---|---|
| Product/UI | In progress | Responsive discovery, company, question, practice, forum, account/admin surfaces |
| Domain/data | In progress | Migrations, repositories, seed/import, indexes, provenance graph |
| Discovery/search | In progress | Functional filters, FTS, cursor pagination, SEO metadata |
| Practice | Scaffolded | Isolated multi-language execution, SQL sandbox, attempts/submissions |
| AI coaching | Scaffolded | Structured hints/debugging/follow-ups, metering, safety/evidence context |
| Community | Scaffolded | Authenticated create/reply/react/report + moderation |
| Ingestion | Scaffolded | Durable jobs, extraction, dedupe, review, publication controls |
| Billing/referrals | Schema only | Stripe checkout/portal/webhooks/entitlements/credit ledger |
| Personalization | Planned | Resume + JD graph, gap analysis, adaptive curriculum, mock interview |
| Operations | Planned | Admin console, audit trail, cost/SLO dashboards, backup/restore |

## Milestones
### M0 — Repository and executable baseline
Monorepo, docs, CI, local Postgres/Redis, navigable demo UI, contracts and schema.

### M1 — Durable product core
Authentication, PostgreSQL repositories, real search/filter/pagination, progress and forum mutations.

### M2 — Practice engine
Sandboxed code/SQL execution, submissions, evaluation, structured AI coaching and usage accounting.

### M3 — Intelligence pipeline
Approved connectors, raw-source registry, extraction, semantic matching, analyst review and confidence/freshness recomputation.

### M4 — Commercial product
Subscriptions, entitlements, referrals, operator economics and abuse controls.

### M5 — Candidate intelligence
Resume/JD ingestion, personalized risk map, preparation plan, mock interview room and outcome loop.

### M6 — Production certification
Load/security/accessibility tests, observability, disaster recovery, production deployment and smoke certification.

## Current priority order
1. Make question discovery/search behavior real and deterministic.
2. Replace demo reads with repository interfaces and PostgreSQL implementations.
3. Add authentication and authorization boundaries.
4. Add durable progress/attempt persistence.
5. Implement a hardened execution provider integration.
6. Implement the ingestion/review pipeline before scaling content volume.
