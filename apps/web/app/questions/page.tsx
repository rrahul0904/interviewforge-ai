import Link from "next/link";
import { questions } from "@/lib/demo-data";

export default function QuestionsPage() {
  return <main className="container">
    <header className="page-header"><span className="eyebrow">Question intelligence</span><h1>Practice what is showing up now.</h1><p>Each canonical question is backed by independent reports, freshness metadata and a confidence score.</p></header>
    <div className="filters"><span className="filter">All tracks</span><span className="filter">Company</span><span className="filter">Difficulty</span><span className="filter">Reported in 30 days</span><span className="filter">High confidence</span></div>
    <div className="question-list">{questions.map((q, index) => <Link className="question-row" href={`/questions/${q.slug}`} key={q.id}>
      <span className="question-index">{String(index+1).padStart(2,"0")}</span>
      <span className="question-title"><strong>{q.title}</strong><span>{q.companies.join(" · ")} · {q.skills.join(" · ")}</span></span>
      <span className={q.difficulty === "HARD" ? "badge warn" : "badge blue"}>{q.difficulty}</span>
      <span className="score">{q.reportCount} reports</span>
      <span className="score">{Math.round(q.confidence*100)}% conf.</span>
    </Link>)}</div>
  </main>;
}
