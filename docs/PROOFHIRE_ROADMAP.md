# ProofHire delivery roadmap

The roadmap follows the project rule: evidence first, then capability, then verified shipping. REA is a discovery provider; it does not bypass authorization, clean-room, verification or release gates.

## M0 — Reconstructed product slice (this branch)

- [x] Evidence-based feature/capability dossier.
- [x] Clean-room visual/product identity (`ProofHire`).
- [x] Recruiter pipeline and candidate record demo.
- [x] Candidate challenge with accountless scoped-credential UX.
- [x] Explicit exact-commit selection.
- [x] Candidate-visible automated-check breakdown.
- [x] Immutable submission API contract and audit event.
- [x] Browser camera/screen-share controls for interview prototype.
- [x] Human-gated AI advisory UI.
- [x] Architecture/security/unknowns documented.

Exit gate: CI build + preview deployment + exact commit receipt.

## M1 — Real repository challenge

- Provision private repositories using a GitHub App / installation token.
- Generate per-candidate short-lived least-privilege grants.
- Validate candidate-selected SHA and freeze submission identity.
- Persist roles, candidates, stages, grants, submissions and audit events in Postgres.
- Add candidate magic-link resume flow without mandatory account creation.

Exit gate: end-to-end test proves a later push cannot mutate an existing dossier.

## M2 — Evidence runner

- Durable queue and isolated runner workers.
- Versioned check packs: tests, typecheck, lint, security, policy, performance.
- Artifact hashing, normalized logs, retry semantics and budget controls.
- Candidate/reviewer result parity with an explicit confidential-check policy for the few cases that require it.

Exit gate: replay produces the same normalized result from the same SHA + runner image.

## M3 — Structured review + interview

- Versioned rubrics and reviewer calibration.
- WebRTC room, screen share, chat and interview-scoped notes.
- Optional live-pair mode whose edits are session evidence, never challenge-submission replacement.
- Interview evidence timeline attached to the same candidate record.

Exit gate: role-based access tests and session recording/retention policy tests pass.

## M4 — AI, agent and workflow layer

- Provider-neutral AI advice contract with BYO-key option.
- Evidence-grounded candidate summary/code review; no decision authority.
- MCP server exposing roles, candidate evidence and reviewer-safe actions with scoped tokens.
- Webhooks / ATS integrations for Greenhouse, Lever and Ashby where commercially justified.

Exit gate: policy tests prove AI/MCP cannot reject, offer or move stages without human authorization.

## M5 — Commercial release

Suggested packaging:

- **Starter**: 3 active roles, 25 candidates/month, basic checks.
- **Team**: 15 roles, 200 candidates/month, interviews, AI advisory, integrations.
- **Scale**: higher limits, SSO/RBAC, custom retention, audit export, dedicated runner/network controls.

Monetization should be priced primarily on active roles + evaluated candidates/runner usage, not seats alone. The differentiation is evidence integrity and reduced hiring ambiguity, not generic ATS workflow.

Release gate: production observability, billing, abuse controls, security review, data retention/deletion controls, backup/restore drill, support runbook, terms/privacy artifacts and verified rollback.
