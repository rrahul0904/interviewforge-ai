export async function GET() {
  return Response.json({ ok: true, service: "interviewforge-web", version: "0.1.0" });
}
