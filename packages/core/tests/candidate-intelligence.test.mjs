import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMockInterviewPlan,
  candidateContextFingerprint,
  extractCandidateEvidence,
  formatCoaching,
  scoreInterviewAnswer,
} from "../src/candidate-intelligence.ts";

const context = {
  role: "Senior Data Engineer",
  company: "Acme",
  targetRound: "Behavioral",
  integrityMode: "PRACTICE",
  resumeText: "- Built a streaming pipeline that reduced batch latency by 42%.\n- Led a migration of 18 workloads with zero Sev-1 incidents.",
  jobDescription: "Own data platform reliability, streaming systems, stakeholder communication, and architecture decisions.",
};

test("candidate evidence is extracted only from resume text", () => {
  const evidence = extractCandidateEvidence(context.resumeText);
  assert.equal(evidence.length, 2);
  assert.match(evidence[0].text, /42%/);
  assert.match(evidence[1].text, /18 workloads/);
  assert.ok(evidence.every((item) => context.resumeText.includes(item.text)));
});

test("mock plan is deterministic and carries an explicit integrity notice", () => {
  const first = buildMockInterviewPlan(context, []);
  const second = buildMockInterviewPlan(context, []);
  assert.equal(first.contextFingerprint, second.contextFingerprint);
  assert.equal(first.id, second.id);
  assert.equal(first.integrityMode, "PRACTICE");
  assert.match(first.policyNotice, /rehearsal/i);
  assert.ok(first.questions.length >= 4);
  assert.ok(first.questions[0].evidenceRefs.length > 0);
});

test("fingerprint changes when candidate context changes", () => {
  const first = candidateContextFingerprint(context);
  const second = candidateContextFingerprint({ ...context, role: "Staff Data Engineer" });
  assert.notEqual(first, second);
});

test("answer score rewards evidence and supports concise coaching", () => {
  const plan = buildMockInterviewPlan(context, []);
  const score = scoreInterviewAnswer(
    "First I clarified the reliability target. Then I led the migration of 18 workloads, because the rollback risk was high. The result was zero Sev-1 incidents and a 42% latency reduction.",
    plan.questions[0],
  );
  assert.ok(score.total >= 60);
  assert.ok(score.evidence >= 70);
  assert.equal(formatCoaching("CONCISE", score).length, 2);
  assert.equal(formatCoaching("STAR", score).length, 4);
});
