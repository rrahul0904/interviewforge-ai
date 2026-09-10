import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepositories } from "@/lib/repositories";

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repositories = getRepositories();
  const [company, matched] = await Promise.all([
    repositories.companies.findBySlug(slug),
    repositories.companies.questionsForCompany(slug, { sort: "FREQUENCY", limit: 25 }),
  ]);
  if (!company) notFound();
  return <main className="container"><header className="page-header"><span className="eyebrow">Company intelligence</span><h1>{company.name} interview radar</h1><p>{company.reportCount} evidence reports currently support {company.questionCount} normalized signals across interview tracks.</p><div className="metrics"><div className="metric"><strong>{company.questionCount}</strong><span>questions</span></div><div className="metric"><strong>{company.reportCount}</strong><span>candidate reports</span></div><div className="metric"><strong>{company.freshness}%</strong><span>freshness score</span></div></div></header><section className="section"><div className="section-head"><div><h2>Recently observed themes</h2><p>Repository-backed collection view. The demo adapter can be swapped for PostgreSQL without changing this route.</p></div></div><div className="grid">{matched.data.length ? matched.data.map(q => <Link className="card" href={`/questions/${q.slug}`} key={q.id}><span className="badge blue">{q.track.replaceAll("_"," ")}</span><h3>{q.title}</h3><p>{q.summary}</p><div className="meta"><span>{q.reportCount} reports</span><span>{Math.round(q.confidence*100)}% confidence</span></div></Link>) : <div className="card"><h3>Collection scaffold is ready</h3><p>No demo question has been seeded for this company yet.</p></div>}</div></section></main>;
}
