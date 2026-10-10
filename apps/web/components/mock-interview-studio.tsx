"use client";

import { useMemo, useState } from "react";
import {
  buildMockInterviewPlan,
  formatCoaching,
  scoreInterviewAnswer,
  type AnswerScore,
  type CandidateContext,
  type IntegrityMode,
  type InterviewQuestion,
  type ResponseFormat,
} from "@interviewforge/core";

const demoResume = `Built a streaming data platform serving 40+ downstream datasets and reduced batch latency by 42%.
Led the migration of 18 production workloads with zero Sev-1 incidents.
Partnered with analytics, platform, and product teams to define reliability SLOs and ownership boundaries.`;

const demoJobDescription = `We are hiring a Senior Data Engineer to own reliable batch and streaming pipelines, shape platform architecture, partner with stakeholders, and improve data quality and observability.`;

const emptyScore: AnswerScore = {
  relevance: 0,
  evidence: 0,
  structure: 0,
  concision: 0,
  total: 0,
  strengths: [],
  improvements: [],
  modelOutline: [],
};

export function MockInterviewStudio({ inventory }: { inventory: InterviewQuestion[] }) {
  const [context, setContext] = useState<CandidateContext>({
    role: "Senior Data Engineer",
    company: "",
    targetRound: "Behavioral + system design",
    resumeText: demoResume,
    jobDescription: demoJobDescription,
    integrityMode: "PRACTICE",
  });
  const [started, setStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState<AnswerScore>(emptyScore);
  const [format, setFormat] = useState<ResponseFormat>("BULLETS");
  const [history, setHistory] = useState<number[]>([]);

  const plan = useMemo(() => buildMockInterviewPlan(context, inventory), [context, inventory]);
  const active = plan.questions[Math.min(activeIndex, plan.questions.length - 1)];
  const coaching = score.total ? formatCoaching(format, score) : [];

  function patch<K extends keyof CandidateContext>(key: K, value: CandidateContext[K]) {
    setContext((current) => ({ ...current, [key]: value }));
    setStarted(false);
    setActiveIndex(0);
    setAnswer("");
    setScore(emptyScore);
    setHistory([]);
  }

  function start() {
    setStarted(true);
    setActiveIndex(0);
    setAnswer("");
    setScore(emptyScore);
    setHistory([]);
  }

  function evaluate() {
    const next = scoreInterviewAnswer(answer, active);
    setScore(next);
    setHistory((current) => [...current.slice(0, activeIndex), next.total]);
  }

  function nextQuestion() {
    setActiveIndex((current) => Math.min(current + 1, plan.questions.length - 1));
    setAnswer("");
    setScore(emptyScore);
  }

  if (!started) {
    return (
      <section className="mock-setup container">
        <div className="panel mock-setup-panel">
          <div>
            <span className="eyebrow">Candidate intelligence</span>
            <h1>Build the interview around your real evidence.</h1>
            <p className="mock-lede">InterviewForge turns your role, job description, resume evidence, and our interview-intelligence graph into a deterministic mock plan. The local demo never invents candidate experience.</p>
          </div>
          <div className="mock-context-grid">
            <label><span>Target role</span><input value={context.role} onChange={(event) => patch("role", event.target.value)} /></label>
            <label><span>Company (optional)</span><input value={context.company ?? ""} onChange={(event) => patch("company", event.target.value)} placeholder="e.g. OpenAI" /></label>
            <label><span>Interview round</span><input value={context.targetRound ?? ""} onChange={(event) => patch("targetRound", event.target.value)} /></label>
            <label><span>Integrity mode</span><select value={context.integrityMode} onChange={(event) => patch("integrityMode", event.target.value as IntegrityMode)}><option value="PRACTICE">Practice</option><option value="AI_ALLOWED">AI allowed by interviewer</option><option value="LIVE_NOTES">Live notes only</option></select></label>
          </div>
          <div className="mock-context-grid mock-context-wide">
            <label><span>Resume evidence</span><textarea rows={8} value={context.resumeText} onChange={(event) => patch("resumeText", event.target.value)} /></label>
            <label><span>Job description</span><textarea rows={8} value={context.jobDescription} onChange={(event) => patch("jobDescription", event.target.value)} /></label>
          </div>
          <div className="mock-plan-preview">
            <div><strong>{plan.questions.length}</strong><span>adaptive questions</span></div>
            <div><strong>{plan.candidateEvidence.length}</strong><span>grounded resume signals</span></div>
            <div><strong>{plan.contextFingerprint}</strong><span>replay fingerprint</span></div>
          </div>
          <div className="callout"><strong>Integrity boundary</strong><p>{plan.policyNotice}</p></div>
          <div className="hero-actions"><button className="button" onClick={start}>Start mock interview</button><span className="mock-smallprint">Deterministic local evaluator · no external AI key required</span></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mock-shell">
      <aside className="mock-rail panel">
        <div className="mock-rail-head"><span className="badge blue">{context.targetRound || "Mock interview"}</span><h3>{context.role}</h3><p>{context.company || "Company-neutral"}</p></div>
        <div className="mock-progress">{plan.questions.map((question, index) => <button key={question.id} className={`mock-step ${index === activeIndex ? "active" : ""} ${history[index] ? "done" : ""}`} onClick={() => { setActiveIndex(index); setAnswer(""); setScore(emptyScore); }}><span>{index + 1}</span><div><strong>{question.competency}</strong><small>{question.source === "INTELLIGENCE_GRAPH" ? `${Math.round(question.confidence * 100)}% graph confidence` : "candidate context"}</small></div>{history[index] ? <b>{history[index]}</b> : null}</button>)}</div>
        <div className="callout mock-integrity"><strong>{context.integrityMode.replaceAll("_", " ")}</strong><p>{plan.policyNotice}</p></div>
        <button className="button ghost small" onClick={() => setStarted(false)}>Edit candidate context</button>
      </aside>

      <main className="mock-main panel">
        <div className="mock-question-head"><div><span className="eyebrow">Question {activeIndex + 1} of {plan.questions.length}</span><h2>{active.prompt}</h2></div><span className="badge">{active.track.replaceAll("_", " ")}</span></div>
        <div className="mock-signals"><strong>Listen for:</strong>{active.expectedSignals.map((signal) => <span key={signal}>{signal}</span>)}</div>
        {active.evidenceRefs.length ? <div className="mock-evidence"><strong>Grounded candidate evidence</strong>{plan.candidateEvidence.filter((item) => active.evidenceRefs.includes(item.id)).map((item) => <p key={item.id}>“{item.text}”</p>)}</div> : null}
        <label className="mock-answer"><span>Your answer</span><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Answer as you would in the interview. Use your own experience rather than a generated script." /></label>
        <div className="mock-answer-actions"><span>{answer.trim() ? answer.trim().split(/\s+/).length : 0} words</span><div><button className="button ghost small" onClick={() => setAnswer("")}>Clear</button><button className="button small" disabled={!answer.trim()} onClick={evaluate}>Evaluate answer</button></div></div>
      </main>

      <aside className="mock-coach panel">
        <div className="mock-coach-head"><div><span className="eyebrow">Coach</span><h3>{score.total ? `${score.total}/100` : "Ready when you are"}</h3></div><select value={format} onChange={(event) => setFormat(event.target.value as ResponseFormat)}><option value="BULLETS">Bullets</option><option value="CONCISE">Concise</option><option value="STAR">STAR</option><option value="FOLLOW_UP">Questions to ask</option></select></div>
        {score.total ? <>
          <div className="score-grid"><div><strong>{score.relevance}</strong><span>relevance</span></div><div><strong>{score.evidence}</strong><span>evidence</span></div><div><strong>{score.structure}</strong><span>structure</span></div><div><strong>{score.concision}</strong><span>concision</span></div></div>
          <div className="mock-feedback"><h3>What worked</h3>{score.strengths.map((item) => <p key={item}>✓ {item}</p>)}<h3>Improve next</h3>{score.improvements.map((item) => <p key={item}>→ {item}</p>)}</div>
          <div className="mock-outline"><h3>{format === "STAR" ? "STAR scaffold" : format === "FOLLOW_UP" ? "Questions to ask" : "Answer scaffold"}</h3>{coaching.map((item, index) => <div key={item}><span>{index + 1}</span><p>{item}</p></div>)}</div>
          <button className="button" disabled={activeIndex >= plan.questions.length - 1} onClick={nextQuestion}>{activeIndex >= plan.questions.length - 1 ? "Mock complete" : "Next question"}</button>
        </> : <div className="mock-empty"><span>IF</span><h3>Answer first, then coach.</h3><p>The evaluator scores relevance, evidence, structure, and concision. It will not fabricate a personal story for you.</p></div>}
      </aside>
    </section>
  );
}
