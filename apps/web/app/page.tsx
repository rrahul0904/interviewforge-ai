import Link from "next/link";
import { companies, questions } from "@/lib/demo-data";

const tracks = [
  ["Coding", "Algorithms, data structures, debugging", "146 signals"],
  ["SQL", "Analytics, modeling, query reasoning", "81 signals"],
  ["System Design", "Distributed systems and product architecture", "122 signals"],
  ["ML System Design", "Training, serving, features and evaluation", "49 signals"],
  ["OOD", "Domain modeling and extensible design", "43 signals"],
  ["Behavioral", "Leadership, collaboration and decision evidence", "Coming next"],
];

export default function HomePage() {
  return <main>
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow">Interview intelligence, not question dumping</span>
        <h1>Prepare for the interview they are actually running.</h1>
        <p>Fresh company signals, evidence-backed question attribution, realistic practice and an AI coach that understands the active problem—not a generic chat box.</p>
        <div className="hero-actions"><Link className="button" href="/questions">Explore live intelligence</Link><Link className="button ghost" href="/practice/rate-limiter-design">Open practice room</Link></div>
        <div className="metrics"><div className="metric"><strong>441</strong><span>normalized demo signals</span></div><div className="metric"><strong>92%</strong><span>high-confidence attribution</span></div><div className="metric"><strong>&lt;7d</strong><span>freshness target for hot companies</span></div></div>
      </div>
      <div className="panel signal-board">
        <span className="badge">Intelligence feed</span>
        {questions.slice(0,4).map(q => <Link className="signal-row" href={`/questions/${q.slug}`} key={q.id}><div><strong>{q.title}</strong><p>{q.companies.join(" · ")} · {q.reportCount} independent reports</p></div><span className={q.confidence > .9 ? "badge" : "badge blue"}>{Math.round(q.confidence*100)}% confidence</span></Link>)}
      </div>
    </section>

    <section className="section container">
      <div className="section-head"><div><span className="eyebrow">Practice tracks</span><h2>One preparation system across the whole loop.</h2></div><p>Coding is only one interview surface. InterviewForge keeps the same evidence, company and progress model across every track.</p></div>
      <div className="grid">{tracks.map(([name, desc, count]) => <div className="card" key={name}><div className="card-top"><span className="badge blue">{count}</span></div><h3>{name}</h3><p>{desc}</p></div>)}</div>
    </section>

    <section className="section container">
      <div className="section-head"><div><span className="eyebrow">Company radar</span><h2>Know where the signal is moving.</h2></div><Link href="/questions" className="button ghost small">Browse all questions</Link></div>
      <div className="grid">{companies.slice(0,6).map(c => <Link className="card" href={`/companies/${c.slug}`} key={c.id}><div className="card-top"><h3>{c.name}</h3><span className="badge">{c.freshness}% fresh</span></div><p>{c.questionCount} normalized questions from {c.reportCount} candidate reports.</p><div className="meta"><span>Company collection</span><span>Evidence graph</span></div></Link>)}</div>
    </section>
  </main>;
}
