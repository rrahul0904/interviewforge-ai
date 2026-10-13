import Link from "next/link";
import { HiringDemo } from "@/components/hiring-demo";
import styles from "./proofhire.module.css";

export const metadata = {
  title: "ProofHire · InterviewForge",
  description: "Evidence-first technical hiring built around immutable Git submissions.",
};

export default function HiringPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>INTERVIEWFORGE · EMPLOYER WORKSPACE</span>
          <h1>Hire the engineer.<br/><em>Not the performance.</em></h1>
          <p>Every candidate works in real Git, chooses the exact commit they want reviewed, sees every automated check, and carries one evidence trail from application to decision.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#demo">Run the product</a>
            <Link className={styles.secondary} href="/questions">Candidate intelligence →</Link>
          </div>
          <div className={styles.trust}><span>No candidate account required</span><span>Human-only hiring decisions</span><span>Replayable audit trail</span></div>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.window}><i/><i/><i/><span>candidate / alex-morgan / evidence</span></div>
          <div className={styles.commitHead}><div><small>PINNED SUBMISSION</small><strong>8f31c2a</strong></div><span>immutable</span></div>
          <pre>{`01  export async function retry(task) {\n02    for (const delay of jitteredBackoff) {\n03      try { return await task(); }\n04      catch { await sleep(delay); }\n05    }\n06  }`}</pre>
          <div className={styles.commitMeta}><span>+184</span><span>−32</span><span>8/8 checks ✓</span><span>candidate selected</span></div>
        </div>
      </section>

      <section className={styles.principles}>
        <article><b>01</b><h2>Real Git</h2><p>A scoped private repository grant, normal clone/push workflow, and an exact SHA selected by the candidate.</p></article>
        <article><b>02</b><h2>Visible evidence</h2><p>Candidates see the same automated-check breakdown the reviewer sees before they pin a submission.</p></article>
        <article><b>03</b><h2>Human authority</h2><p>AI can summarize and recommend, but it cannot advance, reject, offer, or communicate a hiring decision.</p></article>
        <article><b>04</b><h2>Append-only trail</h2><p>Applications, submissions, checks, reviews, interviews, AI runs, and decisions become replayable events.</p></article>
      </section>

      <section id="demo" className={styles.demoSection}>
        <div className={styles.sectionHead}><span className={styles.eyebrow}>WORKING PRODUCT SLICE</span><h2>One record from challenge to decision.</h2><p>Switch roles below. The candidate flow pins a real SHA-shaped submission through the API and returns a deterministic evidence record.</p></div>
        <HiringDemo />
      </section>
    </main>
  );
}
