import { createAiCoach } from "@interviewforge/ai";
import { getRepositories } from "@/lib/repositories";

export async function POST(request: Request) {
  const body = await request.json() as { slug?: string; code?: string; message?: string };
  const question = body.slug ? await getRepositories().questions.findBySlug(body.slug) : null;
  if (!question) return Response.json({ error: "question_not_found" }, { status: 404 });
  const coach = createAiCoach(process.env.AI_PROVIDER ?? "mock");
  const response = await coach.coach({ question, code: body.code ?? "", message: body.message ?? "Give me a hint." });
  return Response.json(response);
}
