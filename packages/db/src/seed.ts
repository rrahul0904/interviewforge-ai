import { createDb } from "./client";
import { companies, questions } from "./schema";
async function main(){ const db=createDb(); const [openai] = await db.insert(companies).values({slug:"openai",name:"OpenAI"}).onConflictDoNothing().returning(); if(openai){ await db.insert(questions).values({slug:"rate-limiter-design",title:"Design a distributed rate limiter",track:"SYSTEM_DESIGN",difficulty:"HARD",summary:"Design a low-latency global rate limiting service.",published:true,confidence:.94,reportCount:12,frequencyScore:91}).onConflictDoNothing(); } console.log("seed complete"); process.exit(0); }
main().catch(err=>{ console.error(err); process.exit(1); });
