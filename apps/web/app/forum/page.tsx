import Link from "next/link";
import { getRepositories } from "@/lib/repositories";

export default async function ForumPage(){
  const forumPosts = await getRepositories().forum.list();
  return <main className="container"><header className="page-header"><span className="eyebrow">Candidate community</span><h1>Interview experiences become useful intelligence.</h1><p>Community posts are valuable on their own and can also enter a moderated evidence pipeline without automatically becoming canonical questions.</p></header><div className="filters"><span className="filter">Newest</span><span className="filter">Interview Experiences</span><span className="filter">Compensation</span><span className="filter">Career Development</span><span className="filter">Company Culture</span></div><div className="forum-list">{forumPosts.map(p => <Link href={`/forum/${p.id}`} key={p.id} className="panel forum-card"><span className="avatar">{p.author.slice(0,2).toUpperCase()}</span><div><span className="badge blue">{p.company} · {p.category.replaceAll("_"," ")}</span><h3>{p.title}</h3><p>{p.excerpt}</p><small style={{color:"var(--muted)"}}>by {p.author} · {p.createdAt}</small></div><div className="forum-stats">♥ {p.reactions} · ↪ {p.replies} · ◉ {p.views}</div></Link>)}</div></main>;
}
