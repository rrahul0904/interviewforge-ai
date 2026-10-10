# Clean-room product dossier — Interviews.chat

Date: 2026-10-10  
Canonical target: `rrahul0904/interviewforge-ai`  
Tracker: issue #1  
Status: **BUILDING** — not shipped, not production verified

## 1. Boundary and method

This dossier follows the project sequence: source identification → evidence → workflow reconstruction → capability/failure decomposition → user feedback → competitive comparison → internal donor audit → product thesis → behavior contracts → implementation → independent verification → hosted/browser/recovery certification → evidence-only tracker update.

Interviews.chat's current public Terms state that users may not reverse engineer, copy, or attempt to extract its software or models. This work therefore uses only public product pages, public policy pages, public Chrome Web Store metadata, public launch/review material, and public community discussions. We do **not** copy proprietary source, prompts, question banks, private APIs, assets, branding, or hidden implementation details.

Evidence labels used below:

- `OBSERVED`: visible in a public first-party product surface.
- `DOCUMENTED`: stated by a first-party policy/store page.
- `CORROBORATED`: repeated across multiple independent/public sources.
- `INFERRED`: our clean-room reconstruction of a likely architecture or workflow.
- `UNKNOWN`: not established by public evidence.
- `CONFLICTED`: sources disagree.

## 2. Source manifest

### First-party

- Product homepage: https://www.interviews.chat/
- Pricing surface: https://www.interviews.chat/pricing
- Interview Copilot surface: https://www.interviews.chat/interview-copilot
- Interview Prep surface: https://www.interviews.chat/interview-prep
- Privacy policy: https://www.interviews.chat/privacy-policy
- Chrome extension privacy policy: https://www.interviews.chat/privacy-policy-chrome-extension
- Terms: https://www.interviews.chat/terms-and-conditions
- Interview Copilot Chrome extension: https://chromewebstore.google.com/detail/interview-copilot-by-inte/ckdfmjoeofkhpepifplhnnnnfdpepjmf
- OA Copilot Chrome extension: https://chromewebstore.google.com/detail/oa-copilot-by-interviews/pogkebjcnimlgnhpgjohnmcpidhoibec

### Launch / external product coverage

- Product Hunt product page: https://www.producthunt.com/products/interviews-chat
- Interviews.chat current review/pricing coverage from Interview Sidekick, LastRound AI, Final Round AI, Sokrates, Trippi Cue, and Chrome-Stats. These are competitor/third-party sources and are treated as directional evidence, not ground truth.

### Current community threads sampled

At least five current discussions were reviewed to capture category-level user needs and objections:

1. https://www.reddit.com/r/jobsearchhacks/comments/1re35y9/are_you_guys_using_any_ai_interview_assistants/
2. https://www.reddit.com/r/InterviewHackers/comments/1rwiz18/best_ai_copilot_for_interviews_not_github_copilot/
3. https://www.reddit.com/r/InterviewHacking/comments/1rwon6h/i_used_an_ai_interview_assistant_for_30/
4. https://www.reddit.com/r/InterviewHacking/comments/1sgt6c2/ai_copilot_for_interviews_is_the_2026_version_of/
5. https://www.reddit.com/r/InterviewAiPrep/comments/1wiqosa/best_ai_interview_copilot/
6. https://www.reddit.com/r/cscareerquestionsEU/comments/1rj75p5/how_are_you_supposed_to_use_ai_in_coding/
7. https://www.reddit.com/r/datastructures/comments/1urwzzq/made_a_tool_that_simulates_the_explain_your/

Community posts may contain promotion, unverifiable success claims, or coordinated marketing. They are useful for identifying repeated pain points, not for proving product efficacy.

## 3. Product hierarchy and workflows

### 3.1 Public product hierarchy

`OBSERVED / DOCUMENTED`

1. **Interview Copilot**
   - live transcription
   - answer suggestions
   - concise, bullet, comprehensive, STAR, and interviewer-question response formats
   - multi-model suggestions
   - virtual interview / phone workflow
2. **Online Assessment / Chrome companion**
   - active-tab screenshot analysis
   - behavioral and technical task assistance
3. **Interview Prep**
   - resume + job description conditioning
   - generated practice questions
   - mock interview with follow-ups
   - answer transcription
   - feedback + model answer
4. **Career utilities**
   - tailored resume
   - resume feedback
   - cover letter
   - career pivot / career copilot
   - questions to ask interviewer
   - post-interview insights
5. **Account / billing**
   - free credits
   - monthly / quarterly subscriptions
   - usage credits and unlimited tiers

### 3.2 Live copilot workflow reconstruction

`INFERRED`, based on public behavior and extension disclosures, not vendor internals:

