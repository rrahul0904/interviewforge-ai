# InterviewForge AI

InterviewForge AI is a clean-room interview-intelligence and practice platform inspired by the product mechanics of modern company-specific interview-prep tools. It does **not** copy proprietary question banks or tutorials.

## What is implemented in this baseline

- Company-centric interview intelligence landing experience
- Searchable question bank with track, company, difficulty, recency and confidence metadata
- Company collection pages
- Practice workspace with prompt, constraints, hints, editor shell, tests, AI coach and submission states
- Forum feed and interview-experience threads
- AI provider contract with deterministic local mock
- Code-execution provider contract with safe local mock (no untrusted code is executed)
- Ingestion normalization + provenance/confidence model
- PostgreSQL/Drizzle schema covering users, questions, reports, companies, forum, attempts, AI usage, subscriptions and referrals
- Worker skeleton for source ingestion
- Health and JSON API routes
- Docker Compose for Postgres + Redis
- CI workflow for lint/typecheck/test/build
- Architecture, product, security, provenance and roadmap docs

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

The initial UI uses seeded demo data so the app can be evaluated without PostgreSQL, Stripe, an LLM key or a code-execution vendor.

For persistence work:

```bash
docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Repository layout

```text
apps/web                 Next.js 16 web application and route handlers
apps/worker              durable ingestion-worker entry point
packages/core            domain models, ranking and confidence logic
packages/db              Drizzle schema and database client
packages/ai              provider-neutral AI coaching contract
packages/execution       isolated code-execution provider contract
packages/ingestion       normalization / canonicalization pipeline
docs                     product, architecture, security and delivery docs
```

## Product principle

The moat is not a code editor. It is a trustworthy, fresh, normalized intelligence graph connecting candidate reports → canonical questions → companies → roles → interview rounds → skills → practice outcomes.

See `docs/ARCHITECTURE.md` and `docs/ROADMAP.md` for the production path.
