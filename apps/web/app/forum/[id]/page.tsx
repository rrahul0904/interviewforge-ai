import { notFound } from "next/navigation";
import { getRepositories } from "@/lib/repositories";

export default async function ThreadPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const post=await getRepositories().forum.findById(id);
  if(!post) notFound();
  return <main className="container"><header className="page-header"><span className="eyebrow">Forum thread</span><h1>{post.title}</h1><div className="meta"><span>{post.company}</span><span>{post.category.replaceAll("_"," ")}</span><span>{post.views} views</span></div></header><article className="panel thread"><p>{post.excerpt}</p><p>This seeded thread demonstrates the forum detail state. In Phase 1, authenticated users can create posts, reply, react and report content. Moderation is kept separate from question canonicalization.</p><div className="reply"><strong>system_design_nerd</strong><p>The operational follow-ups are the interesting part. I would prepare concrete failure-mode examples, not only a happy-path diagram.</p></div><div className="reply"><strong>candidate42</strong><p>Did they expect exact capacity math, or was it more about assumptions and trade-offs?</p></div></article></main>;
}
