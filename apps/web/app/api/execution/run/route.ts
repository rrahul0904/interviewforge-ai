import { createExecutionProvider } from "@interviewforge/execution";
export async function POST(request: Request) {
  const body = await request.json() as { language?: string; code?: string };
  const provider = createExecutionProvider(process.env.EXECUTION_PROVIDER ?? "mock");
  const result = await provider.run({ language: body.language ?? "python", code: body.code ?? "", tests: [] });
  return Response.json(result);
}
