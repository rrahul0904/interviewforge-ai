import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepositories } from "@/lib/repositories";

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getRepositories().questions.findBySlug(slug);
  if (!q) notFound();
  return <main className="container">
    <header className="page-header"><span className="eyebrow">{q.track.replaceAll("_", " ")}</span><h1>{q.title}</h1><p>{q.summary}</p><div className="meta"><span>{q.difficulty}</span><span>{q.reportCount} reports</span><span>{Math.round(q.confidence*100)}% confidence</span><span>last reported {q.lastReportedAt}</span></div></header>
    <div className="two-col">
      <article className="panel detail-copy"><h2>Interview prompt</h2><p>{q.summary}</p><h2>Constraints to clarify</h2><ul>{q.constraints.map(x => <li key={x}>{x}</li>)}</ul><h2>Skills this probes</h2><div className="meta">{q.skills.map(s => <span key={s}>{s}</span>)}</div><div className="callout"><strong>Evidence policy</strong><p>This demo question is original content. Production questions retain provenance and moderation status separately from their canonical practice object.</p></div></article>
      <aside className="panel sidebar"><span className="badge">{q.companies.join(" · ")}</span><h3>Practice this question</h3><p>Open the split-screen workspace with progressive hints, test cases and the provider-neutral AI coach.</p><Link className="button" href={`/practice/${q.slug}`}>Open practice room</Link><h3 style={{marginTop:24}}>First hint</h3><p>{q.hints[0]}</p></aside>
    </div>
  </main>;
}
