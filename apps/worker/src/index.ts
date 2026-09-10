import { normalizeReport } from "@interviewforge/ingestion";

// Phase 0 worker proves the normalization boundary without polling external sources.
// Phase 1 replaces this heartbeat with a Redis/Postgres-backed durable queue consumer.
const sample = normalizeReport({ sourceUrl:"community://demo", sourceType:"USER_SUBMISSION", body:"Candidate reported a system design interview focused on rate limiting.", company:"Example Co", role:"Platform Engineer" });
console.log(JSON.stringify({ service:"interviewforge-worker", status:"ready", sample }, null, 2));