```text
Browser / desktop audio or active-tab context
        ↓
Capture boundary
        ↓
Streaming speech recognition / screenshot extraction
        ↓
Speaker + question segmentation
        ↓
Candidate context assembler
(resume + JD + language + answer-format preference + recent transcript)
        ↓
Provider router / optional parallel LLM requests
        ↓
Response shaper
(concise | bullets | STAR | follow-up questions)
        ↓
Live transcript + suggestions UI
        ↓
Ephemeral session state / metering
```

Vendor-specific model routing, STT provider, storage implementation, queueing, and deployment topology are `UNKNOWN`.

### 3.3 Prep workflow reconstruction

`OBSERVED + INFERRED`

```text
Resume + job description
        ↓
Candidate/role context extraction
        ↓
Question planner
        ↓
Practice or mock interview loop
(question → answer → follow-up)
        ↓
Transcription
        ↓
Rubric evaluator
        ↓
Feedback + model answer + next question
        ↓
Post-session review / history
```

## 4. Pricing and limits

`OBSERVED` on the public product surface at research time:

| Plan | Price | Publicly stated allowance |
|---|---:|---|
| Starter | $19/month | 1,000 credits |
| Booster | $29/month | Unlimited credits/time/suggestions |
| Pro | $69/quarter | Unlimited credits/time/suggestions |
| Trial | free | 30 credits, no card stated |

Public text states one credit maps to one minute of Copilot or one Copilot suggestion on the Starter plan. Pricing can change; treat this as a dated observation.

## 5. Data, privacy, and security evidence

### First-party documented behavior

- Main privacy policy says audio/video are not permanently stored and are processed in real time.
- Resume and interview-prep transcripts may be stored as product data and can be deleted through the application according to the policy.
- Third-party providers can include cloud hosting, auth, payment, AI model, analytics, support, and infrastructure providers.
- Chrome-extension privacy policy says active-tab screenshots are sent to servers for analysis and discarded after analysis.
- The extension privacy page says resume and JD data can be stored locally in Chrome.
- Chrome Web Store metadata declares handling of personally identifiable information, authentication information, and website content.

### Security decision for InterviewForge

High-permission browser capture is **deferred** from this slice. Before any extension is built, we require:

- least-privilege permission design
- explicit per-site activation
- visible capture state
- origin allow/deny controls
- no blanket browsing-history collection
- threat model for injected content and prompt attacks
- screenshot/audio retention tests
- privacy UI and deletion controls
- independent extension security review

## 6. User feedback and repeated category pain

### Strong repeated signals

1. **Latency matters more than answer richness.** Users describe delayed suggestions as disruptive. We should stream early structure and progressively refine rather than wait for a polished paragraph.
2. **Short, scannable coaching beats long generated prose.** Community users explicitly ask for outlines/keywords instead of paragraphs while under pressure.
3. **Realistic follow-ups matter.** Prep value rises when the interviewer challenges a prior answer rather than simply presenting independent questions.
4. **Communication is under-trained.** Users report being able to solve problems but struggling to verbalize approach, trade-offs, and reasoning.
5. **Trust breaks when speaker/question detection is wrong.** A current third-party review reports mis-attribution of interviewer vs candidate speech; treat this as a failure mode to test even though it is not independently reproduced here.
6. **Manual resume/JD entry is friction.** Public reviews criticize copy/paste setup. File import and reusable candidate context should be first-class.
7. **Credit accounting can distract candidates.** Flat, transparent usage or clearly visible cost accounting is preferable.
8. **Integrity/ethics are contested.** Current discussions range from treating live copilots as notes to viewing them as cheating. We should not build or market detection-evasion. Product modes must make the boundary explicit.

### What users appear to love

- immediate help when they freeze
- STAR structure for behavioral answers
- role/JD-aware personalization
- ability to compare model styles
- one product spanning prep + live context + follow-up learning
- low-friction phone/second-device fallback

### What users appear to dislike

- latency
- one-block answers
- clutter / learning curve
- ambiguous or confusing usage limits
- weak prep depth compared with dedicated practice products
- uncertainty around screen sharing / capture visibility
- unreliable transcription or speaker attribution

## 7. Competitive comparison

This matrix is a product-planning snapshot from public pages and third-party comparison pages, not a certification of competitor claims.

| Capability | Interviews.chat | Market pressure / gap | InterviewForge decision |
|---|---|---|---|
| Resume + JD context | Yes | expected baseline | MATCH + ground to verified candidate evidence |
| Mock interview | Yes | realism varies | MATCH + adaptive follow-ups |
| Multi-model | Yes | can create cognitive overload | IMPROVE with provider policy + side-by-side only when useful |
| Real-time suggestions | Yes | latency critical | DEFER live mode until prep engine is certified |
| Response formats | Yes | highly useful | MATCH |
| Post-session feedback | Yes on prep | users want richer longitudinal insight | IMPROVE with score trends |
| Company intelligence | limited public evidence | strong differentiator | NEW via existing InterviewForge evidence graph |
| Provenance/confidence | not visible | category trust problem | NEW |
| Integrity mode | not visible | contested use | NEW |
| Browser screenshot assistant | Yes | powerful, high permission/security cost | DEFER |
| Desktop overlay / stealth | competitor pressure | ethics + trust risk | OMIT detection-evasion |

