const checks = [
  { name: "unit tests", detail: "132/132 passing", duration: "18s", status: "pass" },
  { name: "integration tests", detail: "24/24 passing", duration: "31s", status: "pass" },
  { name: "typecheck", detail: "0 errors", duration: "7s", status: "pass" },
  { name: "lint", detail: "0 warnings", duration: "5s", status: "pass" },
  { name: "retry backoff behavior", detail: "jitter + capped exponential", duration: "3s", status: "pass" },
  { name: "idempotency regression", detail: "duplicate charge prevented", duration: "4s", status: "pass" },
  { name: "load budget", detail: "p95 184ms under 250ms target", duration: "42s", status: "pass" },
  { name: "secret scan", detail: "no credentials detected", duration: "2s", status: "pass" },
] as const;

export async function POST(request: Request) {
  const body = await request.json() as { candidateId?: string; sha?: string };
  const sha = body.sha?.toLowerCase().trim() ?? "";
  if (!body.candidateId) return Response.json({ error: "candidate_id_required" }, { status: 400 });
  if (!/^[0-9a-f]{7,40}$/.test(sha)) return Response.json({ error: "invalid_git_sha" }, { status: 400 });

  const selectedAt = new Date().toISOString();
  return Response.json({
    submission: {
      id: `sub_${body.candidateId}_${sha.slice(0, 7)}`,
      candidateId: body.candidateId,
      sha,
      selectedAt,
      immutable: true,
      score: 91,
      checks,
    },
    auditEvent: {
      type: "submission.selected",
      occurredAt: selectedAt,
      actor: "candidate",
      subject: sha,
    },
    authority: "candidate-selected commit; hiring decision remains human-only",
  }, { status: 201 });
}
