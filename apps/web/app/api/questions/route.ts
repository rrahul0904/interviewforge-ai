import { queryQuestions } from "@interviewforge/core";
import { questions } from "@/lib/demo-data";
import { parseQuestionQuery } from "@/lib/question-query";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = parseQuestionQuery(searchParams);
  const result = queryQuestions(questions, query);
  return Response.json({
    data: result.data,
    meta: {
      total: result.total,
      offset: result.offset,
      limit: result.limit,
      nextOffset: result.nextOffset,
      source: "demo-seed",
      query,
    },
  });
}
