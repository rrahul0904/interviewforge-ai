import { parseQuestionQuery } from "@/lib/question-query";
import { getRepositories } from "@/lib/repositories";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = parseQuestionQuery(searchParams);
  const { questions } = getRepositories();
  const result = await questions.list(query);
  return Response.json({
    data: result.data,
    meta: {
      total: result.total,
      offset: result.offset,
      limit: result.limit,
      nextOffset: result.nextOffset,
      source: process.env.DATA_BACKEND ?? "demo",
      query,
    },
  });
}
