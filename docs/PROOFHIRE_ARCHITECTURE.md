# ProofHire architecture

## Product boundary

ProofHire is the employer-side evidence and technical-hiring module for InterviewForge. InterviewForge's existing candidate-intelligence/practice product remains separate. Shared identity, billing and intelligence can converge later, but submission evidence is its own bounded context.

## Logical flow

```text
Candidate Browser
   |  public application / signed challenge grant
   v
Hiring Web App ---------------------------> Audit Ledger (append-only)
   |                                             ^
   | issue least-privilege grant                 |
   v                                             |
Repository Broker ---> Git Provider ---> Webhooks / Commit Resolver
                              |                  |
                              v                  |
                       Candidate pushes          |
                              |                  |
                              v                  |
                    Selected immutable SHA ------+
                              |
                              v
                       Isolated Runner
                 tests / lint / policy / perf
                              |
                              v
                        Evidence Store
                              |
             +----------------+----------------+
             |                                 |
             v                                 v
       Reviewer Rubric                   AI Advisory Sidecar
             |                                 |
             +----------------+----------------+
                              v
                       Human Decision Gate
                              |
                              v
                   Interview / Team Review
```

## Core entities

- `Role`: public description, process disclosure, assessment policy, effort estimate.
- `Candidate`: applicant identity and consent state; candidate account is optional.
- `StageInstance`: one candidate's execution of a versioned stage.
- `ChallengeGrant`: repository, scoped credential reference, expiry and revocation state.
- `Submission`: immutable tuple of candidate, repository identity and commit SHA.
- `CheckRun`: runner identity, code SHA, normalized result, logs/artifact hashes.
- `RubricReview`: human reviewer, rubric version, per-dimension scores and notes.
- `InterviewSession`: participants, permissions, evidence references, screen-share/pairing mode.
- `AIAdvice`: model/provider/prompt-policy version, evidence inputs, output, confidence; never state authority.
- `Decision`: authorized human actor, outcome, rationale, evidence set.
- `AuditEvent`: append-only event envelope for replay and provenance.

## Submission invariant

A `Submission` can be created once and superseded only by another explicitly candidate-selected submission. Existing reviews never retarget. Every check/run/review carries the submission ID and full SHA.

## Security model

- Never expose Git-provider service credentials to a candidate.
- Mint short-lived credentials scoped to one repository and minimum operations.
- Store only encrypted/revocable credential references server-side.
- Verify webhook signatures and resolve submitted SHA through the provider API.
- Run candidate code in disposable sandboxes with strict CPU, memory, time and network limits.
- Treat challenge repositories and artifacts as untrusted input.
- Content-address runner artifacts and preserve exact toolchain version.
- Require explicit reviewer authority for stage changes and decisions.
- Separate AI credentials/provider access from authorization logic.
- Log every privileged operation with an actor and policy decision.

## Deployment path

The web layer is already Vercel-compatible. Production persistence can use Postgres/Supabase/Neon; a durable worker/queue handles Git events and runner work. Code execution should run outside the web request path on an isolated compute provider. WebRTC can use an SFU provider or a separately deployed media service. Object storage holds logs and signed evidence artifacts.
