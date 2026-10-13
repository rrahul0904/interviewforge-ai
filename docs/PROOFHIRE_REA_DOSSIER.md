# ProofHire — REA reverse-engineering dossier

Status: clean-room reconstruction in progress  
Target class: public web product / technical hiring workflow  
Source target: Hiretea (`hiretea.dev`) and the public Reddit launch discussion supplied by the user.

## 1. Source / target identity

The observed product is a technical-hiring system whose strongest primitive is an immutable candidate submission: the candidate works in Git and explicitly submits an exact commit. Assessment results, automated checks, human review, interview evidence and the eventual decision remain attached to one candidate record.

REA is used here as an evidence/capability discovery discipline, not as roadmap authority. InterviewForge/Agent Work OS remains the authority for authorization, clean-room boundaries, evidence provenance, verification, release and monetization gates.

## 2. Publicly observed capabilities

High-confidence observations:

- Public job / application workflow with no candidate account required.
- Structured assessments with scoring rules and stage progression.
- Candidate receives a private challenge repository and uses normal Git.
- Candidate selects an exact Git commit for review; subsequent pushes must not silently alter the review target.
- Automated checks and a reviewer rubric attach to the submission record.
- Browser interview room supports video and screen sharing.
- AI produces advisory analysis while hiring decisions remain human-controlled.
- Append-only events / auditability are a first-class product claim.
- MCP / agent access is part of the product surface.

Reddit-feedback observations:

- A short-lived repository-scoped credential avoids forcing the candidate to create a Git-host account.
- The launch implementation showed candidate pass/fail and score while the detailed automated-check breakdown was reviewer-side; feedback asked for the full breakdown to be candidate-visible.
- The creator described video rooms as interview-scoped and had not yet implemented a dedicated live-pairing workflow.

## 3. Reconstruction thesis

We should not build a visual clone. The durable product mechanism is the evidence graph:

`role -> candidate -> stage -> challenge grant -> exact submission SHA -> check runs -> rubric -> interview -> AI advice -> human decision -> audit events`

The critical invariant is that every downstream evaluation references the selected submission identity, not whatever happens to be at branch HEAD later.

## 4. Clean-room improvements in ProofHire

1. **Candidate-visible checks by default.** Before pinning the SHA, the candidate sees the exact checks, durations and results the reviewer will receive.
2. **Submission preview + explicit pin action.** A push is not a submission. The candidate must select the review target.
3. **Interview vs pairing separation.** Pairing-session work is tagged as interview evidence and cannot replace the immutable challenge submission.
4. **Human-authority policy in the domain model.** AI advice is a separate artifact; only an authorized human action can change hiring state.
5. **Replay contract.** Every state transition emits an append-only event with actor, subject, timestamp, policy context and source evidence IDs.

## 5. Unknowns we do not invent

Public observation does not establish the target's private data model, token implementation, CI runner vendor, WebRTC provider, anti-cheat logic, production infrastructure, internal prompts, scoring weights or enterprise controls. Those remain unknown. ProofHire chooses its own implementations.

## 6. Current proof

This branch implements a working `/hiring` product slice and `/api/hiring/submission` contract. The API validates SHA-shaped identities and returns an immutable submission object, candidate-visible check evidence and an audit event. It is intentionally demo-backed until persistence and real Git-provider provisioning are connected.

## 7. Acceptance criteria for the next gate

- Real private repository created per challenge or per candidate.
- Repository credential has least privilege, automatic expiry and revocation.
- Selected SHA is verified to exist in the candidate repository before persistence.
- Runner executes only in an isolated sandbox with CPU/time/network policies.
- Check output is normalized and content-addressed.
- Human stage transition requires authenticated reviewer authority.
- Audit trail is append-only and replay tests reproduce the dossier.
- Video/pairing code cannot mutate the pinned submission.
