"use client";

import { useRef, useState } from "react";
import styles from "@/app/hiring/proofhire.module.css";

type View = "recruiter" | "candidate" | "interview";
type Submission = { id: string; sha: string; selectedAt: string; immutable: boolean; score: number; checks: Array<{ name: string; detail: string; duration: string; status: string }> };

const candidates = [
  ["Alex Morgan", "Interview", "91", "8f31c2a", "Low"],
  ["Priya Shah", "Challenge", "86", "4bc217e", "Low"],
  ["Diego Torres", "Screen", "78", "—", "Medium"],
  ["Jamie Chen", "Review", "88", "ca91d0f", "Low"],
];

const initialChecks = [
  ["unit tests", "132/132 passing", "18s"], ["integration tests", "24/24 passing", "31s"],
  ["typecheck", "0 errors", "7s"], ["lint", "0 warnings", "5s"],
  ["retry backoff behavior", "jitter + capped exponential", "3s"], ["idempotency regression", "duplicate charge prevented", "4s"],
  ["load budget", "p95 184ms under 250ms target", "42s"], ["secret scan", "no credentials detected", "2s"],
];

export function HiringDemo() {
  const [view, setView] = useState<View>("recruiter");
  const [tokenVisible, setTokenVisible] = useState(false);
  const [sha, setSha] = useState("8f31c2a");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [busy, setBusy] = useState(false);
  const [decision, setDecision] = useState("pending");
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<MediaStream | null>(null);

  async function pinSubmission() {
    setBusy(true);
    try {
      const response = await fetch("/api/hiring/submission", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ candidateId: "cand_alex_morgan", sha }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "submission_failed");
      setSubmission(data.submission);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to pin submission");
    } finally { setBusy(false); }
  }

  async function startCamera() {
    try {
      mediaRef.current?.getTracks().forEach(track => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { alert("Camera access is unavailable in this browser session."); }
  }

  async function shareScreen() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { /* user cancelled */ }
  }

  return <div className={styles.productShell}>
    <div className={styles.productNav}>
      <div><strong>ProofHire</strong><span>Backend Platform Engineer</span></div>
      <nav>{(["recruiter","candidate","interview"] as View[]).map(item => <button key={item} onClick={() => setView(item)} className={view === item ? styles.activeTab : ""}>{item}</button>)}</nav>
      <span className={styles.liveBadge}>DEMO RECORD</span>
    </div>

    {view === "recruiter" && <div className={styles.workspace}>
      <aside className={styles.sidebar}><small>PIPELINE</small>{["All candidates","Screen","Challenge","Interview","Review"].map((item, index) => <div key={item} className={index === 0 ? styles.sideActive : ""}><span>{item}</span><b>{[12,2,3,4,3][index]}</b></div>)}<hr/><small>ROLE CONTROLS</small><p><b>Repository</b><br/>payments-reliability</p><p><b>Runner budget</b><br/>1,420 / 2,500 min</p><p><b>AI mode</b><br/>Advisory only</p></aside>
      <section className={styles.workspaceMain}>
        <div className={styles.metrics}><div><small>ACTIVE PIPELINE</small><b>12</b><span>4 awaiting review</span></div><div><small>MEDIAN TIME</small><b>4.2d</b><span>application → decision</span></div><div><small>CHALLENGE PASS</small><b>68%</b><span>this role</span></div><div><small>HUMAN OVERRIDES</small><b>3</b><span>AI advice changed</span></div></div>
        <div className={styles.table}><header><b>Candidate records</b><span>One evidence trail per person</span></header><div className={styles.tableRow + " " + styles.tableHead}><span>Candidate</span><span>Stage</span><span>Score</span><span>Commit</span><span>Risk</span></div>{candidates.map(row => <div className={styles.tableRow} key={row[0]}>{row.map((cell, i) => i === 3 ? <code key={i}>{cell}</code> : <span key={i}>{cell}</span>)}</div>)}</div>
        <div className={styles.audit}><small>LAST EVENT</small><code>submission.selected</code><b>Alex Morgan pinned 8f31c2a</b><span>Reviewer evidence cannot silently drift to a later push.</span></div>
      </section>
    </div>}

    {view === "candidate" && <div className={styles.candidateFlow}>
      <section className={styles.challengeCard}>
        <div className={styles.stageLine}><small>BACKEND PLATFORM ENGINEER · STAGE 03</small><span>in progress</span></div><h3>Repository challenge</h3><p>Private repository · no Git-host account required · grant expires automatically.</p>
        <div className={styles.step}><b>1</b><div><h4>Clone your private copy</h4><p>Reveal a short-lived credential scoped only to this challenge repository.</p><div className={styles.credential}><code>https://git.proofhire.dev/acme/ch-0248.git</code><button onClick={() => setTokenVisible(v => !v)}>{tokenVisible ? "hide token" : "reveal token"}</button></div>{tokenVisible && <div className={styles.token}><small>PASSWORD / TOKEN</small><code>phc_demo_9mE4xk27_only_this_repo</code><span>read/write · repository-scoped · 6h expiry</span></div>}</div></div>
        <div className={styles.step}><b>2</b><div><h4>Work in normal Git</h4><pre>{`$ git status\nOn branch solution\nworking tree clean\n$ git log --oneline -3\n8f31c2a add capped jitter and retry telemetry\n66a9e7d add retry tests`}</pre></div></div>
        <div className={styles.step}><b>3</b><div className={styles.pinArea}><h4>Pin the exact commit to review</h4><p>Nothing is graded until you explicitly select a commit. A later push cannot change this record.</p><input aria-label="Commit SHA" value={sha} onChange={e => setSha(e.target.value.trim())}/><button onClick={pinSubmission} disabled={busy}>{busy ? "Pinning…" : "Pin this commit"}</button></div></div>
      </section>
      <aside className={styles.evidencePanel}><small>CANDIDATE-VISIBLE EVIDENCE</small><h3>{submission ? `Submission ${submission.sha}` : "Preview before submission"}</h3><p>{submission ? "Immutable evidence record created." : "These are the checks the reviewer will receive. No hidden post-submit test set in this demo."}</p><div className={styles.checks}>{(submission?.checks ?? initialChecks.map(c => ({name:c[0], detail:c[1], duration:c[2], status:"pass"}))).map(check => <div key={check.name}><i>✓</i><span><b>{check.name}</b><small>{check.detail}</small></span><time>{check.duration}</time></div>)}</div>{submission && <div className={styles.pinSuccess}><b>✓ {submission.score}/100 · pinned</b><span>{submission.id}</span></div>}</aside>
    </div>}

    {view === "interview" && <div className={styles.interview}>
      <section className={styles.videoStage}><div className={styles.videoFrame}><video ref={videoRef} autoPlay playsInline muted/><div className={styles.videoPlaceholder}>ML<span>Maya Lin · Staff Engineer</span></div></div><div className={styles.roomControls}><button onClick={startCamera}>Start camera</button><button onClick={shareScreen}>Share screen</button><button>Mute</button><button className={styles.leave}>Leave</button></div></section>
      <aside className={styles.interviewSide}><small>PINNED SUBMISSION</small><h3>8f31c2a</h3><p>add capped jitter and retry telemetry</p><div className={styles.commitMeta}><span>+184</span><span>−32</span><span>8/8 checks</span></div><hr/><small>AI ADVISORY · HUMAN REQUIRED</small><h4>Recommend advancing to team review</h4><p>Evidence is strong. One production-incident assumption should be verified by a human reviewer.</p><div className={styles.decisionButtons}><button onClick={() => setDecision("approved")} className={decision === "approved" ? styles.selectedDecision : ""}>Approve advice</button><button onClick={() => setDecision("override")} className={decision === "override" ? styles.selectedDecision : ""}>Override</button></div><span className={styles.humanNote}>AI cannot move the stage or communicate a hiring decision.</span></aside>
    </div>}
  </div>;
}
