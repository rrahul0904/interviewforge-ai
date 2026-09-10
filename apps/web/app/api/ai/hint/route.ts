import { createAiCoach } from "@interviewforge/ai";
import { getQuestion } from "@/lib/demo-data";
export async function POST(request: Request) {
  const body = await request.json() as { slug?: string; code?: string; message?: string };
  const question = body.slug ? getQuestion(body.slug) : undefined;
  if (!question) return Response.json({ error: "question_not_found" }, { status: 404 });
  const coach = createAiCoach(process.env.AI_PROVIDER ?? "mock");
  const response = await coach.coach({ question, code: body.code ?? "", message: body.message ?? "Give me a hint." });
  return Response.json(response);
}
