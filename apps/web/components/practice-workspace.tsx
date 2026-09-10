"use client";
import { useState } from "react";
import type { InterviewQuestion } from "@interviewforge/core";

const starter = `def solve(events, k):\n    # Explain the invariant before optimizing.\n    counts = {}\n    for event in events:\n        counts[event] = counts.get(event, 0) + 1\n    return sorted(counts, key=counts.get, reverse=True)[:k]\n`;

export function PracticeWorkspace({ question }: { question: InterviewQuestion }) {
  const [hintIndex, setHintIndex] = useState(0);
  const [status, setStatus] = useState("Ready — local demo does not execute untrusted code.");
  return <div className="practice-shell">
    <section className="practice-pane"><div className="practice-tabs"><span className="practice-tab active">Description</span><span className="practice-tab">Solution</span><span className="practice-tab">Discussion</span><span className="practice-tab">Submissions</span><span className="practice-tab">Ask AI</span></div><div className="practice-content"><span className="badge blue">{question.track.replaceAll("_", " ")} · {question.difficulty}</span><h2 style={{marginTop:16}}>{question.title}</h2><p>{question.summary}</p><h3>Constraints</h3><ul>{question.constraints.map(c => <li key={c}>{c}</li>)}</ul><div className="callout"><strong>Progressive hint {hintIndex+1}/{question.hints.length}</strong><p>{question.hints[hintIndex]}</p><button className="button ghost small" onClick={() => setHintIndex(v => Math.min(v+1, question.hints.length-1))}>Reveal next hint</button></div><h3>AI context</h3><p>The AI adapter receives the canonical question, constraints, current code/test evidence and hint stage. It does not need raw source documents.</p></div></section>
    <section className="practice-pane"><div className="editor-toolbar"><span>Python 3.13</span><div className="editor-actions"><button className="button ghost small" onClick={() => setStatus("Mock run complete — connect a hardened sandbox provider for real execution.")}>Run</button><button className="button small" onClick={() => setStatus("Mock submission recorded locally in UI state.")}>Submit</button></div></div><pre className="editor"><code>{starter}</code></pre><div className="tests"><strong>Test cases</strong><div className="testcase"><code>events=["a","b","a","c","a","b"], k=2</code><p>Expected: ["a", "b"]</p></div><div className="testcase"><strong>Execution status</strong><p>{status}</p></div></div></section>
  </div>;
}
