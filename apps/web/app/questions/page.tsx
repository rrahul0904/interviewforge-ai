import Link from "next/link";
import { queryQuestions, type Difficulty, type QuestionSort, type Track } from "@interviewforge/core";
import { companies, questions } from "@/lib/demo-data";
import { parseQuestionQuery, queryToSearchParams, type PageSearchParams } from "@/lib/question-query";

const tracks: Array<[Track, string]> = [["CODING","Coding"],["SQL","SQL"],["SYSTEM_DESIGN","System Design"],["ML_SYSTEM_DESIGN","ML System Design"],["OOD","OOD"],["BEHAVIORAL","Behavioral"]];
const difficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const sorts: Array<[QuestionSort, string]> = [["FREQUENCY","Frequency"],["RECENT","Most recent"],["CONFIDENCE","Confidence"]];

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<PageSearchParams> }) {
  const raw = await searchParams;
  const query = parseQuestionQuery(raw);
  const result = queryQuestions(questions, query);
  const previousOffset = Math.max(0, result.offset - result.limit);
  const previousHref = `/questions?${queryToSearchParams(query, { offset: previousOffset }).toString()}`;
  const nextHref = result.nextOffset === null ? null : `/questions?${queryToSearchParams(query, { offset: result.nextOffset }).toString()}`;

  return <main className="container">
    <header className="page-header"><span className="eyebrow">Question intelligence</span><h1>Practice what is showing up now.</h1><p>Each canonical question is backed by independent reports, freshness metadata and a confidence score.</p></header>
    <form className="question-filters panel" method="get">
      <label><span>Search</span><input name="search" defaultValue={query.search} placeholder="rate limiter, SQL, graphs…" /></label>
      <label><span>Company</span><select name="company" defaultValue={query.company ?? ""}><option value="">All companies</option>{companies.map(company => <option key={company.id} value={company.name}>{company.name}</option>)}</select></label>
      <label><span>Track</span><select name="track" defaultValue={query.track ?? ""}><option value="">All tracks</option>{tracks.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label><span>Difficulty</span><select name="difficulty" defaultValue={query.difficulty ?? ""}><option value="">Any difficulty</option>{difficulties.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
      <label><span>Confidence</span><select name="minConfidence" defaultValue={query.minConfidence ?? ""}><option value="">Any confidence</option><option value="0.85">85%+</option><option value="0.90">90%+</option><option value="0.95">95%+</option></select></label>
      <label><span>Sort</span><select name="sort" defaultValue={query.sort ?? "FREQUENCY"}>{sorts.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <div className="filter-actions"><button className="button small" type="submit">Apply filters</button><Link className="button ghost small" href="/questions">Reset</Link></div>
    </form>
    <div className="results-summary"><strong>{result.total} matching questions</strong><span>Showing {result.data.length ? result.offset + 1 : 0}–{result.offset + result.data.length}</span></div>
    <div className="question-list">{result.data.map((q, index) => <Link className="question-row" href={`/questions/${q.slug}`} key={q.id}>
      <span className="question-index">{String(result.offset+index+1).padStart(2,"0")}</span>
      <span className="question-title"><strong>{q.title}</strong><span>{q.companies.join(" · ")} · {q.skills.join(" · ")}</span></span>
      <span className={q.difficulty === "HARD" ? "badge warn" : "badge blue"}>{q.difficulty}</span>
      <span className="score">{q.reportCount} reports</span>
      <span className="score">{Math.round(q.confidence*100)}% conf.</span>
    </Link>)}</div>
    {!result.data.length && <div className="empty-state panel"><h3>No questions matched</h3><p>Broaden the company, track, difficulty or confidence filters.</p><Link className="button ghost small" href="/questions">Clear filters</Link></div>}
    <nav className="pagination" aria-label="Question results pagination">
      {result.offset > 0 ? <Link className="button ghost small" href={previousHref}>Previous</Link> : <span />}
      {nextHref ? <Link className="button ghost small" href={nextHref}>Next</Link> : <span />}
    </nav>
  </main>;
}
