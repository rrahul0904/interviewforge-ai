# InterviewForge AI — Implementation Plan

## Monorepo boundaries
- `apps/web`: Next.js App Router UI/BFF. Server Components for read-heavy pages; Route Handlers for external/API interactions.
- `apps/worker`: long-running ingestion and asynchronous-job consumer.
- `packages/core`: pure domain types, scoring, ranking, filtering and policy-independent logic.
- `packages/db`: Drizzle schema, migrations, repositories and seed/import tooling.
- `packages/ai`: model-provider adapters and structured coaching/extraction contracts.
- `packages/execution`: remote sandbox contract; never local `eval`/shell execution.
- `packages/ingestion`: source normalization, fingerprinting, dedupe candidates and publication gates.

## Immediate implementation sequence
### 1. Discovery/query layer
- one pure query contract shared by API/UI
- search across title/summary/company/skills
- company/track/difficulty/confidence/recency filters
- deterministic sorting
- bounded pagination
- later replace in-memory evaluation with equivalent SQL repository predicates

### 2. Repository layer
Introduce `QuestionRepository`, `CompanyRepository`, `ForumRepository`, `ProgressRepository`. Provide `Demo*Repository` for zero-config development and `Postgres*Repository` for durable environments. Product code should depend on repository interfaces, not Drizzle directly.

### 3. Authentication/authorization
Use a server-side session adapter. Roles: `candidate`, `moderator`, `admin`. Persist provider accounts separately from user profile. Enforce ownership at mutation boundaries.

### 4. Practice persistence
Create attempt → run(s) → submission → evaluation → progress snapshot. Store only safe execution metadata/stdout limits. Meter every external sandbox request.

### 5. AI gateway
Structured request includes canonical question ID/version, hint stage, sanitized code/test evidence and user message. Provider response must return typed action (`hint`, `explanation`, `follow_up`) plus usage metadata. Raw source documents are excluded from coaching prompts by default.

### 6. Intelligence pipeline
`RECEIVED → EXTRACTED → DEDUPED → REVIEW_REQUIRED → APPROVED → PUBLISHED` with idempotent job keys. Canonicalization produces candidates; humans approve ambiguous/high-risk mappings. Recompute confidence/freshness only from approved evidence.

### 7. Billing
Stripe checkout/customer portal + signature-verified webhooks + idempotency table. Entitlement checks are server-side. Referral rewards use a ledger, not mutable balance fields.

## Testing strategy
- pure domain unit tests for scoring/ranking/query/policy
- repository integration tests against ephemeral PostgreSQL
- route tests for auth/validation/error contracts
- browser tests for discovery → practice → progress and forum journeys
- contract tests for AI/execution adapters using mocks
- security tests for authorization, prompt injection boundaries and sandbox isolation

## Definition of done per feature
A feature is not complete until code, tests, error states, authorization, observability hooks, docs and a working user path are present. Mock adapters are acceptable only when the UI explicitly labels them and production paths fail closed rather than silently simulating success.

## Known external configuration blockers
None for the demo baseline. Real production capabilities will require explicit credentials/providers for authentication, PostgreSQL, Redis/queue, LLM inference, isolated code execution and Stripe. Each integration remains optional until its phase and must have a deterministic local/mock contract for development.