## 8. Internal donor / dedupe audit

A canonical repository already exists: `rrahul0904/interviewforge-ai`.

Existing capabilities include company-specific interview intelligence, a normalized question bank, coding practice workspace, provider-neutral AI and execution contracts, ingestion provenance/confidence, Postgres schema, forum, worker skeleton, and CI. The repository roadmap already names candidate intelligence, resume + JD ingestion, adaptive curriculum, voice/text mock interviews, and post-interview scorecards.

Decision: **extend the canonical repo, do not create another interview-prep clone.**

## 9. Product thesis

InterviewForge should not become a generic covert answer generator. Its differentiator is an **evidence-grounded interview operating system**:

> connect verified candidate evidence + fresh company/role interview intelligence + realistic adaptive practice + replayable scoring so the candidate improves before and after each loop.

### V1 boundary

Ship first:

- reusable candidate context (role/company/round/resume/JD)
- evidence extraction that never invents resume claims
- adaptive mock plan
- one-question-at-a-time mock workspace
- rubric score: relevance, evidence, structure, concision
- STAR / bullet / concise / questions-to-ask coaching formats
- deterministic local evaluator
- explicit integrity mode
- replay fingerprint

Do not ship in this slice:

- stealth/detection evasion
- desktop overlay
- Chrome page/screenshot capture
- real audio capture/STT
- billing
- external LLM dependency

## 10. Behavior contracts

1. Candidate evidence returned by the core must be a substring of user-provided resume text.
2. Candidate context changes must produce a different replay fingerprint.
3. Same input context must produce the same deterministic plan/fingerprint.
4. Practice mode must always display a rehearsal/integrity notice.
5. Model-answer scaffolds must tell users to use a verified personal example rather than inventing one.
6. Concise coaching returns a bounded number of items.
7. STAR coaching always returns Situation / Task / Action / Result structure.
8. Question planning can use the InterviewForge intelligence graph when a matching high-confidence question is available.
9. Graph-derived questions carry source + confidence metadata.
10. A provider failure in future external adapters must fail closed to deterministic local coaching rather than dropping session state.

## 11. Clean-room architecture for InterviewForge

```text
Candidate Context
(role / company / round / resume / JD / integrity mode)
        ↓
Candidate Evidence Extractor
        ↓
Context Fingerprint + Session Receipt
        ↓
Interview Intelligence Query
(company / role / track / freshness / confidence)
        ↓
Adaptive Question Planner
        ↓
Mock Interview State Machine
(question → answer → score → follow-up → next)
        ↓
Deterministic Evaluator
(relevance / evidence / structure / concision)
        ↓
Coaching Formatter
(concise / bullets / STAR / questions-to-ask)
        ↓
Session History / Skill Trend
```

Future provider adapters can add STT/LLMs, but product code must depend on provider-neutral contracts and deterministic local fixtures.

## 12. Failure model

| Failure | Expected behavior |
|---|---|
| Empty resume | plan still works, but no personal evidence refs are invented |
| Empty JD | planner falls back to role-level questions |
| No matching graph question | deterministic role-depth question |
| Extremely long answer | concision score drops; evaluator remains bounded |
| Weak answer | concrete improvement guidance, no fabricated experience |
| Provider unavailable (future) | deterministic fallback + preserved session |
| Candidate switches role/JD | new fingerprint + reset plan |
| Browser capture unavailable | not applicable in V1; feature is deferred |

## 13. Implementation slice started

Branch: `feat/interviews-chat-candidate-intelligence`

Added:

- `packages/core/src/candidate-intelligence.ts`
  - candidate context and integrity-mode contracts
  - grounded evidence extraction
  - stable context fingerprint
  - adaptive mock plan
  - deterministic answer score
  - coaching formatter
- `packages/core/tests/candidate-intelligence.test.mjs`
  - evidence-grounding contract
  - deterministic plan/fingerprint
  - context invalidation
  - scoring/format bounds
- `apps/web/app/mock-interview/page.tsx`
- `apps/web/components/mock-interview-studio.tsx`
- `apps/web/app/mock-interview/mock.css`
- navigation entry for mock interview

## 14. Certification gate

This slice is not `SHIPPED` until all of the following exist on the exact PR head:

- typecheck PASS
- deterministic tests PASS
- production build PASS
- independent diff review
- hosted Preview created from the same SHA
- browser UAT on desktop + responsive layout
- refresh/reload smoke test
- provider/recovery checks as applicable
- evidence receipt attached to issue/PR
- production deployment + browser verification before `PRODUCTION VERIFIED`

Until then, tracker status remains **BUILDING**.
