import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, questions } from "@/lib/demo-data";

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();
  const matched = questions.filter(q => q.companies.some(c => c.toLowerCase() === company.name.toLowerCase()));
  return <main className="container"><header className="page-header"><span className="eyebrow">Company intelligence</span><h1>{company.name} interview radar</h1><p>{company.reportCount} evidence reports currently support {company.questionCount} normalized signals across interview tracks.</p><div className="metrics"><div className="metric"><strong>{company.questionCount}</strong><span>questions</span></div><div className="metric"><strong>{company.reportCount}</strong><span>candidate reports</span></div><div className="metric"><strong>{company.freshness}%</strong><span>freshness score</span></div></div></header><section className="section"><div className="section-head"><div><h2>Recently observed themes</h2><p>Demo subset from the local seed. The production page will be database-backed and cursor-paginated.</p></div></div><div className="grid">{matched.length ? matched.map(q => <Link className="card" href={`/questions/${q.slug}`} key={q.id}><span className="badge blue">{q.track.replaceAll("_"," ")}</span><h3>{q.title}</h3><p>{q.summary}</p><div className="meta"><span>{q.reportCount} reports</span><span>{Math.round(q.confidence*100)}% confidence</span></div></Link>) : <div className="card"><h3>Collection scaffold is ready</h3><p>No demo question has been seeded for this company yet.</p></div>}</div></section></main>;
}
