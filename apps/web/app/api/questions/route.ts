import { questions } from "@/lib/demo-data";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company")?.toLowerCase();
  const track = searchParams.get("track")?.toUpperCase();
  const result = questions.filter(q => (!company || q.companies.some(c => c.toLowerCase() === company)) && (!track || q.track === track));
  return Response.json({ data: result, meta: { count: result.length, source: "demo-seed" } });
}
